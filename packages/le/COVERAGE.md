# Coverage policy

The TMO-LE v1.0.0 quality gate uses Node's built-in test coverage for compiled `dist/*.js` files.

Minimum global thresholds:
- Lines: 95%
- Branches: 85%
- Functions: 85%

`npm test` runs deterministic, property, and domain mutation tests, then runs the coverage gate. `npm run quality` additionally performs TypeScript type checking first.
