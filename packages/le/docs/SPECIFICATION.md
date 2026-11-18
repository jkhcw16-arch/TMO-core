# TMO-LE 1.0.0 Specification

TMO-LE is a versioned TMO application profile for representing and overlapping law-enforcement-domain records for evaluation while preserving provenance, uncertainty, temporal state, qualified assertions, derivation history, fact qualification, evidence weighting, proposition-evidence scoring, attribution, functional roles, action-consequence separation, condition vectors, and situational analysis.

## Foundational invariants
- LE-101: preservation before interpretation.
- LE-102: assertion is not fact.
- LE-103: unknown is not zero and not pass.
- LE-104: evidence independence is origin based.
- LE-105: finding strength is provenance bounded.
- LE-106: temporal precision cannot be manufactured.
- LE-107: association, attribution, coordination, causation, and authorization remain independent.

## Result semantics
- VALID: the represented record set conforms to the profile and contains no unresolved required state.
- INVALID: at least one invariant or structural constraint fails.
- INDETERMINATE: no invariant fails, but at least one required state remains unresolved.

A profile result is a conformance/evaluation result, not a legal conclusion, fact determination, or action authorization.
