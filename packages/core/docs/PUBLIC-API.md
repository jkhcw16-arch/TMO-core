# TMO Core 1.0.0 Public API Contract

The contract is enforced by `contracts/public-api.json` and `tests/api-contract.test.mjs`. Removing or renaming a contracted export, changing the core/schema version unexpectedly, or violating the tested semantics fails the default test suite.

Contract semantics cover TMO-103 unknown-state preservation, TMO-104 origin-derived independence, TMO-105 provenance bounds, TMO-106 temporal precision monotonicity, TMO-107 independent relationship channels, and versioned evaluation envelopes.

## Temporal aggregation contract
`TemporalEntity.form` is independent from `TemporalEntity.precision`. `INTERVAL` is a form, not a precision rank. For a derivation depending on multiple required temporal inputs, output precision MUST NOT exceed the least precise required input.

## Compile-time contract
`contract-tests/public-api.compile.ts` imports the public TypeScript surface as a consumer and asserts accepted and rejected shapes. Negative type assertions use `@ts-expect-error`; if a forbidden shape becomes accepted, compilation fails because the directive becomes unused.
