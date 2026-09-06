import type { BorrowerProfile } from "../types/borrower";
import { AFFORDABILITY_RULES } from "../rules/thresholds";

/**
 * Verify and adjust income for self-employed borrowers
 * based on ITR documentation.
 * 
 * For self-employed: compares stated income with ITR income
 * and adjusts conservatively if there's a significant gap.
 */
export function getVerifiedIncome(
  profile: BorrowerProfile
): {
  income: number;
  source: "stated" | "itr" | "blended";
  discrepancyWarning?: string;
} {
  const statedAverage =
    (profile.monthlyIncome.min + profile.monthlyIncome.max) / 2;

  // Only applies to self-employed with ITR data
  if (
    profile.employmentType !== "self_employed" ||
    !profile.business?.annualItrIncome ||
    profile.business.annualItrIncome <= 0
  ) {
    return {
      income: statedAverage,
      source: "stated",
    };
  }

  const itrMonthly = profile.business.annualItrIncome / 12;

  // If ITR is higher or equal, use stated (no adjustment needed)
  if (itrMonthly >= statedAverage) {
    return {
      income: statedAverage,
      source: "stated",
    };
  }

  const discrepancy = (statedAverage - itrMonthly) / itrMonthly;

  // Large gap (>50%): Use ITR income
  if (discrepancy > 0.50) {
    return {
      income: itrMonthly,
      source: "itr",
      discrepancyWarning: `Stated monthly income (₹${Math.round(
        statedAverage / 1000
      )}K) is ${Math.round(
        discrepancy * 100
      )}% above ITR-documented income (₹${Math.round(
        itrMonthly / 1000
      )}K). Using documented ITR income for conservative assessment.`,
    };
  }

  // Moderate gap (25-50%): Blend 70% ITR, 30% stated
  if (discrepancy > 0.25) {
    const blendedIncome = itrMonthly * 0.7 + statedAverage * 0.3;
    return {
      income: blendedIncome,
      source: "blended",
      discrepancyWarning: `Stated income is ${Math.round(
        discrepancy * 100
      )}% above ITR income. Using conservative blend of documented (70%) and stated (30%) income for assessment.`,
    };
  }

  // Small gap (<25%): Use stated income
  return {
    income: statedAverage,
    source: "stated",
  };
}

export function getNormalizedIncome(
  profile: BorrowerProfile
): number {
  // Get verified income (adjusted for ITR if applicable)
  const { income: verifiedIncome } = getVerifiedIncome(profile);

  const haircut =
    AFFORDABILITY_RULES.incomeHaircut[profile.monthlyIncome.stability];

  return verifiedIncome * haircut;
}