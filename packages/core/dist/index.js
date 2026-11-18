export const TMO_CORE_VERSION = "1.0.0";
export const TMO_SCHEMA_VERSION = "1.0.0";
export function traceOrigins(ids, g) { return new Set(ids.map(id => g.records.get(id)?.originId).filter((x) => !!x)); }
export function countIndependentOrigins(ids, g) { return traceOrigins(ids, g).size; }
export function deriveProvenanceBound(e, g) { const ids = e.flatMap(x => x.provenanceIds); const n = countIndependentOrigins(ids, g); return { independentOrigins: n, independenceMaximum: ids.length ? n / ids.length : null, inputProvenanceIds: ids }; }
export function validateAgainstBound(proposed, b) { if (proposed === null || b.independenceMaximum === null)
    return { status: "INDETERMINATE", failures: [] }; return proposed <= b.independenceMaximum ? { status: "VALID", failures: [] } : { status: "INVALID", failures: [{ code: "TMO-105", resourceIds: [], details: "Proposed value exceeds provenance bound" }] }; }
export function validateTemporalDerivation(inputs, output) { const rank = { UNKNOWN: 0, YEAR: 1, MONTH: 2, DAY: 3, HOUR: 4, MINUTE: 5, SECOND: 6 }; if (!inputs.length)
    return { status: "INDETERMINATE", failures: [] }; const ceiling = Math.min(...inputs.map(x => rank[x.precision])); return rank[output.precision] <= ceiling ? { status: "VALID", failures: [] } : { status: "INVALID", failures: [{ code: "TMO-106", resourceIds: [output.id], details: "Derived temporal precision exceeds least-precise required source" }] }; }
export function validateRelation(r) { return r.kind === "ASSOCIATION" || r.sourceIds.length ? { status: "VALID", failures: [] } : { status: "INVALID", failures: [{ code: "TMO-107", resourceIds: [r.id], details: "Elevated relation requires independent source support" }] }; }
export function createEvaluationEnvelope(x) { return Object.freeze({ ...x, coreVersion: TMO_CORE_VERSION, schemaVersion: TMO_SCHEMA_VERSION }); }
