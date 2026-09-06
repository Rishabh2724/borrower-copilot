# Rules & Assumptions

## Core Principles
- **Conservative by design:** Protects borrowers from over-borrowing
- **Risk-aware:** Multiple risk factors compound
- **Transparent:** All thresholds documented
- **Not regulatory:** Modeling choices for decision-support

---

## Income Parameters

### Stability Haircuts
- Stable: 100%
- Variable: 85%
- Highly Variable: 70%

### ITR Verification (Self-Employed)
- Gap >50%: Use ITR only
- Gap 25-50%: Blend 70% ITR + 30% stated
- Gap <25%: Accept stated income

---

## FOIR (Fixed Obligations to Income Ratio)

### Lender FOIR (Maximum)
- Salaried: 50%
- Self-employed: 45%
- Informal: 40%

### Safe FOIR (Conservative)
- Salaried: 40%
- Self-employed: 35%
- Informal: 30%

---

## Debt Thresholds

### Monthly EMI Ratios
- ≥40%: Critical
- ≥30%: High warning
- >0%: Existing debt

### DTI (Debt-to-Income) Ratios
- ≥4x: Very high → DON'T BORROW
- 3-4x: High risk → BORROW LESS or DON'T BORROW
- 2-3x: Elevated risk
- <2x: Manageable

---

## Credit Score Bands

### Score Ranges
- Excellent: ≥750 (−1.0% rate adjustment)
- Good: 700-749 (−0.25% adjustment)
- Fair: 650-699 (+1.0% adjustment)
- Poor: <650 (+2.5% adjustment)
- Unknown: (+1.5% adjustment)

---

## Product Base Rates (% p.a.)

| Product      | Min  | Max  | Secured |
|--------------|------|------|---------|
| Home         | 8    | 11   | Yes     |
| LAP          | 9    | 13   | Yes     |
| Gold         | 9    | 15   | Yes     |
| Two-wheeler  | 10   | 15   | Yes     |
| Personal     | 11   | 16   | No      |
| Business     | 11   | 17   | No      |

---

## Affordability Rules

### Disposable Income
```
Disposable = Normalized Income - Rent - Dependents - Existing EMIs
```

### Safe EMI Capacity
```
Safe EMI = 50% × Disposable Income
```

### Why 50%
- Preserves buffer for emergencies
- Allows for savings capacity
- Conservative approach

---

## Collateral Parameters

### LTV (Loan-to-Value) Limits
- LAP: 60% (conservative for property)
- Gold: 70% (liquid asset, higher)

---

## Stress Test

### Scenarios
- Income drop: 20%
- Rate increase: 2%

### Stressed FOIR Levels
- Safe: ≤30%
- Tight: 30-40%
- Unsafe: >40%

---

## Risk Signal Severity

### Critical
- DTI ≥4x
- Credit score <550 + unsafe stress/bounce/critical debt
- No remaining cash flow
- Request >2× safe capacity

### High
- DTI 3-4x
- Monthly EMI ≥40%
- Credit score <550
- Recent payment bounce

### Medium
- DTI 2-3x
- Monthly EMI ≥30%
- Credit score 550-649
- Unsafe stress test

### Low
- Credit score 650-699
- Variable income

---

## Borrowing Decision Logic

### DON'T BORROW
- No collateral for LAP/gold loans
- Safe EMI ≤ 0
- DTI ≥4x
- DTI 3-4x + other critical risks
- Very weak credit + (unsafe stress OR critical debt OR bounce)
- Request >2× safe capacity

### BORROW LESS
- Request > safe capacity
- DTI 3-4x (standalone)
- Unsafe stress test
- Very weak credit (standalone)

### BORROW
- Request ≤ safe capacity
- No critical risk factors
- Passes stress test

---

## Confidence Scoring

### Data Point Weights (Total: 22)
- High importance: 3 points each
- Medium importance: 2 points each
- Low importance: 1 point each

### Confidence Levels
- High: ≥80% (≥18/22 points)
- Medium: 60-79% (13-17/22 points)
- Low: <60% (<13/22 points)
- Capped at: 90% (never 100%)

---

## Rate Calculation

### Factors
1. Product base rate
2. Credit score adjustment (−1.0% to +2.5%)
3. Income stability adjustment
4. Existing debt adjustment
5. Payment bounce penalty

### Rate Bounds
- Floor: 6%
- Cap: 24%

---

## Tenure Options

### Illustrated Tenures
- Short: 36 months
- Medium: 48 months
- Long: 60 months

### Note
Product-specific tenures stored but not used in calculations (future use).

---

## Data Collected but Not Used

Fields collected for future enhancement:
- Employment tenure
- Business years
- Upcoming expenses
- Existing loan rate/tenure details
- Loan purpose

---

## APR Simplification

### Included
- Principal + interest

### Not Included
- Processing fees
- Insurance
- Taxes
- Other charges

### Why
Simplified formula for decision-support, not true IRR calculation.

---

*Last updated: 2026-09-06*
