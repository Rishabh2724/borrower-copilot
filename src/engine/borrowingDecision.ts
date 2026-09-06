import type { BorrowerProfile } from "../types/borrower";
import { calculateAffordability } from "./affordability";
import { calculateSafeAmount } from "./safeAmount";
import { calculateRiskSignals } from "./riskSignals";

export type BorrowDecision =
  | "borrow"
  | "borrow_less"
  | "dont_borrow";

export interface BorrowDecisionResult {
  decision: BorrowDecision;
  reasons: string[];
}

interface StressResult {
  affordabilityStatus: "safe" | "tight" | "unsafe";
}

export function determineBorrowDecision(
  profile: BorrowerProfile,
  stressTest?: StressResult
): BorrowDecisionResult {
  const affordability =
    calculateAffordability(profile);

  const safeAmount =
    calculateSafeAmount(profile);

  const riskSignals =
    calculateRiskSignals(profile);

  const reasons: string[] = [];

  const securedLoanWithoutSecurity =
  (
    profile.loan.type === "lap" ||
    profile.loan.type === "gold"
  ) &&
  profile.collateral?.available !== true;

if (securedLoanWithoutSecurity) {
  return {
    decision: "dont_borrow",
    reasons: [
      profile.loan.type === "lap"
        ? "Loan Against Property requires eligible property that can potentially be offered as security."
        : "A gold loan requires eligible gold that can potentially be pledged as security.",
      "Because suitable security was not confirmed, this selected secured product is not currently a viable borrowing route.",
    ],
  };
}

  /*
   * HARD STOP #1
   *
   * If household expenses + existing EMIs
   * consume all available income, there is
   * no remaining cash flow for a new EMI.
   *
   * Example:
   * Income       ₹10,000
   * Expenses      ₹9,000
   * Existing EMI  ₹1,000
   * --------------------
   * Remaining          ₹0
   */
  const remainingCashFlow =
    affordability.householdIncome -
    profile.monthlyHouseholdExpenses -
    affordability.existingEmi;

  if (remainingCashFlow <= 0) {
    return {
      decision: "dont_borrow",
      reasons: [
        "Your household expenses and existing EMIs already consume your available income.",
        `After household expenses and existing EMIs, your remaining monthly cash flow is ₹${Math.round(
          Math.max(0, remainingCashFlow)
        ).toLocaleString("en-IN")}. There is no conservative capacity for another EMI.`,
      ],
    };
  }

  /*
   * HARD STOP #2
   *
   * The affordability engine says there is
   * no safe capacity for a new EMI.
   */
  if (
    affordability.safeNewEmiCapacity <= 0
  ) {
    return {
      decision: "dont_borrow",
      reasons: [
        "Existing financial obligations already consume the conservative repayment capacity.",
        "There is no remaining conservative capacity for a new EMI after accounting for income, household expenses and existing debt.",
      ],
    };
  }

  const criticalCreditRisk =
    riskSignals.some(
      (signal) =>
        signal.id === "very_weak_credit"
    );

  const criticalDebtRisk =
    riskSignals.some(
      (signal) =>
        signal.id ===
        "critical_existing_debt"
    );

  const repaymentIssue =
    riskSignals.some(
      (signal) =>
        signal.id === "repayment_issue"
    );

  // Total debt-to-income ratio signals
  const veryHighTotalDebt =
    riskSignals.some(
      (signal) =>
        signal.id === "very_high_total_debt"
    );

  const highTotalDebt =
    riskSignals.some(
      (signal) =>
        signal.id === "high_total_debt"
    );

  /*
   * VERY HIGH TOTAL DEBT (DTI >= 4x)
   * 
   * Outstanding debt is 4x or more of annual income.
   * This indicates severe debt burden that makes
   * additional borrowing very risky.
   */
  if (veryHighTotalDebt) {
    return {
      decision: "dont_borrow",
      reasons: [
        "Total outstanding debt is extremely high relative to income (4x+ annual income).",
        "Taking additional debt with this existing debt burden would create severe financial vulnerability.",
        "Focus on reducing existing debt before considering new borrowing.",
      ],
    };
  }

  /*
   * VERY WEAK CREDIT + ANOTHER MATERIAL RISK
   */
  if (
    criticalCreditRisk &&
    (
      stressTest?.affordabilityStatus ===
        "unsafe" ||
      criticalDebtRisk ||
      repaymentIssue
    )
  ) {
    return {
      decision: "dont_borrow",
      reasons: [
        "The credit profile is very weak and another material repayment-risk signal is present.",
        "Taking additional debt in this situation could increase the likelihood of unaffordable repayment or limited lender options.",
      ],
    };
  }

  /*
   * HIGH TOTAL DEBT + ANOTHER RISK FACTOR
   * 
   * DTI is 3-4x annual income AND another risk is present.
   * This combination makes additional borrowing too risky.
   */
  if (
    highTotalDebt &&
    (
      stressTest?.affordabilityStatus === "unsafe" ||
      criticalDebtRisk ||
      repaymentIssue ||
      criticalCreditRisk
    )
  ) {
    return {
      decision: "dont_borrow",
      reasons: [
        "Total outstanding debt is very high (3-4x annual income) and combined with other risk factors.",
        "This combination creates excessive financial risk for additional borrowing.",
        "Address existing debt load or other risk factors before considering new loans.",
      ],
    };
  }

  /*
   * REQUESTED AMOUNT IS FAR ABOVE SAFE CAPACITY
   */
  if (
    safeAmount.max <
    profile.loan.amountWanted * 0.5
  ) {
    return {
      decision: "dont_borrow",
      reasons: [
        "The requested amount is substantially above the estimated safe borrowing capacity.",
      ],
    };
  }

  /*
   * REQUESTED AMOUNT IS ABOVE SAFE CAPACITY
   */
  if (
    safeAmount.max <
    profile.loan.amountWanted
  ) {
    reasons.push(
      "The requested amount is higher than the estimated safe borrowing capacity."
    );

    if (criticalCreditRisk) {
      reasons.push(
        "The very weak credit profile is likely to narrow lender options and increase borrowing cost."
      );
    }

    if (highTotalDebt) {
      reasons.push(
        "Total outstanding debt is already very high (3-4x annual income), making the requested amount less prudent."
      );
    }

    if (
      stressTest?.affordabilityStatus ===
      "unsafe"
    ) {
      reasons.push(
        "The proposed repayment becomes unsafe under a 20% income-drop stress test."
      );
    }

    return {
      decision: "borrow_less",
      reasons,
    };
  }

  /*
   * BASELINE IS AFFORDABLE BUT STRESS TEST FAILS
   */
  if (
    stressTest?.affordabilityStatus ===
    "unsafe"
  ) {
    return {
      decision: "borrow_less",
      reasons: [
        "The requested amount fits the baseline affordability estimate but becomes unsafe if income falls by 20%.",
        "Reducing the amount or extending the repayment period can create more repayment room.",
        ...(criticalCreditRisk
          ? [
              "The very weak credit profile also makes the requested borrowing less suitable.",
            ]
          : []),
      ],
    };
  }

  /*
   * VERY WEAK CREDIT
   */
  if (criticalCreditRisk) {
    return {
      decision: "borrow_less",
      reasons: [
        "The requested amount is affordable at baseline, but the very weak credit profile makes additional borrowing less suitable.",
        "Consider a smaller amount and compare secured or lower-cost alternatives where appropriate.",
      ],
    };
  }

  /*
   * HIGH TOTAL DEBT (DTI 3-4x) WITHOUT OTHER RISKS
   * 
   * Monthly affordability is OK, but total debt load
   * is already elevated. Recommend borrowing less to
   * avoid excessive total debt burden.
   */
  if (highTotalDebt) {
    return {
      decision: "borrow_less",
      reasons: [
        "Monthly repayment capacity supports the requested amount, but total outstanding debt is already very high (3-4x annual income).",
        "Borrowing less would keep total debt burden more manageable and maintain financial flexibility.",
        "Consider whether the new loan is essential before adding to existing debt load.",
      ],
    };
  }

  /*
   * BORROW
   */
  if (
    stressTest?.affordabilityStatus ===
    "tight"
  ) {
    reasons.push(
      "The requested amount is affordable at baseline but becomes tight under a 20% income-drop stress test."
    );
  } else {
    reasons.push(
      "The requested amount appears compatible with the estimated conservative repayment capacity and passes the income stress test."
    );
  }

  return {
    decision: "borrow",
    reasons,
  };
}
