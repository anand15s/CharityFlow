// CharityFlow Compliance Engine v2.0
// Re-exports all compliance functionality

export * from "./types";
export * from "./state-rules";
export {
  determineForm990Version,
  needsForm990T,
  resolveStateCode,
  calculateFilingFee,
  determineAuditRequirement,
  isReligiousExempt,
  calculateComplianceHealthScore,
  calculateFilingDeadline,
  getIRSDeadline,
  generateComplianceRoadmap,
  getRecentLawUpdates,
  translateToPlainLanguage,
  COMPLIANCE_PLAIN_LANGUAGE,
} from "./compliance-engine";
