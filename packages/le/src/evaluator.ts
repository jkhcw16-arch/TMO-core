import type { LEEvidenceItem, LERecordSet, LEValidationResult } from "./model.js";
import { checkInvariants } from "./invariants.js";
const arrays=["events","actors","roles","agencies","assertions","evidence","sourceRecords","communications","responses","institutionalActions","decisions","temporalEntities","contradictions","corroborations","auditFindings","provenanceRecords","derivations","propositions","relations"] as const;
export function emptyRecordSet():LERecordSet { return Object.fromEntries(arrays.map(k=>[k,[]])) as unknown as LERecordSet; }
function score(items:LEEvidenceItem[]):number|null { const usable=items.filter(e=>e.direction!==null); if(!usable.length)return null; let sum=0,weight=0; for(const e of usable){ const vals=Object.values(e.weight).filter((v):v is number=>v!==null); const w=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0; sum+=(e.direction??0)*w; weight+=w; } return weight?sum/weight:0; }
export function validateLE(r:LERecordSet):LEValidationResult {
 const failures=checkInvariants(r); const scores=Object.fromEntries(r.propositions.map(p=>[p.id,score(r.evidence.filter(e=>e.propositionId===p.id))]));
 const unresolved=r.assertions.some(a=>a.verification==="INDETERMINATE")||r.evidence.some(e=>e.direction===null||e.verification==="INDETERMINATE");
 return {profile:"LE",version:"1.0.0",status:failures.length?"INVALID":unresolved?"INDETERMINATE":"VALID",failures,metrics:{resourceCount:Object.values(r).flat().length,independentOriginCount:new Set(r.provenanceRecords.map(p=>p.originId)).size,propositionScores:scores}};
}
