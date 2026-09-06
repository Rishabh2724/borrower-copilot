# How Outstanding Balance and EMI Affect Borrowing Decisions

## 🎯 Executive Summary

**Monthly EMI:**
- ✅ **DIRECTLY AFFECTS** all affordability calculations
- ✅ **DIRECTLY AFFECTS** borrowing decision
- ✅ Used in FOIR, safe EMI capacity, risk assessment, and rate adjustments

**Outstanding Balance:**
- ❌ **DOES NOT AFFECT** any current calculation
- ℹ️ Collected and displayed for context only
- ℹ️ Available for future debt-ratio rules (not implemented)

---

## 📊 Complete Flow: From Input to Decision

### Step 1: User Input
```
Loan 1: Personal loan
  Outstanding: ₹2,00,000
  EMI: ₹8,000

Loan 2: Car loan
  Outstanding: ₹3,50,000
  EMI: ₹10,000

TOTAL Outstanding: ₹5,50,000
TOTAL EMI: ₹18,000
```

### Step 2: Profile Building
```typescript
// buildProfile.ts
existingLoans = [
  { type: "personal", outstanding: 200000, emi: 8000 },
  { type: "two_wheeler", outstanding: 350000, emi: 10000 }
]
```

### Step 3: Affordability Calculation
```typescript
// affordability.ts
const existingEmi = profile.existingLoans.reduce(
  (sum, loan) => sum + loan.emi,  // ← Only EMI is used
  0
)
// Result: ₹18,000

// Outstanding balance is NEVER read in this file
```

**What happens next:**
```typescript
// Given:
normalizedIncome = ₹1,00,000
existingEmi = ₹18,000
householdExpenses = ₹30,000

// Lender-style capacity (FOIR = 50% for salaried)
lenderTotalEmiCapacity = ₹1,00,000 × 0.50 = ₹50,000
lenderNewEmiCapacity = ₹50,000 - ₹18,000 = ₹32,000

// Borrower-safe capacity (FOIR = 40% for salaried)
safeTotalEmiCapacity = ₹1,00,000 × 0.40 = ₹40,000
safeFoIRCapacity = ₹40,000 - ₹18,000 = ₹22,000

// Expense constraint
disposableIncome = ₹1,00,000 - ₹30,000 - ₹18,000 = ₹52,000
expenseConstrainedEmi = ₹52,000 × 0.50 = ₹26,000

// Final safe EMI capacity
safeNewEmiCapacity = min(₹22,000, ₹26,000) = ₹22,000
```

**Outstanding balance impact: ZERO** ❌

---

## 🔍 Detailed Impact Analysis

### Impact 1: FOIR Calculation (Direct)

**File:** `src/engine/affordability.ts`

```typescript
const existingEmi = profile.existingLoans.reduce(
  (total, loan) => total + loan.emi,
  0
);

const lenderNewEmiCapacity = Math.max(
  0,
  lenderTotalEmiCapacity - existingEmi  // ← EMI reduces capacity
);

const safeNewEmiCapacity = Math.min(
  safeFoIRCapacity,
  expenseConstrainedEmi
);
```

**Effect:**
- Higher existing EMI → Lower new EMI capacity → Lower max loan amount
- Outstanding balance: NOT USED ❌

**Example:**
```
Scenario A: EMI ₹5,000, Outstanding ₹5,00,000
Scenario B: EMI ₹5,000, Outstanding ₹1,00,000

Result: IDENTICAL new EMI capacity in both scenarios
```

---

### Impact 2: Risk Assessment (Direct)

**File:** `src/engine/riskSignals.ts`

```typescript
const income = getNormalizedIncome(profile);

const existingEmi = profile.existingLoans.reduce(
  (sum, loan) => sum + loan.emi,  // ← Only EMI
  0
);

const existingDebtRatio = income > 0 
  ? existingEmi / income 
  : 1;

if (existingDebtRatio >= 0.4) {
  signals.push({
    severity: "critical",
    title: "Existing debt is already very high"
  });
} else if (existingDebtRatio >= 0.3) {
  signals.push({
    severity: "high",
    title: "Existing debt is significant"
  });
}
```

**Effect:**
- EMI/Income ratio triggers risk signals
- Risk signals influence borrowing decision
- Outstanding balance: NOT USED ❌

**Example:**
```
Income: ₹50,000
Existing EMI: ₹20,000
Ratio: 40%

Result: CRITICAL risk signal → May trigger DON'T BORROW
```

---

### Impact 3: Rate Adjustment (Direct)

**File:** `src/engine/rateBand.ts`

```typescript
const existingEmi = profile.existingLoans.reduce(
  (sum, loan) => sum + loan.emi,
  0
);

const income = getNormalizedIncome(profile);
const debtRatio = income > 0 ? existingEmi / income : 0;

// Rate penalty based on debt ratio
if (debtRatio >= 0.40) {
  adjustments.push({ label: "High existing debt", min: 1, max: 2 });
} else if (debtRatio >= 0.30) {
  adjustments.push({ label: "Significant existing debt", min: 0.5, max: 1 });
} else if (existingEmi > 0) {
  adjustments.push({ label: "Some existing debt", min: 0.25, max: 0.5 });
}
```

**Effect:**
- Higher EMI/Income ratio → Higher interest rate
- Outstanding balance: NOT USED ❌

**Example:**
```
Debt ratio 40%: Rate +1% to +2%
Debt ratio 30%: Rate +0.5% to +1%
Debt ratio 20%: Rate +0.25% to +0.5%
```

---

### Impact 4: Borrowing Decision (Indirect via Risk)

**File:** `src/engine/borrowingDecision.ts`

```typescript
const affordability = calculateAffordability(profile);
const riskSignals = calculateRiskSignals(profile);

const criticalDebtRisk = riskSignals.some(
  (signal) => signal.id === "critical_existing_debt"
);

// Hard stop: No remaining cash flow
const remainingCashFlow =
  affordability.householdIncome -
  profile.monthlyHouseholdExpenses -
  affordability.existingEmi;  // ← EMI affects cash flow

if (remainingCashFlow <= 0) {
  return {
    decision: "dont_borrow",
    reasons: ["No remaining cash flow after expenses and EMIs"]
  };
}

// Hard stop: No safe EMI capacity
if (affordability.safeNewEmiCapacity <= 0) {
  return {
    decision: "dont_borrow",
    reasons: ["No conservative capacity for new EMI"]
  };
}

// Critical credit + critical debt = DON'T BORROW
if (criticalCreditRisk && criticalDebtRisk) {
  return {
    decision: "dont_borrow",
    reasons: ["Weak credit + high debt = too risky"]
  };
}
```

**Effect:**
- EMI affects remaining cash flow → Can trigger hard stop
- EMI affects safe capacity → Can trigger hard stop
- EMI affects risk signals → Can trigger DON'T BORROW
- Outstanding balance: NOT USED ❌

---

### Impact 5: Safe Amount Calculation (Indirect)

**File:** `src/engine/safeAmount.ts`

```typescript
const affordability = calculateAffordability(profile);
const rate = calculateFairRate(profile);

// Convert safe EMI capacity to loan amounts
const amounts = [36, 48, 60].map(tenure =>
  calculateLoanAmountFromEMI(
    affordability.safeNewEmiCapacity,  // ← Depends on existing EMI
    rateMid,
    tenure
  )
);

const affordabilityMax = Math.max(0, ...amounts);
```

**Effect:**
- Lower safe EMI capacity → Lower max loan amount
- Existing EMI reduces safe EMI capacity
- Outstanding balance: NOT USED ❌

---

## 📈 Real-World Examples

### Example 1: Low EMI, High Outstanding

```
Profile:
  Income: ₹1,00,000
  Expenses: ₹25,000
  Existing Loan:
    Outstanding: ₹10,00,000  ← Large debt
    EMI: ₹5,000              ← Small monthly payment

Calculations:
  Existing EMI ratio: 5% (low)
  Safe new EMI capacity: ~₹35,000
  Risk signals: None
  Rate adjustment: +0.25% (minimal)
  
Decision: LIKELY TO BORROW
Recommended amount: ~₹15-20 lakhs

Why? Monthly payment is manageable despite large outstanding balance.
```

---

### Example 2: High EMI, Low Outstanding

```
Profile:
  Income: ₹1,00,000
  Expenses: ₹25,000
  Existing Loan:
    Outstanding: ₹50,000     ← Small remaining debt
    EMI: ₹25,000             ← Large monthly payment

Calculations:
  Existing EMI ratio: 25% (high)
  Safe new EMI capacity: ~₹15,000
  Risk signals: None yet
  Rate adjustment: +0.25% to +0.5%
  
Decision: BORROW LESS or DON'T BORROW
Recommended amount: ~₹5-8 lakhs

Why? Monthly payment severely constrains cash flow despite low outstanding.
```

---

### Example 3: Critical Debt Ratio

```
Profile:
  Income: ₹50,000
  Expenses: ₹15,000
  Existing Loans:
    Loan 1: Outstanding ₹1,00,000, EMI ₹8,000
    Loan 2: Outstanding ₹50,000, EMI ₹5,000
    Loan 3: Outstanding ₹30,000, EMI ₹7,000
    TOTAL: Outstanding ₹1,80,000, EMI ₹20,000

Calculations:
  Existing EMI ratio: 40% (critical)
  Risk signal: "Existing debt is already very high"
  Remaining cash flow: ₹50,000 - ₹15,000 - ₹20,000 = ₹15,000
  Safe new EMI capacity: ~₹5,000 (very limited)
  
Decision: DON'T BORROW
Reason: Critical existing debt ratio

Why? 40% of income already committed to existing EMIs.
```

---

### Example 4: No Cash Flow (Hard Stop)

```
Profile:
  Income: ₹30,000
  Expenses: ₹20,000
  Existing Loan: EMI ₹12,000

Calculations:
  Remaining cash flow: ₹30,000 - ₹20,000 - ₹12,000 = -₹2,000
  
Decision: DON'T BORROW (immediate hard stop)
Reason: "No remaining cash flow after expenses and EMIs"

Assessment stops immediately after existing loans question.
Outstanding balance irrelevant — no monthly capacity regardless.
```

---

## 🔄 Where Outstanding Balance IS Used

### Display Only (Results Screen)

```typescript
// AssessmentFlow.tsx (Results component)
const totalOutstanding = existingLoansList.reduce(
  (sum, l) => sum + l.outstanding,
  0
);

// Shown in UI:
"Total outstanding across all loans: ₹5,50,000"
"Total monthly EMI commitment: ₹18,000"
```

**Purpose:** Transparency and context for borrower

**Effect on decision:** ZERO ❌

---

## 🎓 Why This Design?

### 1. Monthly Affordability Focus
**Lending principle:** Can borrower afford the monthly payment?
- EMI is the monthly cash outflow
- Outstanding is historical debt size
- Monthly budget cares about monthly cost

### 2. FOIR is Flow-Based
**FOIR = Fixed Obligations to Income Ratio**
- Measures monthly repayment burden
- Outstanding balance is not a monthly burden
- A ₹10L outstanding with ₹5K EMI has same monthly impact as ₹2L outstanding with ₹5K EMI

### 3. Real Lending Practice
Most lenders care about:
- Monthly EMI (affects cash flow)
- Credit score (repayment history)
- Income stability

Some lenders also consider:
- Total debt-to-income (DTI) using outstanding
- But this is secondary to monthly FOIR

### 4. Borrower Copilot Philosophy
**Conservative, cash-flow focused:**
- Can you afford the monthly payment safely?
- Do you have cash-flow buffer for shocks?
- Is your monthly obligation ratio healthy?

Outstanding balance provides context but doesn't change the monthly affordability math.

---

## 🔮 Future Enhancement: Total Debt-to-Income

**If we wanted to use outstanding balance:**

```typescript
// Future addition to riskSignals.ts
const totalOutstanding = profile.existingLoans.reduce(
  (sum, loan) => sum + loan.outstanding,
  0
);

const annualIncome = getNormalizedIncome(profile) * 12;
const totalDebtRatio = totalOutstanding / annualIncome;

if (totalDebtRatio > 3.0) {
  signals.push({
    id: "very_high_total_debt",
    severity: "high",
    title: "Total debt burden is very high",
    explanation: "Outstanding debt is more than 3x annual income"
  });
}
```

**This would:**
- Add context about overall debt load
- Trigger additional warnings for high total debt
- Still keep monthly EMI as primary driver
- Provide more complete risk picture

**Not implemented because:**
- Keeps scope focused on monthly affordability
- Avoids inventing thresholds without domain expertise
- Outstanding balance available when needed
- Can be added later without breaking changes

---

## 📊 Summary Table

| Factor | Uses EMI | Uses Outstanding | Effect on Decision |
|---|:---:|:---:|---|
| **FOIR Calculation** | ✅ | ❌ | Direct — reduces new EMI capacity |
| **Safe EMI Capacity** | ✅ | ❌ | Direct — reduces safe borrowing limit |
| **Risk Signals** | ✅ | ❌ | Direct — triggers debt warnings |
| **Rate Adjustment** | ✅ | ❌ | Direct — increases interest rate |
| **Hard Stop (No Cash Flow)** | ✅ | ❌ | Direct — can trigger DON'T BORROW |
| **Hard Stop (No Capacity)** | ✅ | ❌ | Direct — can trigger DON'T BORROW |
| **Critical Debt Decision** | ✅ | ❌ | Direct — can trigger DON'T BORROW |
| **Safe Amount Calculation** | ✅ | ❌ | Indirect via safe EMI capacity |
| **Stress Test** | ✅ | ❌ | Indirect via EMI in stressed scenario |
| **Results Display** | ✅ | ✅ | Display only — no calculation impact |
| **Future DTI Rules** | ❌ | ✅ (potential) | Not implemented |

---

## ✅ Key Takeaways

1. **Monthly EMI is everything** for current affordability calculations
2. **Outstanding balance is context** — shown to borrower but doesn't affect decision
3. **This matches real lending practice** — monthly cash flow matters most
4. **Design is intentional** — keeps outstanding available for future debt-ratio rules
5. **Borrower sees both** — transparency about what's used and what's context

---

## 🧪 Test This Yourself

**Try these scenarios in the app:**

**Scenario A:**
- Existing loan: Outstanding ₹10,00,000, EMI ₹5,000
- Note the safe new EMI capacity

**Scenario B:**
- Existing loan: Outstanding ₹1,00,000, EMI ₹5,000  
- Note the safe new EMI capacity

**Result:** Identical capacity despite 10x difference in outstanding

**Scenario C:**
- Existing loan: Outstanding ₹1,00,000, EMI ₹25,000
- Note the safe new EMI capacity

**Result:** Much lower capacity than A/B despite lower outstanding

This proves: **EMI matters, outstanding doesn't (for now)**.

---

*Last updated: 2026-09-06*
