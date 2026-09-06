# Borrower Copilot — Rules, Formulas, and Assumptions

## Scope and classification

All numeric rules below are **Borrower Copilot assumptions** or **implementation decisions** unless explicitly labelled otherwise. They are not RBI requirements and do not represent a lender approval policy. “Common lending concept/practice” labels describe the concept only, not a mandated value.

| What | Value | Why | Source / My judgement |
|---|---:|---|---|
| Product role | Decision support, not approval | The app estimates affordability and negotiation targets | Product-specific |
| Currency | INR | UI and calculation copy are India-oriented | Product-specific |
| Age accepted by validation | 18–80 inclusive | Limits form entry to adults and a bounded range | Implementation decision |
| Age field configuration | 18–75 | Question metadata conflicts with validation’s upper bound | Implementation discrepancy |
| Maximum-age underwriting / tenure impact | Not implemented | Age is collected but does not enter any engine formula | Known limitation |

## Intake and adaptive questions

The form always asks age, purpose, loan type, requested amount, employment type, monthly income range, other household income, household expenses, existing EMI, and whether a credit score is known. The score field appears only after “yes.” Employment follow-ups are salaried: employer tenure and emergency savings; self-employed: business years and annual ITR income; informal: emergency savings, recent bounce, and upcoming expenses. LAP/gold insert security availability immediately after product selection and then collateral value only when available.

| What | Value | Why | Source / My judgement |
|---|---:|---|---|
| Loan request UI range | ₹10,000–₹1,00,00,000 | Form metadata; validation only requires > ₹0 | Implementation decision |
| Income range | Both ends must be > ₹0; high cannot be below low | Enables average and variation calculation | Implementation decision |
| Credit score input | 300–900 when known | Form validation | Implementation decision |
| Other household income / expenses / EMI | Must be ≥ ₹0 | Zero is a valid reported value | Implementation decision |
| Secured products that trigger security questions | LAP, gold | Those are modeled as security-dependent | Product-specific |
| Product options by purpose | Vehicle: two-wheeler/personal/gold; home: home/LAP/gold; productive: business/LAP/gold; essential/discretionary/education: personal/gold; debt repayment: personal/LAP/gold | Constrains the UI to a product-purpose map | Product-specific |

## Income and employment

Employment type changes FOIR thresholds only. The additional salaried, business, informal, savings, ITR, and upcoming-expense fields are collected, but none currently affects a calculation. `pastBounces` is an exception: when the boolean answer is built into the profile, `true` becomes `1` and `false` becomes `0`.

```text
averageIncome = (incomeMin + incomeMax) / 2
variation = (incomeMax − incomeMin) / averageIncome
normalizedBorrowerIncome = averageIncome × stabilityHaircut
```

| What | Value | Why | Source / My judgement |
|---|---:|---|---|
| Stable income | variation ≤ 20%; haircut 100% | No model reduction | Borrower Copilot assumption |
| Variable income | variation >20% and ≤40%; haircut 85% | Retains a 15% buffer | Borrower Copilot assumption |
| Highly variable income | variation >40%; haircut 70% | Retains a 30% buffer | Borrower Copilot assumption |
| Invalid/non-positive range in profile builder | highly variable | Defensive fallback; UI validation normally prevents it | Implementation decision |
| Salaried FOIRs | lender 50%; safe 40% | More stable income gets the highest modeled ceilings | Borrower Copilot assumption |
| Self-employed FOIRs | lender 45%; safe 35% | Extra modeled uncertainty buffer | Borrower Copilot assumption |
| Informal FOIRs | lender 40%; safe 30% | Most conservative modeled ceiling | Borrower Copilot assumption |

FOIR is a **common lending concept/practice** (obligations divided by income); these percentages are not universal lender thresholds.

## Existing loans input

The questionnaire now collects existing loans as a structured list rather than a single flat EMI figure. The first question asks whether the borrower has any active loans or EMIs (boolean). If yes, they add one or more loans with the following fields:

| Field | Required | Notes |
|---|---|---|
| Loan type | Yes | personal, home, LAP, gold, two-wheeler, business |
| Outstanding amount | Yes | Total principal remaining on the loan; must be ≥ 0 |
| Monthly EMI | Yes | Fixed monthly payment; must be ≥ 0 |
| Interest rate (% p.a.) | No | If provided, must be 0–100%; not used in current affordability calculation |
| Remaining tenure (months) | No | If provided, must be > 0; not used in current affordability calculation |

| What | Value | Why | Source / My judgement |
|---|---:|---|---|
| Monthly EMI | Used in FOIR and safe-EMI calculation | EMI is the monthly cash-flow cost of existing debt | Common lending concept |
| Outstanding amount | Collected and shown as context; not added to monthly obligations | Outstanding is the total debt remaining, not a monthly cost | Implementation decision |
| Total existing EMI | `sum(existingLoans[].emi)` | Aggregated across all loans | Implementation decision |
| Total outstanding | `sum(existingLoans[].outstanding)` | Shown in results for context only | Implementation decision |
| Interest rate | Collected; stored in `ExistingLoan.interestRate`; unused by engine | Optional debt-context field | Known limitation |
| Remaining tenure | Collected; stored in `ExistingLoan.remainingMonths`; unused by engine | Optional debt-context field | Known limitation |
| Outstanding ≠ EMI | They are explicitly separate fields with different labels | Prevents the common borrower error of confusing debt balance with monthly payment | Implementation decision |
| hasExistingLoans = No | `existingLoans = []`; existing EMI = ₹0 | Explicit zero, not unknown | Implementation decision |
| Hard-stop timing | Triggered after both `hasExistingLoans` and (if yes) `existingLoansList` are answered | Wait for the full loan list before computing no-cash-flow stop | Implementation decision |

## Household affordability and existing debt

```text
existingEMI = sum(existingLoans[].emi)
householdIncome = normalizedBorrowerIncome + otherHouseholdIncome
disposableIncome = max(0, householdIncome − householdExpenses − existingEMI)

lenderTotalEMICapacity = normalizedBorrowerIncome × lenderFOIR
lenderNewEMICapacity = max(0, lenderTotalEMICapacity − existingEMI)

safeTotalEMICapacity = householdIncome × safeFOIR
safeFOIRCapacity = max(0, safeTotalEMICapacity − existingEMI)
expenseConstrainedEMI = disposableIncome × 50%
safeNewEMICapacity = min(safeFOIRCapacity, expenseConstrainedEMI)
```

| What | Value | Why | Source / My judgement |
|---|---:|---|---|
| Other household income | Added only to household/safe affordability | Separates household resilience from income a lender may accept | Borrower Copilot assumption |
| Lender-style capacity | Excludes other household income and expenses | Uses normalized borrower income and existing EMI only | Implementation decision |
| Household expenses | Reduce disposable income and the 50% expense constraint | Preserves half of post-expense cash flow for non-loan needs/uncertainty | Borrower Copilot assumption |
| Existing-loan detail used | EMI only | Outstanding balance is now collected and shown; interest rate and remaining months exist in the type but are unused | Partial implementation |
| No cash-flow hard stop | household income − expenses − existing EMI ≤ 0 | No remaining monthly cash flow for another EMI | Borrower Copilot assumption |
| Existing-debt warning | existing EMI / normalized income ≥30% | Risk/rate warning | Borrower Copilot assumption |
| Critical existing debt | ratio ≥40% | Critical risk signal; can combine with weak credit for `DON'T BORROW` | Borrower Copilot assumption |
| Unused threshold constants | `highDebtRatio` 50%, `recentBouncePenalty` true | Declared but not referenced by the engines | Implementation limitation |

The questionnaire requires values for household income, expenses, and existing EMI; a reported `0` is explicit data, not unknown. In programmatic profiles, omitted household income and loans fall back to zero, while omitted expenses become `undefined` and can propagate `NaN`; this path is not UI-safe.

## Products, collateral, and fair rate

| Product | Base annual band | Typical tenure metadata | Secured? | Source / My judgement |
|---|---:|---|---|---|
| Personal | 11%–16% | 24/36/48/60 | No | Product-specific assumption |
| Business | 11%–17% | 24/36/48/60 | No | Product-specific assumption |
| LAP | 9%–13% | 60/84/120/180 | Yes | Product-specific assumption |
| Gold | 9%–15% | 12/24/36 | Yes | Product-specific assumption |
| Two-wheeler | 10%–15% | 24/36/48/60 | Yes in metadata | Product-specific assumption |
| Home | 8%–11% | 120/180/240 | Yes in metadata | Product-specific assumption |

The rate engine duplicates the base bands above. The assessment calculations use only 36/48/60 months for every product; `typicalTenures`, and secured status for home/two-wheeler, are not consumed. Only LAP and gold get the security hard stop/collateral cap.

| What | Value | Why | Source / My judgement |
|---|---:|---|---|
| Excellent / good / fair score | ≥750 / ≥700 / ≥650 | Pricing and risk buckets | Borrower Copilot assumption |
| 550–649 score | rate +1/+1.5 percentage points (min/max) | Higher modeled risk | Borrower Copilot assumption |
| <550 score | rate +2/+3 points; critical `very_weak_credit` signal | Higher modeled risk | Borrower Copilot assumption |
| ≥750 score | rate −1/−1.5 points | Better modeled pricing | Borrower Copilot assumption |
| 700–749 score | rate −0.5/−0.75 points | Better modeled pricing | Borrower Copilot assumption |
| 650–699 score | no rate adjustment | Fair baseline | Borrower Copilot assumption |
| Unknown score | no numeric adjustment; rate explanation says wider/no discount; confidence loses 2 weight | Unknown is not scored as zero | Implementation decision |
| Variable / highly variable income | rate +0.5/+1 or +1/+2 points | Modeled repayment uncertainty | Borrower Copilot assumption |
| Existing EMI ratio | ≥40%: +1/+2; ≥30%: +0.5/+1; otherwise, if EMI >0: +0.25/+0.5 | Modeled debt risk | Borrower Copilot assumption |
| Recent bounce | +1/+2 points when `pastBounces > 0` | Modeled repayment stress | Borrower Copilot assumption |
| Rate floor/cap | min ≥6%; max ≤24%; if crossed, min = max −1 | Keep output bounded | Implementation decision |
| LAP/gold without confirmed security | `DON'T BORROW` | Product cannot proceed in this prototype | Product-specific |
| LAP collateral cap | 60% of supplied value | LTV-like cap | Borrower Copilot assumption |
| Gold collateral cap | 70% of supplied value | LTV-like cap | Borrower Copilot assumption |

`rateRules.ts` also declares different credit adjustments (for example excellent −1 and unknown +1.5), but no engine imports it. Those values have no runtime effect.

## Amount, EMI, tenure, and APR

```text
monthlyRate = annualRate / 12 / 100
EMI = P × monthlyRate × (1 + monthlyRate)^n / ((1 + monthlyRate)^n − 1)
loanAmountFromEMI = EMI × ((1 + monthlyRate)^n − 1) / (monthlyRate × (1 + monthlyRate)^n)
```

Both lender amount and safe affordability amount convert capacity at the midpoint of the fair-rate band for 36, 48, and 60 months. Their range is the minimum/maximum of those conversions. The safe maximum is the largest affordability conversion, further capped by available LAP/gold collateral; its minimum is `min(requestedAmount, safeMax)`. Lender amount never applies collateral/LTV.

The results’ tenure illustrations always use 36/48/60 months and midpoint rate. The recommendation selects the longest of those whose EMI is within safe new-EMI capacity; otherwise it falls back to 60 months. Recommended amount is `min(requestedAmount, safeMax)`, except `DON'T BORROW` changes it to zero.

```text
fee = amount × processingFeePercent / 100
feeImpact = (fee / amount) × (12 / tenureMonths) × 100
APR band = fair-rate band + feeImpact
```

The fee defaults to 0 and comes only from the first optional `offers[]` item; the UI does not collect offers, so normal UI APR equals fair rate. This is a simplified annualized fee impact, not an IRR/APR calculation and does not include taxes, insurance, late charges, disbursal timing, or other fees.

## Stress, decision, and confidence

| What | Value | Why | Source / My judgement |
|---|---:|---|---|
| Stress scenario | Household income falls 20% | Tests a single income shock | Borrower Copilot assumption |
| Stressed FOIR | `(existingEMI + proposedEMI) / (householdIncome × 80%)` | Measures stressed repayment share | Implementation decision |
| Stress status | safe ≤30%; tight ≤40%; unsafe >40%; zero proposed EMI = unsafe | Labels repayment pressure | Borrower Copilot assumption |
| Rate-increase stress | Not implemented | `rateIncrease: 0.02` is declared but unused | Known limitation |
| `DON'T BORROW` | Missing LAP/gold security; no remaining cash flow; safe EMI ≤0; very weak credit plus unsafe stress/critical debt/bounce; or safe max <50% of request | Hard stops | Borrower Copilot assumption |
| `BORROW LESS` | Safe max < request; or unsafe stress; or very weak credit | Smaller/safer route | Borrower Copilot assumption |
| `BORROW` | Otherwise; tight stress still permits borrow with a reason | Baseline decision outcome | Borrower Copilot assumption |
| Confidence weights | Income 3, employment 2, expenses 3, existing-loan array 3, amount 2, purpose 1, credit 2, stability 2, age 1 | Completeness proxy | Implementation decision |
| Confidence score/level | completed weight ÷19, capped at 0.90; high ≥0.80, medium ≥0.60, else low | Avoids claiming certainty | Implementation decision |

The unused `CONFIDENCE_RULES` constants (low .50, medium .75, high .90) do not set runtime levels.

## Negotiation Card and known limitations

The card shows requested amount, recommended/target amount, safe-EMI ceiling, fair-rate band, APR ceiling (the maximum of the APR band), and the same decision/rate/safe-EMI/product-fit reasons. It creates wording based on decision: decline/seek alternatives for `DON'T BORROW`, or a target amount/EMI and APR disclosure request otherwise.

Known limitations: no lender/product data, verification, bureau pull, co-applicant logic, age/tenure eligibility, employment-tenure, ITR, savings, upcoming-expense, or loan-purpose effect; outstanding balance, interest rate, and remaining tenure are collected but do not alter any current engine formula; no home/two-wheeler security/LTV; no use of product tenure metadata; no rate-rise stress; no real APR/fee model; and the computed lender-style amount is absent from the UI. Product fit is nearly unreachable through the UI because the product selector is purpose-filtered.
