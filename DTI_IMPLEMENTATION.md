# Total Debt-to-Income (DTI) Ratio - Implementation

## 🎯 What Changed

Outstanding loan balance is now **actively used** in the borrowing decision through a **Total Debt-to-Income (DTI) ratio** calculation.

---

## 📊 How DTI Works

### Formula
```
DTI = Total Outstanding Debt ÷ Annual Income
```

### Example
```
Existing Loans:
  Loan 1: Outstanding ₹2,00,000, EMI ₹8,000
  Loan 2: Outstanding ₹3,50,000, EMI ₹10,000

Total Outstanding: ₹5,50,000
Annual Income: ₹1,00,000 × 12 = ₹12,00,000

DTI = ₹5,50,000 ÷ ₹12,00,000 = 0.46 = 0.5x (approx)

Result: DTI is LOW — no additional risk signal
```

---

## 🚦 DTI Thresholds

| DTI Ratio | Annual Income Multiplier | Risk Level | Effect on Decision |
|---|---|---|---|
| < 2.0x | Less than 2 years of income | **None** | No DTI impact |
| 2.0-3.0x | 2-3 years of income | **Elevated** | Medium risk signal; mentioned in reasons |
| 3.0-4.0x | 3-4 years of income | **High** | High risk signal; BORROW_LESS alone, DON'T_BORROW with other risks |
| ≥ 4.0x | 4+ years of income | **Very High** | Critical risk signal; DON'T_BORROW immediately |

---

## 🔄 Decision Logic Flow

### Scenario 1: DTI ≥ 4.0x (Very High)
```
Total Outstanding: ₹50,00,000
Annual Income: ₹12,00,000
DTI: 4.2x

→ IMMEDIATE DON'T BORROW
Reason: "Total outstanding debt is extremely high relative to income"
```

**No other checks needed — this is a hard stop.**

---

### Scenario 2: DTI 3.0-4.0x + Another Risk Factor
```
Total Outstanding: ₹40,00,000
Annual Income: ₹12,00,000
DTI: 3.3x

AND one of:
  - Unsafe stress test
  - Critical existing EMI ratio (40%+)
  - Recent bounce
  - Very weak credit

→ DON'T BORROW
Reason: "High DTI combined with other risk factors"
```

---

### Scenario 3: DTI 3.0-4.0x Alone
```
Total Outstanding: ₹40,00,000
Annual Income: ₹12,00,000
DTI: 3.3x
Monthly EMI: ₹15,000 (affordable)

No other risk factors

→ BORROW LESS
Reason: "Monthly capacity OK, but total debt load already very high"
```

**Key point:** Even if monthly cash flow supports the loan, excessive total debt triggers caution.

---

### Scenario 4: DTI 2.0-3.0x (Elevated)
```
Total Outstanding: ₹25,00,000
Annual Income: ₹12,00,000
DTI: 2.1x

→ MEDIUM RISK SIGNAL
Shown in reasons if BORROW_LESS for other reasons
Does not trigger decision by itself
```

---

### Scenario 5: DTI < 2.0x (Normal)
```
Total Outstanding: ₹15,00,000
Annual Income: ₹12,00,000
DTI: 1.25x

→ NO DTI IMPACT
Decision based on monthly affordability only
```

---

## 🧪 Complete Examples

### Example 1: High DTI Blocks Borrowing

**Profile:**
- Income: ₹50,000/month = ₹6,00,000/year
- Existing loans:
  - Loan 1: Outstanding ₹15,00,000, EMI ₹8,000
  - Loan 2: Outstanding ₹12,00,000, EMI ₹7,000
- **Total Outstanding: ₹27,00,000**
- **Total EMI: ₹15,000**

**Calculations:**
```
Monthly affordability:
  Existing EMI ratio: ₹15,000 / ₹50,000 = 30% (high but not critical)
  Remaining capacity: Could support small new loan

Total DTI:
  DTI = ₹27,00,000 / ₹6,00,000 = 4.5x ← VERY HIGH!

Risk Signals:
  ✗ Very high total debt (critical)
  ⚠ Significant existing debt (high)

Decision: DON'T BORROW
Reason: "Total outstanding debt is extremely high (4.5x annual income)"
```

**Key insight:** Monthly EMI is manageable, but total debt burden is dangerous.

---

### Example 2: DTI Triggers BORROW_LESS

**Profile:**
- Income: ₹1,00,000/month = ₹12,00,000/year
- Existing loans:
  - Home loan: Outstanding ₹35,00,000, EMI ₹18,000
- **Total Outstanding: ₹35,00,000**
- **Total EMI: ₹18,000**
- Wants: ₹10,00,000 personal loan

**Calculations:**
```
Monthly affordability:
  Existing EMI ratio: ₹18,000 / ₹1,00,000 = 18% (reasonable)
  Safe new EMI capacity: ~₹25,000 (adequate for request)

Total DTI:
  DTI = ₹35,00,000 / ₹12,00,000 = 2.9x ← Approaching high threshold

Risk Signals:
  ⚠ Elevated total debt (medium)

Decision: BORROW (DTI under 3.0x, not high enough alone)
But if DTI were 3.1x → BORROW_LESS
```

---

### Example 3: DTI + Other Risk = DON'T BORROW

**Profile:**
- Income: ₹60,000/month = ₹7,20,000/year
- Existing loans:
  - Multiple app loans: Outstanding ₹25,00,000, EMI ₹20,000
- **Total Outstanding: ₹25,00,000**
- **Total EMI: ₹20,000**
- Credit score: 580 (weak)

**Calculations:**
```
Monthly affordability:
  Existing EMI ratio: ₹20,000 / ₹60,000 = 33% (significant)
  Safe capacity: Limited

Total DTI:
  DTI = ₹25,00,000 / ₹7,20,000 = 3.5x ← HIGH

Risk Signals:
  ✗ High total debt (high)
  ⚠ Significant existing EMI (high)
  ⚠ Weak credit (high)

Decision: DON'T BORROW
Reason: "High DTI (3.5x) combined with weak credit"
```

---

### Example 4: Low Outstanding, High EMI

**Profile:**
- Income: ₹80,000/month = ₹9,60,000/year
- Existing loan:
  - Personal loan: Outstanding ₹3,00,000, EMI ₹25,000 (short tenure, high payment)
- **Total Outstanding: ₹3,00,000**
- **Total EMI: ₹25,000**

**Calculations:**
```
Monthly affordability:
  Existing EMI ratio: ₹25,000 / ₹80,000 = 31% (significant)
  Safe capacity: Limited by monthly EMI

Total DTI:
  DTI = ₹3,00,000 / ₹9,60,000 = 0.31x ← VERY LOW

Risk Signals:
  ⚠ Significant existing EMI (high)
  ✓ Total debt is low (no DTI signal)

Decision: Constrained by monthly EMI, NOT by total debt
```

**Key insight:** Low outstanding doesn't help if monthly payment is too high.

---

### Example 5: High Outstanding, Low EMI

**Profile:**
- Income: ₹1,20,000/month = ₹14,40,000/year
- Existing loan:
  - Home loan: Outstanding ₹50,00,000, EMI ₹15,000 (long tenure, low payment)
- **Total Outstanding: ₹50,00,000**
- **Total EMI: ₹15,000**

**Calculations:**
```
Monthly affordability:
  Existing EMI ratio: ₹15,000 / ₹1,20,000 = 12.5% (low)
  Safe capacity: Good room for new EMI

Total DTI:
  DTI = ₹50,00,000 / ₹14,40,000 = 3.5x ← HIGH

Risk Signals:
  ✗ High total debt (high)

Decision: BORROW_LESS
Reason: "Monthly capacity OK, but total debt load already very high"
```

**Key insight:** Good monthly cash flow, but excessive total debt triggers caution.

---

## ⚖️ Dual Assessment: EMI + DTI

The system now performs **two independent assessments**:

### 1. Monthly Affordability (EMI-based)
**Question:** Can the borrower afford the monthly payment?
- Uses existing EMI
- FOIR calculations
- Cash flow checks
- Safe EMI capacity

### 2. Total Debt Burden (DTI-based)
**Question:** Is the borrower's overall debt load excessive?
- Uses outstanding balance
- Compares to annual income
- Assesses long-term debt sustainability
- Checks vulnerability to shocks

**Both must pass for "BORROW" recommendation.**

---

## 📈 Why This Matters

### Without DTI (Old Behavior)
```
Scenario: Home loan with ₹50L outstanding, ₹10K EMI
Income: ₹1L/month
EMI ratio: 10% → LOOKS GREAT ✅
Decision: BORROW

Problem: Total debt is 4.2x annual income
         One job loss = impossible to refinance/restructure
         Very vulnerable to income shocks
```

### With DTI (New Behavior)
```
Same scenario:
EMI ratio: 10% → Affordable monthly ✅
DTI: 4.2x → Very high total debt ✗
Decision: BORROW_LESS or DON'T_BORROW

Reasoning: Monthly affordable, but total debt burden
          creates excessive financial vulnerability
```

---

## 🎓 Real-World Context

### Common Lending Practice
Most lenders consider:
1. **FOIR** — Monthly repayment capacity (EMI-based)
2. **DTI** — Total debt burden (outstanding-based)

**Both are standard risk metrics.**

### Conservative Lending
- FOIR ensures monthly payment is affordable
- DTI ensures total debt doesn't create unmanageable burden
- Borrower Copilot now uses both, like real lenders

### Household Financial Health
- Low EMI + Low DTI = Healthy ✅
- Low EMI + High DTI = Vulnerable (new loans risky) ⚠️
- High EMI + Low DTI = Tight monthly budget ⚠️
- High EMI + High DTI = Critical risk ✗✗

---

## 🔄 Impact on Personas

### Priya (Salaried, ₹1,10,000/month)
```
Existing: Car loan ₹3,00,000 outstanding, ₹14,000 EMI
Annual income: ₹13,20,000
DTI: ₹3,00,000 / ₹13,20,000 = 0.23x

Result: NO DTI IMPACT ✅
Decision based on monthly affordability only
```

---

### Ravi (Self-employed kirana, ₹60,000/month avg)
```
Existing: None
DTI: 0x

Result: NO DTI IMPACT ✅
No existing debt, so DTI doesn't apply
```

---

### Anita (Informal, ₹28,000/month)
```
Existing: 3 app loans
  Loan 1: ₹12,000 outstanding, ₹4,000 EMI
  Loan 2: ₹10,000 outstanding, ₹3,500 EMI
  Loan 3: ₹13,000 outstanding, ₹4,200 EMI
Total: ₹35,000 outstanding, ₹11,700 EMI

Annual income: ₹3,36,000
DTI: ₹35,000 / ₹3,36,000 = 0.10x

Result: LOW DTI ✅
But HIGH EMI RATIO (42%) triggers DON'T_BORROW
Decision driven by monthly affordability, not DTI
```

---

## ✅ Files Modified

| File | Change |
|---|---|
| `src/engine/riskSignals.ts` | Added DTI calculation and 3 new risk signals |
| `src/engine/borrowingDecision.ts` | Added DTI-based decision rules (5 new checks) |
| `src/rules/thresholds.ts` | Added DTI threshold constants |
| `RULES.md` | Documented DTI thresholds and logic |

---

## 🧪 Testing Scenarios

### Test 1: Very High DTI (≥4x) → DON'T BORROW
```
Income: ₹50,000/month
Outstanding: ₹25,00,000
EMI: ₹10,000

DTI: 5.0x
Expected: DON'T BORROW immediately
```

### Test 2: High DTI (3-4x) → BORROW_LESS
```
Income: ₹1,00,000/month
Outstanding: ₹40,00,000
EMI: ₹15,000

DTI: 3.3x
Expected: BORROW_LESS
```

### Test 3: Elevated DTI (2-3x) → Risk Signal Only
```
Income: ₹1,00,000/month
Outstanding: ₹25,00,000
EMI: ₹10,000

DTI: 2.1x
Expected: Medium risk signal, decision based on other factors
```

### Test 4: Low DTI (<2x) → No Impact
```
Income: ₹1,00,000/month
Outstanding: ₹15,00,000
EMI: ₹8,000

DTI: 1.25x
Expected: No DTI impact at all
```

---

## 📊 Summary Table

| Outstanding Balance | Now Used For | Impact |
|---|---|---|
| **Results display** | Transparency | Show borrower their total debt |
| **DTI risk signals** | Risk assessment | Triggers medium/high/critical warnings |
| **Borrowing decision** | Decision logic | Can trigger BORROW_LESS or DON'T_BORROW |
| **FOIR calculation** | ❌ NOT used | Monthly affordability still uses EMI only |
| **Safe amount** | ❌ NOT used | Capacity calculation still uses EMI only |

---

## 🎯 Key Takeaways

1. **Outstanding balance now matters** through DTI ratio
2. **EMI still drives monthly affordability** (unchanged)
3. **Dual assessment:** Monthly cash flow + Total debt burden
4. **Conservative approach:** Both must be healthy for "BORROW"
5. **Real lending practice:** DTI is a standard risk metric
6. **Protects borrowers:** Prevents excessive total debt accumulation

---

**Outstanding balance is now an important part of the decision-making process! 🎉**

*Implementation completed: 2026-09-06*
