export declare const TMO_CORE_VERSION: "1.0.0";
export declare const TMO_SCHEMA_VERSION: "1.0.0";
export type ValidationStatus = "VALID" | "INVALID" | "INDETERMINATE";
export type EpistemicState = "UNASSESSED" | "SUPPORTED" | "PARTIALLY_SUPPORTED" | "CONTRADICTED" | "INCONCLUSIVE" | "WITHDRAWN";
export type Qualification = "CAPTURED" | "ASSERTED" | "OBSERVED" | "DERIVED" | "SUPPORTED" | "CORROBORATED" | "CONTESTED" | "CONTRADICTED" | "INDETERMINATE";
export type EvidenceDirection = -1 | 0 | 1 | null;
export type RelationKind = "ASSOCIATION" | "ATTRIBUTION" | "COORDINATION" | "CAUSATION" | "AUTHORIZATION";
export interface TMORef {
    id: string;
}
export interface ValidationFailure {
    code: string;
    resourceIds: readonly string[];
    details: string;
}
export interface ValidationResult {
    status: ValidationStatus;
    failures: readonly ValidationFailure[];
}
export interface ProvenanceRecord extends TMORef {
    originId: string;
    sourceRecordId: string;
    parentDerivationIds: readonly string[];
}
export interface Derivation extends TMORef {
    inputIds: readonly string[];
    outputId: string;
    operation: string;
    sourceIds: readonly string[];
}
export type TemporalPrecision = "UNKNOWN" | "YEAR" | "MONTH" | "DAY" | "HOUR" | "MINUTE" | "SECOND";
export type TemporalForm = "INSTANT" | "INTERVAL";
export interface TemporalEntity extends TMORef {
    form: TemporalForm;
    precision: TemporalPrecision;
    sourceIds: readonly string[];
}
export interface EvidenceWeight {
    relevance: number | null;
    context: number | null;
    sourceIdentity: number | null;
    authenticity: number | null;
    independence: number | null;
    specificity: number | null;
    temporalProximity: number | null;
    technicalQuality: number | null;
}
export interface EvidenceItem extends TMORef {
    propositionId: string;
    sourceIds: readonly string[];
    provenanceIds: readonly string[];
    direction: EvidenceDirection;
    qualification: Qualification;
    weight: EvidenceWeight;
}
export interface Relation extends TMORef {
    kind: RelationKind;
    fromId: string;
    toId: string;
    sourceIds: readonly string[];
    qualification: Qualification;
}
export interface ProvenanceGraph {
    records: ReadonlyMap<string, ProvenanceRecord>;
}
export interface ProvenanceBound {
    independentOrigins: number;
    independenceMaximum: number | null;
    inputProvenanceIds: readonly string[];
}
export interface CoreEvaluationEnvelope<T> {
    evaluationId: string;
    coreVersion: string;
    schemaVersion: string;
    profileId: string;
    profileVersion: string;
    status: ValidationStatus;
    result?: Readonly<T>;
    failures: readonly ValidationFailure[];
    sourceIds: readonly string[];
    provenanceIds: readonly string[];
    derivationIds: readonly string[];
    limitations: readonly string[];
    auditReference: string;
}
export declare function traceOrigins(ids: readonly string[], g: ProvenanceGraph): ReadonlySet<string>;
export declare function countIndependentOrigins(ids: readonly string[], g: ProvenanceGraph): number;
export declare function deriveProvenanceBound(e: readonly EvidenceItem[], g: ProvenanceGraph): ProvenanceBound;
export declare function validateAgainstBound(proposed: number | null, b: ProvenanceBound): ValidationResult;
export declare function validateTemporalDerivation(inputs: readonly TemporalEntity[], output: TemporalEntity): ValidationResult;
export declare function validateRelation(r: Relation): ValidationResult;
export declare function createEvaluationEnvelope<T>(x: Omit<CoreEvaluationEnvelope<T>, "coreVersion" | "schemaVersion">): CoreEvaluationEnvelope<T>;
