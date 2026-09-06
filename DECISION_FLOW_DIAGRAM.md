# Borrowing Decision Flow - Visual Diagram

## 📊 Complete Flow: Input → Decision

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INPUT                                │
│                                                                  │
│  Existing Loan 1:                                               │
│    • Outstanding: ₹2,00,000  ─────────┐                        │
│    • EMI: ₹8,000  ────────────────────┼─────┐                  │
│                                        │     │                  │
│  Existing Loan 2:                     │     │                  │
│    • Outstanding: ₹3,50,000  ─────────┤     │                  │
│    • EMI: ₹10,000  ───────────────────┼─────┤                  │
│                                        │     │                  │
└────────────────────────────────────────┼─────┼──────────────────┘
                                         │     │
                      ONLY FOR DISPLAY ──┘     └── USED IN CALCULATIONS
                                         │          
                                         ▼          
                            ┌─────────────────────┐
                            │ Total Outstanding:  │
                            │    ₹5,50,000        │
                            │                     │
                            │   NOT USED IN       │
                            │   CALCULATIONS ❌   │
                            └─────────────────────┘
                                         
                                         
                                         ▼
                            ┌─────────────────────┐
                            │  Total Existing EMI │
                            │     ₹18,000         │
                            │                     │
                            │   USED EVERYWHERE ✅ │
                            └──────────┬──────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                │                      │                      │
                ▼                      ▼                      ▼
    ┌─────────────────────┐ ┌─────────────────────┐ ┌────────────────────┐
    │  AFFORDABILITY      │ │  RISK SIGNALS       │ │  RATE ADJUSTMENT   │
    │  CALCULATION        │ │                     │ │                    │
    │                     │ │  EMI/Income Ratio:  │ │  Debt Ratio:       │
    │  Existing EMI:      │ │  ₹18K / ₹100K = 18% │ │  18% → +0.25%      │
    │  ₹18,000            │ │                     │ │                    │
    │                     │ │  Risk Level: NONE   │ │  Rate Impact:      │
    │  Lender new EMI:    │ │  (under 30%)        │ │  MINIMAL           │
    │  ₹32,000            │ │                     │ │                    │
    │                     │ │                     │ │                    │
    │  Safe new EMI:      │ │                     │ │                    │
    │  ₹22,000            │ │                     │ │                    │
    └──────────┬──────────┘ └──────────┬──────────┘ └─────────┬──────────┘
               │                       │                       │
               └───────────────────────┼───────────────────────┘
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │  BORROWING DECISION       │
                          │                           │
                          │  Safe EMI > 0? ✅         │
                          │  Cash flow OK? ✅         │
                          │  Critical debt? ❌        │
                          │                           │
                          │  DECISION: BORROW ✅      │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │  RESULTS DISPLAY          │
                          │                           │
                          │  Existing Debt:           │
                          │  • 2 active loans         │
                          │  • ₹5,50,000 outstanding  │
                          │  • ₹18,000 monthly EMI    │
                          │                           │
                          │  Safe new EMI: ₹22,000    │
                          │  Recommended: ₹8,00,000   │
                          │  Decision: BORROW         │
                          └───────────────────────────┘
```

---

## 🔄 EMI Flow (Used in Calculations)

```
                    ┌─────────────────┐
                    │  EXISTING EMI   │
                    │    ₹18,000      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┬─────────────────┐
        │                    │                    │                 │
        ▼                    ▼                    ▼                 ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐       ┌─────────┐
   │  FOIR   │         │  RISK   │         │  RATE   │       │  HARD   │
   │         │         │ SIGNALS │         │ ADJUST  │       │  STOP   │
   │ ₹50K    │         │         │         │         │       │         │
   │ -₹18K   │         │ ₹18K/   │         │ Ratio   │       │ Cash    │
   │ -----   │         │ ₹100K   │         │ 18%     │       │ Flow    │
   │ ₹32K    │         │ =18%    │         │ → +0.25%│       │ Check   │
   │         │         │         │         │         │       │         │
   │ New     │         │ None    │         │ Small   │       │ Pass ✅  │
   │ capacity│         │ (< 30%) │         │ penalty │       │         │
   └─────────┘         └─────────┘         └─────────┘       └─────────┘
```

---

## 📊 Outstanding Flow (Display Only)

```
                 ┌──────────────────────┐
                 │  TOTAL OUTSTANDING   │
                 │     ₹5,50,000        │
                 └──────────┬───────────┘
                            │
                            │  NOT used in:
                            │  • FOIR ❌
                            │  • Risk signals ❌
                            │  • Rate adjustment ❌
                            │  • Safe amount ❌
                            │  • Decision logic ❌
                            │
                            ▼
                 ┌──────────────────────┐
                 │   RESULTS DISPLAY    │
                 │                      │
                 │ "Total outstanding   │
                 │  across all loans:   │
                 │  ₹5,50,000"          │
                 │                      │
                 │ Shows context only   │
                 │ Transparency for     │
                 │ borrower             │
                 └──────────────────────┘
```

---

## 🚫 Hard Stop Scenario

```
┌──────────────────────────────────────────────────────────────┐
│  SCENARIO: High Existing EMI                                 │
│                                                               │
│  Income: ₹30,000                                             │
│  Expenses: ₹20,000                                           │
│  Existing EMI: ₹12,000  ◄─── CRITICAL                       │
│                                                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │  CASH FLOW CHECK         │
              │                           │
              │  ₹30,000  (income)        │
              │  -₹20,000 (expenses)      │
              │  -₹12,000 (existing EMI)  │
              │  ──────────────────       │
              │  -₹2,000  ◄─── NEGATIVE! │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │   IMMEDIATE HARD STOP    │
              │                           │
              │  Decision: DON'T BORROW  │
              │                           │
              │  Reason:                 │
              │  "No remaining cash flow │
              │   after expenses and     │
              │   existing EMIs"         │
              │                           │
              │  Assessment stops here   │
              │  No further questions    │
              └──────────────────────────┘

NOTE: Outstanding balance is irrelevant here.
      Whether it's ₹5L or ₹50L doesn't matter.
      The EMI already consumed all cash flow.
```

---

## ⚖️ Comparison: Same EMI, Different Outstanding

```
┌─────────────────────────────────────────────────────────────────┐
│  SCENARIO A: High Outstanding, Same EMI                         │
│                                                                  │
│  Loan: Outstanding ₹10,00,000, EMI ₹10,000                     │
│  Income: ₹100,000                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  EMI Ratio: 10%        │
            │  Safe new EMI: ₹30,000 │
            │  Result: BORROW        │
            └────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│  SCENARIO B: Low Outstanding, Same EMI                          │
│                                                                  │
│  Loan: Outstanding ₹1,00,000, EMI ₹10,000                      │
│  Income: ₹100,000                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  EMI Ratio: 10%        │
            │  Safe new EMI: ₹30,000 │
            │  Result: BORROW        │
            └────────────────────────┘

═══════════════════════════════════════════════════════════════════
  RESULT: IDENTICAL despite 10x difference in outstanding!
═══════════════════════════════════════════════════════════════════
```

---

## 🎯 Critical Debt Scenario

```
┌─────────────────────────────────────────────────────────────────┐
│  SCENARIO: Critical Debt Ratio                                  │
│                                                                  │
│  Income: ₹50,000                                                │
│  Existing EMI: ₹20,000  ◄─── 40% of income!                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │  RISK ASSESSMENT           │
            │                             │
            │  EMI / Income = 40%        │
            │                             │
            │  Threshold:                │
            │  • 30% = High risk         │
            │  • 40% = CRITICAL risk ⚠️  │
            │                             │
            │  Signal: "Existing debt    │
            │  is already very high"     │
            └─────────────┬──────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  RATE ADJUSTMENT            │
            │                              │
            │  Debt ratio 40% → +1% to +2%│
            │                              │
            │  Higher borrowing cost      │
            └─────────────┬───────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  BORROWING DECISION         │
            │                              │
            │  • Critical debt ratio ✗    │
            │  • Limited new capacity     │
            │  • High risk profile        │
            │                              │
            │  Result: DON'T BORROW       │
            └─────────────────────────────┘
```

---

## 📈 Full Decision Tree

```
                         ┌─────────────┐
                         │ Existing EMI│
                         └──────┬──────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
        Remaining Cash Flow <= 0?   Remaining Cash Flow > 0?
                  │                           │
                  ▼                           ▼
         ┌────────────────┐       ┌──────────────────┐
         │  DON'T BORROW  │       │  Continue eval   │
         │  (Hard Stop)   │       └────────┬─────────┘
         └────────────────┘                │
                                           │
                             ┌─────────────┴─────────────┐
                             │                           │
                   Safe EMI <= 0?              Safe EMI > 0?
                             │                           │
                             ▼                           ▼
                    ┌────────────────┐       ┌──────────────────┐
                    │  DON'T BORROW  │       │  Check debt      │
                    │  (Hard Stop)   │       │  ratio           │
                    └────────────────┘       └────────┬─────────┘
                                                      │
                                        ┌─────────────┴─────────────┐
                                        │                           │
                              Debt >= 40%?                  Debt < 40%?
                                        │                           │
                                        ▼                           ▼
                               ┌────────────────┐       ┌──────────────────┐
                               │ CRITICAL RISK  │       │  Check amount    │
                               │ + Other factors│       │  vs capacity     │
                               │ → DON'T BORROW │       └────────┬─────────┘
                               └────────────────┘                │
                                                   ┌──────────────┴──────────────┐
                                                   │                             │
                                          Amount >> Capacity?          Amount <= Capacity?
                                                   │                             │
                                                   ▼                             ▼
                                          ┌────────────────┐          ┌──────────────────┐
                                          │ BORROW LESS /  │          │     BORROW       │
                                          │  DON'T BORROW  │          │                  │
                                          └────────────────┘          └──────────────────┘
```

---

## 🔑 Key Insight

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  The borrowing decision is driven by MONTHLY CASH FLOW,         │
│  not total debt size.                                           │
│                                                                  │
│  • EMI = Monthly cash outflow     → CRITICAL ✅                 │
│  • Outstanding = Historical debt  → CONTEXT ONLY ℹ️             │
│                                                                  │
│  A ₹50L outstanding with ₹5K EMI is MORE AFFORDABLE than       │
│  a ₹2L outstanding with ₹20K EMI.                              │
│                                                                  │
│  Why? Because you need ₹5K/month, not ₹20K/month.             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

*Use these diagrams to understand exactly how your existing loan inputs affect the final borrowing recommendation.*
