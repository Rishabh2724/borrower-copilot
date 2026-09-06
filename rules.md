# Rules & Assumptions

## Core Principles
- **Conservative by design:** Protects borrowers from over-borrowing
- **Risk-aware:** Multiple risk factors compound
- **Transparent:** All thresholds documented
- **Not regulatory:** Modeling choices for decision-support

---

## Income Normalization

### Income Stability Haircuts
Applied to primary borrower's income:
- **Stable:** 100% (no adjustment)
- **Variable:** 85% (15% buffer)
- **Highly Variable:** 70% (30% buffer)

### ITR Verification (Self-Employed Only)
Compares stated monthly income vs ITR-documented income:

| Gap Between Stated & ITR | Action | Rationale |
|--------------------------|--------|-----------|
| ITR ≥ Stated | Accept stated | No downward adjustment needed |
| Gap >50% | Use ITR only | Large discrepancy requires conservative approach |
| Gap 25-50% | Blend: 70% ITR + 30% stated | Moderate gap, weighted blend |
| Gap <25% | Accept stated | Small difference, accept higher value |

### Income Used in Calculations
- **Lender capacity:** Borrower's normalized income only
- **Safe capacity:** Borrower + other household income (both haircut-adjusted)

---

## FOIR (Fixed Obligations to Income Ratio)

### Lender FOIR (Maximum EMI Capacity)
Applied to borrower's normalized income:
- Salaried: **50%**
- Self-employed: **45%**
- Informal: **40%**

### Safe FOIR (Conservative EMI Capacity)
Applied to total household income:
- Salaried: **40%**
- Self-employed: **35%**
- Informal: **30%**

### Why Two FOIRs?
- **Lender FOIR:** Approximates typical lender sanction capacity
- **Safe FOIR:** More conservative recommendation to preserve financial buffer

---

## Affordability Calculation

### Step 1: Disposable Income
```
Disposable = Household Income - Expenses - Existing EMIs
```

### Step 2: Safe EMI Capacity
```
Safe New EMI = min(
  Safe FOIR Capacity,
  50% × Disposable Income
)
```

### Why 50% of Disposable Income?
- Preserves 50% buffer for emergencies and savings
- Prevents over-commitment even when FOIR allows more
- Conservative by design

---

## Debt Burden Assessment

### Monthly EMI Burden
Ratio of existing EMIs to normalized income:
- **≥40%:** Critical risk signal
- **≥30%:** High risk signal  
- **>0%:** Existing debt noted

### Total DTI (Debt-to-Income) Ratio
Total outstanding debt ÷ annual income:

| DTI Ratio | Severity | Impact on Decision |
|-----------|----------|-------------------|
| **≥4x** | Critical | → DON'T BORROW (hard stop) |
| **3-4x** | High | → BORROW LESS alone, DON'T BORROW if combined with other risks |
| **2-3x** | Elevated | → Risk signal, monitor |
| **<2x** | Manageable | → Normal assessment |

---

## Credit Score Impact

### Score Bands & Rate Adjustments

| Score Range | Category | Min Rate | Max Rate | Severity |
|-------------|----------|----------|----------|----------|
| **≥750** | Excellent | −1.0% | −1.5% | None |
| **700-749** | Good | −0.5% | −0.75% | None |
| **650-699** | Fair | 0% | 0% | Medium |
| **550-649** | Poor | +1.0% | +1.5% | High |
| **<550** | Very Weak | +2.0% | +3.0% | Critical |
| **Unknown** | N/A | 0% | 0% | Medium |

### Credit as Risk Signal
- <550: Critical (can trigger DON'T BORROW with other risks)
- 550-649: High risk signal
- 650-699: Medium risk signal
- ≥700: No risk signal

---

## Product Base Rates (% p.a.)

| Product      | Min  | Max  | Secured | Typical LTV |
|--------------|------|------|---------|-------------|
| Home         | 8    | 11   | Yes     | 80-90% |
| LAP          | 9    | 13   | Yes     | 60% |
| Gold         | 9    | 15   | Yes     | 70% |
| Two-wheeler  | 10   | 15   | Yes     | 80-90% |
| Personal     | 11   | 16   | No      | N/A |
| Business     | 11   | 17   | No      | N/A |

**Note:** Rates reflect typical Indian market (2024-2026), not regulatory standards.

---

## Rate Calculation Logic

### Adjustments Applied (in order):

1. **Start with product base rate**

2. **Credit score adjustment:**
   - Excellent (≥750): −1.0 to −1.5%
   - Good (700-749): −0.5 to −0.75%
   - Fair (650-699): No adjustment
   - Poor (550-649): +1.0 to +1.5%
   - Very weak (<550): +2.0 to +3.0%

3. **Income stability adjustment:**
   - Highly variable: +1.0 to +2.0%
   - Variable: +0.5 to +1.0%
   - Stable: No adjustment

4. **Existing debt adjustment:**
   - EMI/Income ≥40%: +1.0 to +2.0%
   - EMI/Income ≥30%: +0.5 to +1.0%
   - Any existing debt: +0.25 to +0.5%

5. **Payment bounce penalty:**
   - Recent bounce: +1.0 to +2.0%

### Rate Bounds
- **Floor:** 6% (minimum possible)
- **Cap:** 24% (maximum possible)
- **Min ≤ Max:** Always enforced

---

## Stress Test Parameters

### Income Stress Test
Simulates income reduction:
- **Income drop:** 20%
- **Scenario:** Household income falls by 20%, existing + proposed EMIs remain same

### Stressed FOIR Evaluation

| Stressed FOIR | Status | Impact |
|---------------|--------|--------|
| **≤30%** | Safe | Passes stress test |
| **30-40%** | Tight | Marginal, noted in decision |
| **>40%** | Unsafe | May trigger BORROW LESS or DON'T BORROW |

### Why Stress Test?
Tests repayment sustainability under adverse conditions (income loss, medical emergency, business downturn).

---

## Risk Signals

### Critical Severity
- DTI ≥4x (very high total debt)
- Credit score <550 (very weak credit)
- Existing EMI ≥40% of income
- Large ITR gap (>50%) for self-employed

### High Severity
- DTI 3-4x (high total debt)
- Credit score 550-649 (weak credit)
- Existing EMI ≥30% of income
- Recent payment bounce
- Highly variable income
- Moderate ITR gap (25-50%) for self-employed

### Medium Severity
- DTI 2-3x (elevated total debt)
- Credit score 650-699 (fair credit)
- No ITR provided (self-employed)
- Unsafe stress test result

### Low Severity
- Variable income (not highly variable)
- Any existing debt <30% of income

---

## Borrowing Decision Logic

### DON'T BORROW Triggers

1. **Secured loan without collateral**
   - LAP or gold loan but collateral not available

2. **No remaining cash flow**
   - Expenses + existing EMIs ≥ household income

3. **No safe EMI capacity**
   - Safe new EMI capacity ≤ 0

4. **Very high total debt (DTI ≥4x)**
   - Outstanding debt ≥4× annual income

5. **Very weak credit + other material risk**
   - Credit <550 AND (unsafe stress OR EMI ≥40% OR bounce)

6. **High total debt + other risk**
   - DTI 3-4x AND (unsafe stress OR EMI ≥40% OR bounce OR credit <550)

7. **Request far exceeds capacity**
   - Requested amount >2× safe capacity

---

### BORROW LESS Triggers

1. **Request exceeds safe capacity**
   - Requested amount > safe amount (but <2× safe amount)

2. **High total debt alone (DTI 3-4x)**
   - Without other critical risks

3. **Unsafe stress test**
   - Baseline affordable but fails 20% income drop test

4. **Very weak credit alone**
   - Credit <550 without other critical risks

---

### BORROW Conditions

1. **Request within safe capacity**
   - Requested amount ≤ safe amount

2. **No critical risk factors**
   - Passes all DON'T BORROW checks

3. **Passes or marginally passes stress test**
   - Stressed FOIR ≤40% (safe or tight)

---

## Confidence Scoring

### Data Points Weighted (Total: 22 points)

| Data Point | Weight | Required For |
|------------|--------|--------------|
| Income min/max provided | 3 | All assessments |
| Household expenses provided | 3 | Affordability |
| Existing debt information | 3 | Capacity calculation |
| ITR (self-employed) | 3 | Income verification |
| Employment type | 2 | FOIR selection |
| Income stability | 2 | Haircut calculation |
| Credit score | 2 | Rate estimation |
| Loan amount | 2 | Decision making |
| Age | 1 | Profile completeness |
| Loan purpose | 1 | Context |

### Confidence Levels
- **High:** ≥80% (≥18/22 points)
- **Medium:** 60-79% (13-17/22 points)
- **Low:** <60% (<13/22 points)
- **Maximum:** 90% (capped, never 100%)

---

## Collateral Assumptions

### LTV (Loan-to-Value) Caps

| Asset Type | LTV | Rationale |
|------------|-----|-----------|
| **LAP (Property)** | 60% | Conservative for property, accounts for valuation uncertainty |
| **Gold** | 70% | Liquid asset, easier to liquidate, higher LTV acceptable |

**Note:** These are modeling assumptions, not lender-specific policies.

---

## Tenure Selection

### Illustrated Tenures
Three standard tenures shown for comparison:
- **36 months** (short-term)
- **48 months** (medium-term)
- **60 months** (long-term)

### Recommended Tenure Logic
Selects longest tenure where EMI ≤ safe EMI capacity:
- Maximizes monthly affordability
- Reduces EMI burden
- Uses conservative capacity ceiling

### Product-Specific Tenures
Product metadata (24, 36, 48, 84, 120, 180, 240 months) stored but **not used** in calculations. Future enhancement candidate.

---

## Data Collected but Not Used

Fields collected for potential future use:
- **Upcoming expenses:** Could reduce disposable income
- **Existing loan rate/tenure:** Could enable refinance analysis
- **Loan purpose:** Could enable purpose-specific guidance

---

## APR Calculation

### Included
- Principal amount
- Interest charges over tenure
- Processing fee (if applicable)

### Not Included
- GST on processing fee
- Insurance premiums
- Prepayment penalties
- Late payment charges
- Documentation charges

### Formula
```
APR = Effective Rate + (Fee Impact × Annualization Factor)

Fee Impact = (Processing Fee / Principal) × (12 / Tenure Months) × 100
```

### Why Simplified?
- Decision-support tool, not regulatory disclosure
- Simplified for clarity and comparison
- Not a substitute for lender's APR disclosure

---

## Model Limitations

### Not Included in Model
- Lender-specific eligibility criteria
- Regulatory caps (e.g., RBI guidelines)
- Processing time estimates
- Tax benefits (e.g., home loan interest deduction)
- Insurance requirements
- Co-applicant income contribution to sanction (only to safe capacity)

### Conservative Assumptions
- Income haircuts (especially for variable income)
- 50% disposable income rule
- Lower safe FOIR vs lender FOIR
- 20% income stress test

### Not a Substitute For
- Professional financial advice
- Lender pre-qualification
- Legal or tax consultation
- Credit counseling

---

*Last updated: 2026-09-06*
