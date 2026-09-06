# Existing Loans UI - Visual Reference

This document shows what the new existing-loan input flow looks like in the application.

---

## Question 1: Do you have existing loans?

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  EXISTING DEBT                                             │
│                                                            │
│  Do you currently have any loans or EMIs?                 │
│                                                            │
│  Include all active loans: personal loans, car loans,     │
│  home loans, app loans, gold loans, or any other          │
│  regular repayment obligations.                           │
│                                                            │
│  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │       Yes            │  │        No             │      │
│  │                      │  │                       │      │
│  │  Yes, this applies   │  │  No, this does not    │      │
│  │  to me               │  │  apply to me          │      │
│  └──────────────────────┘  └──────────────────────┘      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Question 2A: Add your first loan (empty state)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  EXISTING DEBT                                             │
│                                                            │
│  Tell us about your existing loans.                       │
│                                                            │
│  Add each loan separately. Monthly EMI is the fixed       │
│  amount you pay each month. Outstanding amount is how     │
│  much you still owe in total.                            │
│                                                            │
│  Add each active loan separately.                         │
│  Monthly EMI and outstanding balance are different —      │
│  enter both.                                              │
│                                                            │
│  ┌────────────────────────────────────────────┐          │
│  │  + Add existing loan                        │          │
│  └────────────────────────────────────────────┘          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Question 2B: Single loan entry

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  EXISTING DEBT                                             │
│                                                            │
│  Tell us about your existing loans.                       │
│                                                            │
│  ╔══════════════════════════════════════════════════════╗ │
│  ║  Loan 1                                              ║ │
│  ║                                                       ║ │
│  ║  Loan type                                           ║ │
│  ║  ┌─────────────────────────────────────────────┐    ║ │
│  ║  │ Personal loan                            ▼  │    ║ │
│  ║  └─────────────────────────────────────────────┘    ║ │
│  ║                                                       ║ │
│  ║  Outstanding amount *                                ║ │
│  ║  Total principal still remaining on this loan        ║ │
│  ║  ┌─────────────────────────────────────────────┐    ║ │
│  ║  │ ₹ 200000_____________________________       │    ║ │
│  ║  └─────────────────────────────────────────────┘    ║ │
│  ║  ₹2,00,000                                           ║ │
│  ║                                                       ║ │
│  ║  Monthly EMI *                                       ║ │
│  ║  Fixed amount you pay each month for this loan.     ║ │
│  ║  This is what reduces your monthly repayment        ║ │
│  ║  capacity.                                           ║ │
│  ║  ┌─────────────────────────────────────────────┐    ║ │
│  ║  │ ₹ 8000________________________________      │    ║ │
│  ║  └─────────────────────────────────────────────┘    ║ │
│  ║  ₹8,000                                              ║ │
│  ║                                                       ║ │
│  ║  ▸ Optional details                                  ║ │
│  ║                                                       ║ │
│  ╚══════════════════════════════════════════════════════╝ │
│                                                            │
│  ┌────────────────────────────────────────────┐          │
│  │  + Add another loan                         │          │
│  └────────────────────────────────────────────┘          │
│                                                            │
│  Outstanding amount and monthly EMI are different.        │
│  Outstanding is the debt remaining; EMI is your fixed     │
│  monthly payment commitment.                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Question 2C: Optional fields expanded

```
┌────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════╗ │
│  ║  Loan 1                                              ║ │
│  ║                                                       ║ │
│  ║  [Loan type, Outstanding, EMI fields shown above]   ║ │
│  ║                                                       ║ │
│  ║  ▾ Optional details                                  ║ │
│  ║  ┌─────────────────────────────────────────────┐    ║ │
│  ║  │                                              │    ║ │
│  ║  │  Interest rate (% per year)                 │    ║ │
│  ║  │  ┌──────────────┐                           │    ║ │
│  ║  │  │ 14.5_______  │  e.g. 14.5                │    ║ │
│  ║  │  └──────────────┘                           │    ║ │
│  ║  │                                              │    ║ │
│  ║  │  Remaining tenure (months)                  │    ║ │
│  ║  │  ┌──────────────┐                           │    ║ │
│  ║  │  │ 24_________  │  e.g. 24                  │    ║ │
│  ║  │  └──────────────┘                           │    ║ │
│  ║  │                                              │    ║ │
│  ║  └─────────────────────────────────────────────┘    ║ │
│  ║                                                       ║ │
│  ╚══════════════════════════════════════════════════════╝ │
└────────────────────────────────────────────────────────────┘
```

---

## Question 2D: Multiple loans with totals

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  EXISTING DEBT                                             │
│                                                            │
│  Tell us about your existing loans.                       │
│                                                            │
│  ╔══════════════════════════════════════════════════════╗ │
│  ║  Loan 1                                     [Remove] ║ │
│  ║  Personal loan | ₹12,000 | EMI ₹4,000              ║ │
│  ╚══════════════════════════════════════════════════════╝ │
│                                                            │
│  ╔══════════════════════════════════════════════════════╗ │
│  ║  Loan 2                                     [Remove] ║ │
│  ║  Personal loan | ₹10,000 | EMI ₹3,500              ║ │
│  ╚══════════════════════════════════════════════════════╝ │
│                                                            │
│  ╔══════════════════════════════════════════════════════╗ │
│  ║  Loan 3                                     [Remove] ║ │
│  ║  Personal loan | ₹13,000 | EMI ₹4,200              ║ │
│  ╚══════════════════════════════════════════════════════╝ │
│                                                            │
│  ┌────────────────────────────────────────────┐          │
│  │  + Add another loan                         │          │
│  └────────────────────────────────────────────┘          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Total outstanding across all loans                │  │
│  │  ₹35,000                                           │  │
│  │                                                     │  │
│  │  Total monthly EMI (used in affordability)        │  │
│  │  ₹11,700                                           │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Results: Existing Debt Summary (BORROW path)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  EXISTING DEBT                                             │
│                                                            │
│  Your current loan obligations                            │
│                                                            │
│  Your existing monthly EMIs reduce how much room you have │
│  for a new EMI. Outstanding balance shows how much debt   │
│  remains — it is context, not a monthly cost.            │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Active loans │  │    Total     │  │    Total     │   │
│  │              │  │ outstanding  │  │  monthly EMI │   │
│  │       3      │  │  ₹35,000     │  │  ₹11,700     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  The monthly EMI total above is what is used in your      │
│  affordability calculation. Outstanding balance shows     │
│  total remaining debt but does not affect the monthly     │
│  repayment capacity calculation directly.                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Results: Existing Debt Summary (DON'T BORROW path)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  WHY WE ARE STOPPING HERE                                 │
│                                                            │
│  Taking another loan is not comfortably affordable        │
│  right now.                                               │
│                                                            │
│  [Safe EMI / Amount / Capacity metrics shown]            │
│                                                            │
│  What could change this?                                  │
│  Reducing existing debt or household expenses...          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  YOUR EXISTING DEBT                                │  │
│  │                                                     │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │  Active  │  │    Total      │  │   Total    │  │  │
│  │  │  loans   │  │ outstanding   │  │ monthly EMI│  │  │
│  │  │    3     │  │   ₹35,000     │  │  ₹11,700   │  │  │
│  │  └──────────┘  └──────────────┘  └────────────┘  │  │
│  │                                                     │  │
│  │  Your existing EMIs reduce how much cash flow is   │  │
│  │  available for a new loan. Reducing this           │  │
│  │  commitment would improve your borrowing capacity. │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Validation Errors

### Negative Outstanding
```
┌────────────────────────────────────────────────────────────┐
│  Outstanding amount *                                      │
│  ┌─────────────────────────────────────────────┐          │
│  │ ₹ -50000_____________________________       │          │
│  └─────────────────────────────────────────────┘          │
│                                                            │
│  ⚠ Check your answer                                      │
│  Loan 1: Outstanding amount cannot be negative.           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Invalid Interest Rate
```
┌────────────────────────────────────────────────────────────┐
│  Interest rate (% per year)                               │
│  ┌──────────────┐                                         │
│  │ 150________  │                                         │
│  └──────────────┘                                         │
│                                                            │
│  ⚠ Check your answer                                      │
│  Loan 1: Interest rate must be between 0% and 100%.      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Empty Loan List
```
┌────────────────────────────────────────────────────────────┐
│  Tell us about your existing loans.                       │
│                                                            │
│  [No loans added yet]                                     │
│                                                            │
│  ┌────────────────────────────────────────────┐          │
│  │  + Add existing loan                        │          │
│  └────────────────────────────────────────────┘          │
│                                                            │
│  [Continue button pressed]                                │
│                                                            │
│  ⚠ Check your answer                                      │
│  Please add at least one loan.                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Mobile View

### Loan Entry (Stacked)
```
┌──────────────────────────┐
│ Loan 1         [Remove]  │
│                          │
│ Loan type                │
│ ┌──────────────────────┐ │
│ │ Personal loan     ▼  │ │
│ └──────────────────────┘ │
│                          │
│ Outstanding amount *     │
│ ┌──────────────────────┐ │
│ │ ₹ 200000_________    │ │
│ └──────────────────────┘ │
│ ₹2,00,000                │
│                          │
│ Monthly EMI *            │
│ ┌──────────────────────┐ │
│ │ ₹ 8000___________    │ │
│ └──────────────────────┘ │
│ ₹8,000                   │
│                          │
│ ▸ Optional details       │
└──────────────────────────┘
```

### Totals (Stacked)
```
┌──────────────────────────┐
│ Total outstanding across │
│ all loans                │
│ ₹35,000                  │
│                          │
│ Total monthly EMI        │
│ (used in affordability)  │
│ ₹11,700                  │
└──────────────────────────┘
```

---

## Key UI Elements

### Colors
- **Primary**: #111827 (dark gray)
- **Accent**: #4f46e5 (indigo)
- **Success**: #10b981 (green)
- **Warning**: #f59e0b (amber)
- **Error**: #dc2626 (red)
- **Background**: #f8fafc (very light blue-gray)
- **Border**: #e5e7eb (light gray)

### Typography
- **Headers**: 24-28px, weight 700
- **Body**: 14-16px, weight 400
- **Labels**: 13px, weight 700
- **Help text**: 12-13px, weight 400, muted color

### Spacing
- **Loan cards**: 20px padding, 16px gap between
- **Form fields**: 16px vertical gap
- **Buttons**: 10-16px padding
- **Sections**: 28px vertical margin

### Interactive Elements
- **Add button**: Dashed border, hover effect
- **Remove button**: Red accent, solid border
- **Dropdowns**: Standard browser styling
- **Number inputs**: Large, clear, currency symbol

---

## Accessibility Features

- ✅ All form fields have proper labels
- ✅ Required fields marked with *
- ✅ Help text associated with inputs
- ✅ Error messages clearly visible
- ✅ Focus states on all interactive elements
- ✅ Keyboard navigation supported
- ✅ Screen-reader friendly labels
- ✅ Semantic HTML structure

---

## Browser Support

Tested and working in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

*This UI follows the existing Borrower Copilot design system and maintains visual consistency with all other question cards.*
