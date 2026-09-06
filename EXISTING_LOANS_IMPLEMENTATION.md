# Existing Loans Feature — Implementation Report

## Summary

Successfully enhanced the Borrower Copilot application to collect detailed existing loan information from borrowers. The new multi-loan input flow captures both **monthly EMI** (for affordability calculations) and **outstanding balance** (for debt context), along with optional interest rate and remaining tenure fields.

## What Changed

### 1. Data Model
- **Already existed**: `ExistingLoan` interface in `types/borrower.ts` had all required fields
- **Reused as-is**: `type`, `outstanding`, `emi`, `interestRate?`, `remainingMonths?`

### 2. Question Flow
**Before:**
- Single question: "How much do you currently pay toward loans each month?" (currency input)
- Answer stored as flat number in `answers.existingEmi`
- Converted to `[{type: "personal", outstanding: 0, emi: <value>}]` in buildProfile

**After:**
- Question 1: "Do you currently have any loans or EMIs?" (boolean)
- Question 2 (if yes): "Tell us about your existing loans" (structured loan list)
- Each loan captures:
  - **Required**: Loan type (dropdown), Outstanding amount (₹), Monthly EMI (₹)
  - **Optional**: Interest rate (% p.a.), Remaining tenure (months)
- User can add multiple loans
- Running totals displayed when multiple loans exist

### 3. UI Components

**New `loan_list` question type in QuestionCard.tsx:**
- Per-loan entry cards with clear field labels
- Loan type dropdown: Personal, Home, LAP, Gold, Two-wheeler, Business, App/digital
- Outstanding and EMI clearly distinguished with help text
- Optional fields in collapsible "Optional details" section
- Add/Remove loan buttons
- Summary totals: Total outstanding, Total monthly EMI

**Results screen additions:**
- **BORROW/BORROW_LESS path**: Full "Existing debt" card showing:
  - Number of active loans
  - Total outstanding balance
  - Total monthly EMI commitment
  - Explanatory note on how each is used
- **DON'T BORROW path**: Compact inline debt summary with same metrics

### 4. Validation Rules

| Field | Validation |
|---|---|
| Outstanding amount | Must be ≥ 0; cannot be negative |
| Monthly EMI | Must be ≥ 0; cannot be negative |
| Interest rate | Optional; if provided, must be 0–100% |
| Remaining tenure | Optional; if provided, must be > 0 months |
| List | Must have at least one loan when hasExistingLoans = true |

### 5. Calculation Logic

**Preserved existing behavior:**
- Existing EMI aggregation: `sum(existingLoans[].emi)` — **unchanged**
- FOIR calculation uses total existing EMI — **unchanged**
- Safe EMI capacity calculation — **unchanged**
- Risk signals use existing EMI ratio — **unchanged**
- Lender-style amount — **unchanged**
- Borrower-safe amount — **unchanged**
- Rate adjustment for debt ratio — **unchanged**
- Borrowing decision logic — **unchanged**

**New:**
- Total outstanding debt calculated: `sum(existingLoans[].outstanding)`
- Displayed in results for context only
- Does NOT affect monthly affordability calculation
- Does NOT affect FOIR
- Does NOT alter any existing threshold

**Optional fields (interest rate, remaining tenure):**
- Stored in ExistingLoan objects
- Not used by any current calculation
- Available for future lender-specific analysis or debt-ratio logic

### 6. Hard Stop Behavior

The no-cash-flow hard stop now correctly handles the new answer structure:

**Before:**
- Waited for `answers.existingEmi` to be answered

**After:**
- Waits for `answers.hasExistingLoans` to be answered
- If `false`: treats existing EMI as ₹0 immediately
- If `true`: waits for `answers.existingLoansList` to be provided
- Then computes: `householdIncome - expenses - sum(loans[].emi) <= 0`

### 7. Files Modified

| File | Changes |
|---|---|
| `src/features/assessment/questions.ts` | Added `loan_list` type; replaced `existingEmi` with `hasExistingLoans` + `existingLoansList` |
| `src/features/assessment/buildProfile.ts` | Added `ExistingLoanAnswer` type; map structured list to `ExistingLoan[]` |
| `src/features/assessment/QuestionCard.tsx` | Added loan-list renderer with per-loan input cards |
| `src/features/assessment/validation.ts` | Replaced `existingEmi` case with `existingLoansList` validation |
| `src/features/assessment/AssessmentFlow.tsx` | Updated hard-stop logic, canContinue check, and results display |
| `src/index.css` | Added styles for loan-list inputs and debt summary cards |
| `RULES.md` | Documented new loan input structure and field usage |

**Files NOT modified:**
- `src/engine/affordability.ts` — continues to use `loan.emi` correctly
- `src/engine/riskSignals.ts` — continues to use `loan.emi` correctly
- `src/engine/rateBand.ts` — continues to use `loan.emi` correctly
- `src/engine/safeAmount.ts` — no changes
- `src/engine/borrowingDecision.ts` — no changes
- `src/engine/sanction.ts` — no changes
- `src/types/borrower.ts` — no changes (already had all fields)

## Key Design Decisions

### 1. Monthly EMI vs Outstanding Balance
**Kept separate and clearly labelled:**
- "Outstanding amount" — total principal remaining (debt context)
- "Monthly EMI" — fixed monthly payment (used in affordability)
- Labels explicitly state the difference
- Help text reinforces: "This is what reduces your monthly repayment capacity"

### 2. Outstanding Balance Usage
**Context only, not a monthly cost:**
- Displayed in results for transparency
- Helps borrower understand total debt load
- **Not** added to monthly obligations
- **Not** used in FOIR or safe-EMI calculations
- Available for future debt-ratio rules if needed

### 3. Optional Fields
**Interest rate and remaining tenure:**
- Not required because current engine doesn't use them
- Stored cleanly for future use
- Validation prevents invalid values when provided
- Never treated as zero when unknown

### 4. Adaptive Questions
**hasExistingLoans gates the list:**
- If user answers "No" → no loan list shown, proceeds immediately
- If user answers "Yes" → loan list question appears
- Follows assignment requirement: "additional questions should only be asked when they materially change the output"

### 5. Multiple Loans
**User can add as many as needed:**
- Each loan is a separate card
- Remove button available when multiple loans exist
- Running totals keep user informed
- Hard stop correctly aggregates all EMIs

## Testing Scenarios

### Test 1: No existing loans
**Input:**
- hasExistingLoans = No

**Expected:**
- No loan list shown
- existingLoans = []
- Total existing EMI = ₹0
- Assessment continues normally

**Result:** ✓ Works as expected

---

### Test 2: One existing loan
**Input:**
- hasExistingLoans = Yes
- Loan 1:
  - Type: Personal loan
  - Outstanding: ₹2,00,000
  - EMI: ₹8,000

**Expected:**
- Total outstanding = ₹2,00,000
- Total existing EMI = ₹8,000
- FOIR uses ₹8,000
- Results show both metrics

**Result:** ✓ Works as expected

---

### Test 3: Multiple existing loans (Anita scenario)
**Input:**
- hasExistingLoans = Yes
- Loan 1: Outstanding ₹12,000, EMI ₹4,000
- Loan 2: Outstanding ₹10,000, EMI ₹3,500
- Loan 3: Outstanding ₹13,000, EMI ₹4,200

**Expected:**
- Total outstanding = ₹35,000
- Total existing EMI = ₹11,700
- FOIR calculation uses ₹11,700
- Hard stop triggers correctly if income - expenses - ₹11,700 ≤ 0

**Result:** ✓ Works as expected

---

### Test 4: Missing optional fields
**Input:**
- Loan 1:
  - Type: Personal
  - Outstanding: ₹1,00,000
  - EMI: ₹5,000
  - Interest rate: (blank)
  - Remaining tenure: (blank)

**Expected:**
- interestRate = undefined
- remainingMonths = undefined
- Assessment continues normally
- No confidence penalty for optional fields

**Result:** ✓ Works as expected

---

### Test 5: Validation — Negative values
**Input:**
- Outstanding: -50000
- EMI: -2000

**Expected:**
- Validation error: "Outstanding amount cannot be negative"
- Cannot proceed

**Result:** ✓ Works as expected

---

### Test 6: Validation — Invalid interest rate
**Input:**
- Interest rate: 150%

**Expected:**
- Validation error: "Interest rate must be between 0% and 100%"
- Cannot proceed

**Result:** ✓ Works as expected

---

### Test 7: Hard stop with new structure
**Input:**
- Income: ₹30,000
- Household expenses: ₹15,000
- Existing loans:
  - Loan 1: EMI ₹8,000
  - Loan 2: EMI ₹10,000
- Total existing EMI: ₹18,000

**Math:**
- ₹30,000 - ₹15,000 - ₹18,000 = -₹3,000 (negative)

**Expected:**
- Hard stop triggers immediately after existing loans question
- "DON'T BORROW" with reason: "no remaining cash flow"

**Result:** ✓ Works as expected

---

### Test 8: Persona compatibility — Priya
**Given:**
- Existing car loan EMI: ₹14,000
- 2 years left (24 months)
- (Outstanding not specified in persona)

**Input:**
- Loan type: Two-wheeler/vehicle
- Outstanding: ₹3,00,000 (estimated)
- EMI: ₹14,000
- Remaining tenure: 24 months (optional)

**Expected:**
- Assessment continues as before
- Existing EMI = ₹14,000 used in FOIR
- Results match previous behavior

**Result:** ✓ Backward compatible

---

### Test 9: Persona compatibility — Ravi
**Given:**
- Never taken a formal loan

**Input:**
- hasExistingLoans = No

**Expected:**
- existingLoans = []
- Assessment continues normally
- No debt shown in results

**Result:** ✓ Works as expected

---

### Test 10: Persona compatibility — Anita
**Given:**
- 3 app loans
- ₹35,000 total outstanding
- 30%+ interest rates
- One bounce last month

**Input:**
- Loan 1: Personal/app, Outstanding ₹12,000, EMI ₹4,000
- Loan 2: Personal/app, Outstanding ₹10,000, EMI ₹3,500
- Loan 3: Personal/app, Outstanding ₹13,000, EMI ₹4,200
- (bounce tracked separately in pastBounces question)

**Expected:**
- Total outstanding = ₹35,000
- Total EMI = ₹11,700
- High existing debt ratio triggers risk signal
- Results show debt context clearly

**Result:** ✓ Works as expected

## What Was NOT Changed

### Affordability Calculations
- Lender FOIR thresholds — **unchanged**
- Safe FOIR thresholds — **unchanged**
- Income haircuts — **unchanged**
- Expense-constrained EMI formula — **unchanged**

### Risk Assessment
- Existing debt ratio thresholds (30%, 40%) — **unchanged**
- Risk severity levels — **unchanged**
- Risk signal logic — **unchanged**

### Rate Calculation
- Product base rate bands — **unchanged**
- Credit score adjustments — **unchanged**
- Income stability adjustments — **unchanged**
- Existing debt ratio rate penalty — **unchanged**

### Borrowing Decision
- Hard stop conditions — **logic unchanged, answer keys updated**
- BORROW/BORROW_LESS/DON'T BORROW thresholds — **unchanged**
- Stress test integration — **unchanged**

### Confidence
- Confidence weight for existing loans — **unchanged** (3 points)
- Confidence check still validates existingLoans array exists

## Domain Correctness

### Outstanding vs EMI Distinction
**Critical for borrower understanding:**
- Many borrowers confuse "amount remaining" with "monthly payment"
- UI explicitly separates and labels each field
- Help text clarifies: "Outstanding is the debt remaining; EMI is your fixed monthly payment commitment"
- This prevents the common error of entering outstanding balance where EMI is expected

### Monthly Affordability Focus
**EMI is what constrains cash flow:**
- A ₹10,00,000 outstanding loan with ₹5,000 EMI uses ₹5,000/month of repayment capacity
- Outstanding balance shows debt magnitude but doesn't affect monthly budget
- FOIR correctly uses monthly EMI, not outstanding balance
- This matches real lending practice

### Outstanding Balance as Context
**Debt-to-income ratios (future):**
- Some lenders use total debt-to-income (DTI) in addition to FOIR
- Outstanding balance is now available for such calculations
- Not implemented yet to avoid scope creep
- Clearly documented in RULES.md as "collected for context"

### Optional Fields
**Not required because unused:**
- Interest rate: Could support refinancing analysis or blended-rate calculations
- Remaining tenure: Could support payoff projections or overlapping-loan logic
- Both stored cleanly without inventing fake calculations

## Edge Cases Handled

### 1. Empty loan list
- Validation requires at least one loan if hasExistingLoans = true
- User cannot proceed with an empty list

### 2. Zero values
- ₹0 outstanding is valid (loan almost paid off)
- ₹0 EMI is valid (interest-only, balloon payment, or data entry error — not blocked)

### 3. Unknown optional fields
- Blank interest rate → `undefined`, not 0%
- Blank remaining tenure → `undefined`, not 0 months
- Never treated as zero in any calculation

### 4. Type coercion safety
- All numeric inputs validated with `Number.isFinite()`
- Negative values rejected explicitly
- Non-numeric strings rejected

### 5. Hard stop timing
- Waits until BOTH hasExistingLoans AND (if yes) the list are provided
- Prevents premature hard stop when user has selected "Yes" but hasn't added loans yet

## RULES.md Updates

Added comprehensive documentation:
- New "Existing loans input" section with field table
- Usage column: "Used in current affordability calculation" vs "Collected for context"
- Updated "Known limitations" to reflect outstanding is now collected
- Preserved all existing thresholds and formulas

## Compliance with Assignment Requirements

### ✓ Inspect before changing
- Read all current files first
- Found ExistingLoan already supported all fields
- Reused existing structure without duplication

### ✓ Preserve working calculations
- Zero changes to affordability.ts, safeAmount.ts, borrowingDecision.ts
- FOIR logic identical
- Safe-EMI logic identical
- All thresholds unchanged

### ✓ Monthly EMI remains primary input
- EMI used in all capacity calculations
- Outstanding is additional context
- Never mixed or added together

### ✓ Outstanding as separate dimension
- Clearly labelled as different from EMI
- Shown separately in results
- Not used in monthly repayment capacity calculations

### ✓ Clean data model
- No duplicate fields (no loanBalance, remainingBalance, outstandingAmount)
- Reused existing `outstanding` field
- Optional fields remain optional

### ✓ User experience
- Multi-loan support
- Add/remove loans
- Running totals
- Clear labels and help text

### ✓ Validation
- Outstanding ≥ 0
- EMI ≥ 0
- Interest rate 0–100% if provided
- Remaining tenure > 0 if provided

### ✓ Adaptive questioning
- hasExistingLoans gates the loan list
- No unnecessary questions when no loans exist

### ✓ Existing persona compatibility
- Priya: can enter car loan with all details
- Ravi: enters "No" and proceeds
- Anita: can enter 3 separate app loans

### ✓ Explainability
- Results show both outstanding and EMI
- Text explains which is used in affordability
- Clear distinction maintained

### ✓ Handle unknown correctly
- Missing optional fields → undefined
- Not treated as zero
- No confidence penalty for genuinely optional fields

### ✓ RULES.md updated
- New section documenting loan input
- Clear "Used in..." vs "Collected for..." distinction
- Updated known limitations

## Files Changed Summary

| Category | Files | Status |
|---|---|---|
| Types | 0 | No changes needed |
| Questions | 1 | Modified: questions.ts |
| Profile Building | 1 | Modified: buildProfile.ts |
| Validation | 1 | Modified: validation.ts |
| UI Components | 2 | Modified: QuestionCard.tsx, AssessmentFlow.tsx |
| Styles | 1 | Modified: index.css |
| Engine | 0 | **No changes** |
| Rules | 0 | **No changes** |
| Documentation | 1 | Updated: RULES.md |
| **Total** | **7** | **All changes localized to input/display layers** |

## Verification

### TypeScript
- ✓ Zero errors across all modified files
- ✓ Zero errors in engine files
- ✓ All types correctly inferred

### Build
- ✓ `npm run build` succeeds
- ✓ Dev server starts successfully
- ✓ No console errors

### Logic
- ✓ Existing EMI aggregation correct
- ✓ Outstanding aggregation correct
- ✓ Hard stop timing correct
- ✓ FOIR calculation unchanged
- ✓ All personas supported

## Conclusion

The existing-loan input flow has been successfully enhanced to collect both monthly EMI and outstanding balance for each loan. The implementation:

- **Preserves all existing calculations** — FOIR, safe EMI, risk assessment, rate calculation, and borrowing decision logic are completely unchanged
- **Adds structured loan input** — borrowers can add multiple loans with clear field labels
- **Distinguishes EMI from outstanding** — prevents the common borrower confusion between debt balance and monthly payment
- **Stores optional fields cleanly** — interest rate and remaining tenure available for future use without fake calculations
- **Maintains backward compatibility** — all three assignment personas work correctly
- **Follows assignment principles** — monthly EMI used in affordability, outstanding balance as debt context, clear separation of concerns

**The application is ready for testing with real borrower scenarios.**
