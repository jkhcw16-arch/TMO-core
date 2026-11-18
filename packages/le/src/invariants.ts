import type { LEAuditFinding, LERecordSet } from "./model.js";
const failure=(code:string,resourceIds:string[],details:string):LEAuditFinding=>({id:`finding-${code}-${resourceIds.join('-')||'set'}`,code,status:"INVALID",resourceIds,details});
const allIds=(r:LERecordSet)=>new Set(Object.values(r).flat().map((x:{id:string})=>x.id));
export function checkInvariants(r:LERecordSet):LEAuditFinding[]{
 const out:LEAuditFinding[]=[]; const ids=allIds(r); const sources=new Map(r.sourceRecords.map(x=>[x.id,x])); const prov=new Map(r.provenanceRecords.map(x=>[x.id,x])); const times=new Map(r.temporalEntities.map(x=>[x.id,x]));
 // LE-101 preservation before interpretation
 for(const d of r.derivations){ if(!d.inputIds.length||d.inputIds.some(id=>!ids.has(id))||!ids.has(d.outputId)||d.sourceIds.some(id=>!sources.has(id))) out.push(failure("LE-101",[d.id],"Derivation is not fully source-addressable")); }
 for(const e of r.events){ if(!e.sourceIds.length||e.sourceIds.some(id=>!sources.has(id))) out.push(failure("LE-101",[e.id],"Event lacks addressable source")); if(e.synthetic&&e.sourceIds.length<1) out.push(failure("LE-101",[e.id],"Synthetic event requires a source")); }
 // LE-102 assertion is not fact
 for(const a of r.assertions){ if(a.qualification==="OBSERVED"&&a.verification==="UNVERIFIED") out.push(failure("LE-102",[a.id],"Unverified assertion cannot be promoted to observed fact")); }
 // LE-103 unknown is not zero/pass
 for(const e of r.evidence){ for(const [k,v] of Object.entries(e.weight)){ if(v===0 && (e.verification==="INDETERMINATE"||e.qualification==="INDETERMINATE")) out.push(failure("LE-103",[e.id],`Unknown ${k} coerced to zero`)); } }
 // LE-104 independence is origin based
 for(const c of r.corroborations){ const origins=new Set(c.evidenceIds.flatMap(id=>r.evidence.find(e=>e.id===id)?.provenanceIds??[]).map(id=>prov.get(id)?.originId).filter((x):x is string=>!!x)); if(c.independentOriginIds.some(id=>!origins.has(id))||new Set(c.independentOriginIds).size!==c.independentOriginIds.length) out.push(failure("LE-104",[c.id],"Corroboration independence does not match provenance origins")); }
 // LE-105 strength provenance bounded (independence dimension cannot exceed distinct origins normalized to evidence count)
 for(const e of r.evidence){ const origins=new Set(e.provenanceIds.map(id=>prov.get(id)?.originId).filter(Boolean)); const bound=e.provenanceIds.length?origins.size/e.provenanceIds.length:null; if(bound!==null&&e.weight.independence!==null&&e.weight.independence>bound) out.push(failure("LE-105",[e.id],"Independence weight exceeds provenance bound")); }
 // LE-106 temporal precision cannot be manufactured
 const rank={UNKNOWN:0,YEAR:1,MONTH:2,DAY:3,HOUR:4,MINUTE:5,SECOND:6,INTERVAL:1} as const;
 for(const d of r.derivations){ const outputTime=r.temporalEntities.find(t=>t.id===d.outputId); if(!outputTime) continue; const inputTimes=d.inputIds.map(id=>times.get(id)).filter((x):x is NonNullable<typeof x>=>!!x); if(inputTimes.length&&rank[outputTime.precision]>Math.max(...inputTimes.map(t=>rank[t.precision]))) out.push(failure("LE-106",[d.id,outputTime.id],"Derived temporal precision exceeds source precision")); }
 // LE-107 relations remain independent
 const relationKeys=new Set<string>(); for(const rel of r.relations){ const key=`${rel.kind}:${rel.fromId}:${rel.toId}`; if(relationKeys.has(key)) continue; relationKeys.add(key); if(rel.kind!=="ASSOCIATION"&&!rel.sourceIds.length) out.push(failure("LE-107",[rel.id],"Elevated relation lacks independent support")); }
 return out;
}
