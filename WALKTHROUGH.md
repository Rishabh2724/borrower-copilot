# Borrower Copilot — Five-Minute Walkthrough

## 1. Product Overview

Borrower Copilot is a borrower-first prototype for someone deciding whether to take a loan, what amount is comfortable, what an indicative fair rate looks like, and what EMI should remain acceptable. It deliberately presents a conservative borrower-safe view alongside a lender-style estimate rather than treating a possible sanction as a recommendation.

## 2. User Journey

Start → Questions → Assessment → Results → Negotiation Card

The user starts a local, client-side assessment. The form collects borrowing context and cash flow. On completion it builds a profile, runs the assessment engine, and shows a decision, repayment illustrations, stress test, confidence, and—except for a Don’t Borrow decision—a Negotiation Card.

## 3. Adaptive Question Engine

Everyone answers age, purpose, product, amount, employment, income range, household income/expenses, existing EMI, and credit-score availability. The product list is filtered by purpose. LAP and gold insert security questions; collateral value appears only after security is available. The credit-score field appears only after a borrower says they know it. Salaried, self-employed, and informal borrowers receive different follow-ups.

The app also stops early after existing EMI if normalized income plus other household income, minus expenses and EMI, is non-positive. It then produces a no-capacity assessment rather than asking later questions that cannot change that hard stop.

## 4. Borrower Profile

The profile stores the income range, then derives stability from its spread. It carries household income separately from borrower income, retains existing EMIs, product and purpose, optional credit score, collateral, and some employment-specific data. Several optional inputs are currently informational only: employer tenure, business years, ITR income, emergency savings, and upcoming expenses do not affect the engine.

## 5. Rules Engine

- Income normalization: midpoint income gets a 100%, 85%, or 70% haircut for stable, variable, or highly variable income.
- FOIR: lender-style capacity uses 50%/45%/40% for salaried/self-employed/informal; safe capacity uses 40%/35%/30%.
- Safe EMI: the smaller of safe-FOIR headroom and 50% of post-expense household cash flow.
- Lender-style amount: converts lender new-EMI capacity to amounts using midpoint rate and 36/48/60 month terms.
- Rate: begins with a product band, then adjusts for credit, income variability, debt burden, and bounce history.
- EMI: uses the standard reducing-balance amortization formula.
- Stress: lowers household income by 20% and labels stressed FOIR safe at ≤30%, tight at ≤40%, and unsafe above 40%.
- Confidence: is a weighted completeness score, capped at 90%.

The exact values and formulas are documented in [RULES.md](RULES.md).

## 6. Lender Capacity vs Borrower-Safe Capacity

Lender-style capacity uses normalized borrower income and existing EMIs. It ignores household expenses and does not include another household member’s income. It is a modeled estimate, not a lender commitment.

Borrower-safe capacity uses normalized borrower income plus reported regular household income, deducts household expenses and existing EMIs, applies the lower safe FOIR, and preserves half of residual cash flow. That makes it intentionally more conservative and more sensitive to the borrower’s lived budget.

## 7. Persona Walkthrough

The supplied three personas reveal an important current limitation:

- Priya: her income, car EMI, score, and rent are given, but the form still needs other-household-income and total household-expense answers.
- Ravi: his variable income, ITR, wife’s income, and property are given, but the form needs household expenses and a product choice. The app does not automatically route him to LAP.
- Anita: her income, app-loan balance, and bounce are given, but the form needs total current EMI, expenses, a product, and credit-score availability. Outstanding balance is not converted into EMI.

Accordingly, the exact brief cannot produce fully reproducible app outputs without invented inputs. [PERSONA_TESTS.md](PERSONA_TESTS.md) records the real question paths and explains why.

## 8. Negotiation Card

For Borrow or Borrow Less, the card provides the requested amount, a recommended target amount, safe new-EMI ceiling, fair-rate band, maximum target APR, calculation reasons, and suggested wording for a lender conversation. It asks the borrower to seek disclosure of all mandatory charges. For Don’t Borrow, the UI instead foregrounds the reason, safe EMI, request, and safe capacity; the engine still constructs a card object but the UI does not render it.

## 9. Important Assumptions

FOIR ceilings, income haircuts, rate bands and adjustments, collateral caps, stress thresholds, and the 50% post-expense buffer are application-specific assumptions. They are not RBI rules or verified lender policies. Credit unknowns are not treated as zero; they reduce confidence and remove a potential pricing discount.

## 10. Known Limitations

There is no income, credit, collateral, or lender-policy verification; no co-applicant calculation; no maximum-age/tenure rule; no dynamic lender/product data; no home/two-wheeler collateral model; no use of ITR or savings in math; no rate-rise stress; and no IRR-style APR. The UI also omits its internally calculated lender-style amount.

## 11. What I Would Build Next

1. Close the required-input gaps and model each existing loan’s EMI, balance, rate, and remaining term.
2. Add verified/lender-specific policy and product data with clear source and date labels.
3. Use ITR, business history, savings, co-applicants, and collateral consistently where collected.
4. Add lender-relevant tenure/age rules, product-specific security logic, fees, and IRR-based APR.
5. Expand stress testing to income volatility, rate increases, debt repayment changes, and expenses.

## 12. What I Would Cut

I would not add account aggregation, a lender marketplace, bureau pulls, document uploads, or a broad financial dashboard to this take-home. Those features add integration and privacy complexity without improving the core borrower decision, explainability, and negotiation target demonstrated here.
