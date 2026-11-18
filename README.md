# TMO Validation

Root workspace for the TMO Core, schema contracts, and independently versioned application profiles.

## Workspace layout

- `packages/core` - `@tmo/core`
- `packages/le` - `@tmo/le-profile`
- `packages/ca` - `@tmo/ca-profile`
- `packages/ed` - `@tmo/ed-profile`

## Quality

`npm run quality` dispatches each workspace's own quality gate when present.
