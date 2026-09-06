# Persona Tests — Reproducible Manual Run-Throughs

## Important reproducibility note

The supplied persona brief omits inputs the current form requires. Ravi and Anita have no household-expense figure; Anita also has no total monthly EMI despite an outstanding balance. The app cannot complete without those entries. This document records exact supplied data and actual conditional questions; it does not turn unknowns into zero or invent budgets, product choices, or EMI amounts.

The engine returns a lender-style amount, but the result UI does not display it.

## Priya

### Profile

| Parameter | Value |
|---|---|
| Age / location / employment | 29 / Bengaluru / salaried |
| Employment history | Software engineer at a large MNC for 5 years |
| Monthly income | ₹1,10,000 net; fixed range: ₹1,10,000–₹1,10,000 |
| Existing loan | Car loan, ₹14,000 EMI, 2 years left |
| Credit score | 780 |
| Stated housing cost | ₹28,000 rent |
| Request | ₹8,00,000 personal loan for wedding |
| Other household income | Not supplied |
| Full household expenses | Not supplied; rent is not necessarily the entire answer requested by the form |

### Questions Asked

| Question | Answer | Why It Was Asked |
|---|---|---|
| How old are you? | 29 | Always asked |
| What are you considering this loan for? | Personal / lifestyle is closest for a wedding | Required product-purpose classification; no exact wedding option exists |
| What type of loan are you considering? | Personal loan | Offered for that purpose |
| How much are you planning to borrow? | ₹8,00,000 | Required request |
| How do you currently earn your income? | Salaried | Selects FOIR branch and follow-ups |
| What is your monthly income range? | ₹1,10,000–₹1,10,000 | Fixed income rendered as a range |
| Does anyone else in your household have regular income? | Not supplied | Required form input |
| How much do you spend on household expenses each month? | Not supplied (₹28,000 rent is only stated component) | Required safe-affordability input |
| How much do you currently pay toward loans each month? | ₹14,000 | Given car-loan EMI |
| Do you know your credit score? | Yes | Always asked |
| What is your credit score? | 780 | Appears after Yes |
| How long have you been with your current employer? | 60 months if the 5 years is entered | Salaried-only optional; unused by engine |
| How many months of expenses could savings cover? | Not supplied | Salaried-only optional; unused by engine |

### Result

No exact current-app result is reproducible: other household income and full household expenses are required before completion. Treating ₹28,000 as the whole expense answer would be an undocumented assumption and could overstate safe capacity. Therefore an actual decision, lender-style amount, borrower-safe amount, rate/APR, safe EMI, tenure options, stress test, confidence, and Negotiation Card cannot be reported without fabrication.

### Why This Result Makes Sense

The known profile is strong on fixed income, five years’ employment, and a 780 score, with a ₹14,000 existing EMI. The engine would classify the fixed range as stable and use salaried 50% lender / 40% safe FOIR. Household expenses directly constrain safe EMI, so a borrower-safe number requires the missing data.

### Observed Issue

The age input advertises a maximum of 75 but validation accepts 80. Neither age nor employer tenure changes an engine result.

## Ravi

### Profile

| Parameter | Value |
|---|---|
| Age / location / employment | 42 / Mysuru / self-employed |
| Business | Kirana store, operating 14 years |
| Monthly cash income | ₹40,000–₹80,000 |
| Annual ITR income | ₹4,20,000 |
| Credit | No formal loan; no credit score |
| Other household income | Wife earns ₹18,000/month teaching |
| Existing debt | None stated |
| Collateral | Unencumbered shop premises, approximately ₹45,00,000 |
| Request | ₹15,00,000 for stock line and delivery vehicle |
| Household expenses | Not supplied |

### Questions Asked

| Question | Answer | Why It Was Asked |
|---|---|---|
| How old are you? | 42 | Always asked |
| What are you considering this loan for? | Productive / business use | Closest supplied purpose |
| What type of loan are you considering? | Not specified; business loan, LAP, and gold are offered | Required selection; collateral does not choose product |
| Security questions | Only after LAP/gold; the brief supports Yes and ₹45,00,000 for LAP | Conditional |
| How much are you planning to borrow? | ₹15,00,000 | Given request |
| How do you currently earn income? | Self-employed | Selects self-employed branch |
| What is your monthly income range? | ₹40,000–₹80,000 | Given cash-income range |
| Does anyone else in household have regular income? | ₹18,000 | Given wife’s income |
| How much do you spend on household expenses each month? | Not supplied | Required input |
| How much do you currently pay toward loans each month? | ₹0 if “never taken a formal loan” is entered as no current EMI | Required; this interprets the stated absence |
| Do you know your credit score? | No | Score field is skipped |
| How long has your business been operating? | 14 years | Optional; unused by engine |
| What annual income do you report in ITR? | ₹4,20,000 | Optional; unused by engine |

### Result

No exact result is reproducible because household expenses are missing and no offered product is selected. A LAP path would model a ₹27,00,000 collateral cap (60% of ₹45,00,000); a business-loan path would not. Choosing LAP for Ravi would invent a material product decision.

### Why This Result Makes Sense

₹40,000–₹80,000 has 66.67% midpoint variation, hence is highly variable; its ₹60,000 average gets a 70% haircut to ₹42,000. The wife’s ₹18,000 supports borrower-safe household affordability but not lender-style capacity. The ITR and 14-year history are collected but unused. Unknown credit is not zero: it receives no discount and loses confidence weight.

### Observed Issue

The app does not route Ravi to LAP despite available property. Its product tenure metadata is not used: calculations still use only 36/48/60 months.

## Anita

### Profile

| Parameter | Value |
|---|---|
| Age / location / employment | 35 / Hubballi / informal |
| Income | ₹26,000–₹30,000/month from delivery riding and tailoring |
| Household | Two children; husband unemployed for 8 months |
| Existing loans | Three app loans, ₹35,000 outstanding, stated 30%+ rate |
| Repayment history | One EMI bounced last month |
| Request | ₹1,50,000 electric scooter to increase delivery runs |
| Other household income / expenses | Not supplied |
| Existing monthly EMI total | Not supplied |

### Questions Asked

| Question | Answer | Why It Was Asked |
|---|---|---|
| How old are you? | 35 | Always asked |
| What are you considering this loan for? | Vehicle | Closest supplied purpose |
| What type of loan are you considering? | Not specified; two-wheeler, personal, and gold are offered | Required product selection |
| Security questions | Only after gold; no gold data supplied | Conditional |
| How much are you planning to borrow? | ₹1,50,000 | Given request |
| How do you currently earn income? | Informal / variable work | Selects informal branch |
| What is your monthly income range? | ₹26,000–₹30,000 | Given range |
| Other household income / expenses / existing EMI | Not supplied | All are required inputs |
| Do you know your credit score? | Not supplied | Required yes/no input |
| Savings cover / large upcoming expenses | Not supplied | Informal optional inputs; unused by engine |
| Have you had a recent EMI or loan payment bounce? | Yes | Informal optional input; affects rate/risk |

### Result

No exact result is reproducible. The app needs a product, household-income entry, expenses, total current EMI, and credit-score-known answer. ₹35,000 outstanding at 30%+ does not derive an EMI in this app because it ignores outstanding balance, rate, and remaining tenure when calculating affordability.

### Why This Result Makes Sense

The known range has 14.29% midpoint variation, so the app labels it stable and applies no haircut despite informal work. Informal employment still uses 40% lender / 30% safe FOIR. A recent bounce creates a high risk signal and adds 1–2 percentage points to the rate. Guessing the missing EMI could change the result to an early no-cash-flow stop, so the data cannot be inferred.

### Observed Issue

The bounce question stores a boolean as 1/0. The app does not ask when/how many bounces occurred or derive EMI from the three loans, and it treats a narrow informal-income range as stable.
