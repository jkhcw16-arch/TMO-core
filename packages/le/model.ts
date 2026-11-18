export const LE_PROFILE_ID = "LE" as const;
export const LE_PROFILE_VERSION = "1.0.0" as const;
export type LEStatus = "VALID" | "INVALID" | "INDETERMINATE";
export type LEQualification = "CAPTURED"|"ASSERTED"|"OBSERVED"|"DERIVED"|"SUPPORTED"|"CORROBORATED"|"CONTESTED"|"CONTRADICTED"|"INDETERMINATE";
export type LEVerification = "UNVERIFIED"|"PARTIALLY_VERIFIED"|"VERIFIED"|"FAILED"|"INDETERMINATE";
export type LEIdentityResolution = "RESOLVED"|"PROBABLE_MATCH"|"POSSIBLE_MATCH"|"UNRESOLVED"|"CONFLICT";
export type LEEpistemicState = "UNASSESSED"|"SUPPORTED"|"PARTIALLY_SUPPORTED"|"CONTRADICTION"|"INCONCLUSIVE"|"WITHDRAWN";
export type LERoleKind = "INITIATOR"|"AMPLIFIER"|"AUTHORITY_ACTOR"|"ESCALATOR"|"SUPPRESSOR"|"COORDINATOR"|"RETALIATORY_ACTOR"|"ISOLATOR";
export type LERelationKind = "ASSOCIATION"|"ATTRIBUTION"|"COORDINATION"|"CAUSATION"|"AUTHORIZATION";
export type LEPropositionDirection = -1|0|1|null;
export interface LERef { id:string }
export interface LETemporalEntity extends LERef { value?:string; earliest?:string; latest?:string; precision:"SECOND"|"MINUTE"|"HOUR"|"DAY"|"MONTH"|"YEAR"|"INTERVAL"|"UNKNOWN"; sourceIds:string[] }
export interface LEProvenanceRecord extends LERef { originId:string; sourceRecordId:string; parentDerivationIds:string[]; capturedAt?:string }
export interface LESourceRecord extends LERef { recordType:string; provenanceId:string; qualification:LEQualification; verification:LEVerification; temporalId?:string }
export interface LEEvent extends LERef { type:string; temporalId:string; sourceIds:string[]; provenanceStatus:LEEpistemicState; synthetic:boolean }
export interface LEActor extends LERef { identityResolution:LEIdentityResolution; sourceIds:string[] }
export interface LERole extends LERef { actorId:string; kind:LERoleKind; contextId:string; sourceIds:string[] }
export interface LEAgency extends LERef { name:string; sourceIds:string[] }
export interface LEAssertion extends LERef { propositionId:string; statement:string; attributedActorId?:string; sourceIds:string[]; qualification:LEQualification; verification:LEVerification }
export interface EvidenceWeight { relevance:number|null; context:number|null; sourceIdentity:number|null; authenticity:number|null; independence:number|null; specificity:number|null; temporalProximity:number|null; technicalQuality:number|null }
export interface LEEvidenceItem extends LERef { sourceIds:string[]; provenanceIds:string[]; propositionId:string; direction:LEPropositionDirection; qualification:LEQualification; verification:LEVerification; weight:EvidenceWeight }
export interface LECommunication extends LERef { senderActorId?:string; recipientActorIds:string[]; temporalId:string; sourceIds:string[] }
export interface LEResponse extends LERef { communicationId:string; actorId:string; temporalId:string; sourceIds:string[] }
export interface LEInstitutionalAction extends LERef { agencyId:string; actorIds:string[]; temporalId:string; sourceIds:string[]; consequenceIds:string[] }
export interface LEDecision extends LERef { decisionMakerIds:string[]; temporalId:string; sourceIds:string[]; actionId?:string }
export interface LERelation extends LERef { kind:LERelationKind; fromId:string; toId:string; sourceIds:string[]; qualification:LEQualification }
export interface LEContradiction extends LERef { propositionId:string; evidenceIds:string[]; sourceIds:string[] }
export interface LECorroboration extends LERef { propositionId:string; evidenceIds:string[]; independentOriginIds:string[]; sourceIds:string[] }
export interface LEAuditFinding extends LERef { code:string; status:LEStatus; resourceIds:string[]; details:string }
export interface LEDerivation extends LERef { inputIds:string[]; outputId:string; operation:string; sourceIds:string[] }
export interface LEProposition extends LERef { text:string; epistemicState:LEEpistemicState }
export interface LERecordSet {
  events:LEEvent[]; actors:LEActor[]; roles:LERole[]; agencies:LEAgency[]; assertions:LEAssertion[]; evidence:LEEvidenceItem[]; sourceRecords:LESourceRecord[]; communications:LECommunication[]; responses:LEResponse[]; institutionalActions:LEInstitutionalAction[]; decisions:LEDecision[]; temporalEntities:LETemporalEntity[]; contradictions:LEContradiction[]; corroborations:LECorroboration[]; auditFindings:LEAuditFinding[]; provenanceRecords:LEProvenanceRecord[]; derivations:LEDerivation[]; propositions:LEProposition[]; relations:LERelation[];
}
export interface LEValidationResult { profile:"LE"; version:"1.0.0"; status:LEStatus; failures:ReadonlyArray<LEAuditFinding>; metrics:{resourceCount:number; independentOriginCount:number; propositionScores:Record<string,number|null>} }
