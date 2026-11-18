export const TMO_CORE_VERSION="1.0.0" as const;
export const TMO_SCHEMA_VERSION="1.0.0" as const;
export type ValidationStatus="VALID"|"INVALID"|"INDETERMINATE";
export type EpistemicState="UNASSESSED"|"SUPPORTED"|"PARTIALLY_SUPPORTED"|"CONTRADICTED"|"INCONCLUSIVE"|"WITHDRAWN";
export type Qualification="CAPTURED"|"ASSERTED"|"OBSERVED"|"DERIVED"|"SUPPORTED"|"CORROBORATED"|"CONTESTED"|"CONTRADICTED"|"INDETERMINATE";
export type EvidenceDirection=-1|0|1|null;
export type RelationKind="ASSOCIATION"|"ATTRIBUTION"|"COORDINATION"|"CAUSATION"|"AUTHORIZATION";
export interface TMORef{id:string}
export interface ValidationFailure{code:string;resourceIds:readonly string[];details:string}
export interface ValidationResult{status:ValidationStatus;failures:readonly ValidationFailure[]}
export interface ProvenanceRecord extends TMORef{originId:string;sourceRecordId:string;parentDerivationIds:readonly string[]}
export interface Derivation extends TMORef{inputIds:readonly string[];outputId:string;operation:string;sourceIds:readonly string[]}
export type TemporalPrecision="UNKNOWN"|"YEAR"|"MONTH"|"DAY"|"HOUR"|"MINUTE"|"SECOND";
export type TemporalForm="INSTANT"|"INTERVAL";
export interface TemporalEntity extends TMORef{form:TemporalForm;precision:TemporalPrecision;sourceIds:readonly string[]}
export interface EvidenceWeight{relevance:number|null;context:number|null;sourceIdentity:number|null;authenticity:number|null;independence:number|null;specificity:number|null;temporalProximity:number|null;technicalQuality:number|null}
export interface EvidenceItem extends TMORef{propositionId:string;sourceIds:readonly string[];provenanceIds:readonly string[];direction:EvidenceDirection;qualification:Qualification;weight:EvidenceWeight}
export interface Relation extends TMORef{kind:RelationKind;fromId:string;toId:string;sourceIds:readonly string[];qualification:Qualification}
export interface ProvenanceGraph{records:ReadonlyMap<string,ProvenanceRecord>}
export interface ProvenanceBound{independentOrigins:number;independenceMaximum:number|null;inputProvenanceIds:readonly string[]}
export interface CoreEvaluationEnvelope<T>{evaluationId:string;coreVersion:string;schemaVersion:string;profileId:string;profileVersion:string;status:ValidationStatus;result?:Readonly<T>;failures:readonly ValidationFailure[];sourceIds:readonly string[];provenanceIds:readonly string[];derivationIds:readonly string[];limitations:readonly string[];auditReference:string}
export function traceOrigins(ids:readonly string[],g:ProvenanceGraph):ReadonlySet<string>{return new Set(ids.map(id=>g.records.get(id)?.originId).filter((x):x is string=>!!x));}
export function countIndependentOrigins(ids:readonly string[],g:ProvenanceGraph):number{return traceOrigins(ids,g).size;}
export function deriveProvenanceBound(e:readonly EvidenceItem[],g:ProvenanceGraph):ProvenanceBound{const ids=e.flatMap(x=>x.provenanceIds);const n=countIndependentOrigins(ids,g);return {independentOrigins:n,independenceMaximum:ids.length?n/ids.length:null,inputProvenanceIds:ids};}
export function validateAgainstBound(proposed:number|null,b:ProvenanceBound):ValidationResult{if(proposed===null||b.independenceMaximum===null)return {status:"INDETERMINATE",failures:[]};return proposed<=b.independenceMaximum?{status:"VALID",failures:[]}:{status:"INVALID",failures:[{code:"TMO-105",resourceIds:[],details:"Proposed value exceeds provenance bound"}]};}
export function validateTemporalDerivation(inputs:readonly TemporalEntity[],output:TemporalEntity):ValidationResult{const rank:Record<TemporalPrecision,number>={UNKNOWN:0,YEAR:1,MONTH:2,DAY:3,HOUR:4,MINUTE:5,SECOND:6};if(!inputs.length)return {status:"INDETERMINATE",failures:[]};const ceiling=Math.min(...inputs.map(x=>rank[x.precision]));return rank[output.precision]<=ceiling?{status:"VALID",failures:[]}:{status:"INVALID",failures:[{code:"TMO-106",resourceIds:[output.id],details:"Derived temporal precision exceeds least-precise required source"}]};}
export function validateRelation(r:Relation):ValidationResult{return r.kind==="ASSOCIATION"||r.sourceIds.length?{status:"VALID",failures:[]}:{status:"INVALID",failures:[{code:"TMO-107",resourceIds:[r.id],details:"Elevated relation requires independent source support"}]};}
export function createEvaluationEnvelope<T>(x:Omit<CoreEvaluationEnvelope<T>,"coreVersion"|"schemaVersion">):CoreEvaluationEnvelope<T>{return Object.freeze({...x,coreVersion:TMO_CORE_VERSION,schemaVersion:TMO_SCHEMA_VERSION});}
