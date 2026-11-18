import {
  TMO_CORE_VERSION, TMO_SCHEMA_VERSION,
  type ValidationStatus, type EpistemicState, type Qualification,
  type EvidenceDirection, type RelationKind, type TemporalPrecision,
  type TemporalForm, type TemporalEntity, type EvidenceWeight,
  type EvidenceItem, type Relation, type CoreEvaluationEnvelope,
  type ValidationResult, type ProvenanceRecord, type Derivation
} from '../src/index.js';

const coreVersion: '1.0.0' = TMO_CORE_VERSION;
const schemaVersion: '1.0.0' = TMO_SCHEMA_VERSION;
const valid: ValidationStatus = 'VALID';
const invalid: ValidationStatus = 'INVALID';
const unknown: ValidationStatus = 'INDETERMINATE';
const contextual: EvidenceDirection = 0;
const unresolved: EvidenceDirection = null;
const support: EvidenceDirection = 1;
const contradict: EvidenceDirection = -1;
const instant: TemporalForm = 'INSTANT';
const interval: TemporalForm = 'INTERVAL';
const second: TemporalPrecision = 'SECOND';
const q: Qualification = 'ASSERTED';
const e: EpistemicState = 'INCONCLUSIVE';
const relationKind: RelationKind = 'AUTHORIZATION';
const temporal: TemporalEntity = { id:'t', form:instant, precision:second, sourceIds:[] };
const weights: EvidenceWeight = { relevance:null, context:0, sourceIdentity:1, authenticity:1, independence:null, specificity:1, temporalProximity:null, technicalQuality:1 };
const evidence: EvidenceItem = { id:'e', propositionId:'p', sourceIds:[], provenanceIds:[], direction:unresolved, qualification:q, weight:weights };
const relation: Relation = { id:'r', kind:relationKind, fromId:'a', toId:'b', sourceIds:[], qualification:q };
const provenance: ProvenanceRecord = { id:'pr', originId:'o', sourceRecordId:'s', parentDerivationIds:[] };
const derivation: Derivation = { id:'d', inputIds:['a'], outputId:'b', operation:'op', sourceIds:[] };
const vr: ValidationResult = { status:unknown, failures:[] };
const envelope: CoreEvaluationEnvelope<{ok:true}> = { evaluationId:'x',coreVersion,schemaVersion,profileId:'P',profileVersion:'1.0.0',status:valid,result:{ok:true},failures:[],sourceIds:[],provenanceIds:[],derivationIds:[],limitations:[],auditReference:'audit' };
void [invalid, contextual, support, contradict, interval, e, temporal, evidence, relation, provenance, derivation, vr, envelope];

// Negative compile-time contract checks. If an invalid shape becomes accepted,
// TypeScript reports an unused @ts-expect-error and the contract test fails.
// @ts-expect-error invalid ValidationStatus
const badStatus: ValidationStatus = 'PASS';
// @ts-expect-error unknown is null, not numeric 0
const badDirection: EvidenceDirection = 2;
// @ts-expect-error INTERVAL is form, not precision
const badPrecision: TemporalPrecision = 'INTERVAL';
// @ts-expect-error TemporalEntity requires explicit form
const missingForm: TemporalEntity = { id:'t2', precision:'DAY', sourceIds:[] };
// @ts-expect-error relation kind is a closed public union
const badRelationKind: RelationKind = 'IMPLIES';
// @ts-expect-error evidence direction is required
const missingDirection: EvidenceItem = { id:'e2', propositionId:'p', sourceIds:[], provenanceIds:[], qualification:'ASSERTED', weight:weights };
// @ts-expect-error envelope requires auditReference
const noAudit: CoreEvaluationEnvelope<unknown> = { evaluationId:'x',coreVersion,schemaVersion,profileId:'P',profileVersion:'1.0.0',status:'VALID',failures:[],sourceIds:[],provenanceIds:[],derivationIds:[],limitations:[] };
void [badStatus,badDirection,badPrecision,missingForm,badRelationKind,missingDirection,noAudit];
