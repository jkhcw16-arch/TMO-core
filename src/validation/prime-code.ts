// prime-code.ts
// TMO validation core

export type Vector = readonly number[];
export type Matrix = readonly (readonly number[])[];

export interface TMOState {
  readonly points: readonly Vector[];
  readonly anchor: Vector;
  readonly lambda: number;
  readonly time: number;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

const EPSILON = 1e-9;

// -----------------------------------------------------------------------------
// Basic utilities
// -----------------------------------------------------------------------------

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

function validVector(vector: Vector): boolean {
  return (
    vector.length > 0 &&
    vector.every(isFiniteNumber)
  );
}

function sameDimension(
  vectors: readonly Vector[]
): boolean {
  if (vectors.length === 0) {
    return false;
  }

  const dimension = vectors[0]!.length;

  if (dimension === 0) {
    return false;
  }

  return vectors.every(
    vector =>
      vector.length === dimension &&
      validVector(vector)
  );
}

function distance(
  a: Vector,
  b: Vector
): number {
  if (a.length !== b.length) {
    throw new Error(
      `Dimension mismatch: ${a.length} !== ${b.length}`
    );
  }

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    const delta = a[i]! - b[i]!;
    sum += delta * delta;
  }

  return Math.sqrt(sum);
}

function result(
  errors: string[]
): ValidationResult {
  return {
    valid: errors.length === 0,
    errors,
  };
}

// -----------------------------------------------------------------------------
// State validation
// -----------------------------------------------------------------------------

export function validateState(
  state: TMOState
): ValidationResult {
  const errors: string[] = [];

  if (state.points.length === 0) {
    errors.push(
      "TMO state must contain at least one point."
    );

    return result(errors);
  }

  if (!sameDimension(state.points)) {
    errors.push(
      "All points must contain finite coordinates and share one dimension."
    );

    return result(errors);
  }

  const dimension = state.points[0]!.length;

  if (!validVector(state.anchor)) {
    errors.push(
      "Anchor must be a non-empty finite vector."
    );
  } else if (state.anchor.length !== dimension) {
    errors.push(
      "Anchor dimension must match point dimension."
    );
  }

  if (!isFiniteNumber(state.lambda)) {
    errors.push("Lambda must be finite.");
  }

  if (
    !Number.isSafeInteger(state.time) ||
    state.time < 0
  ) {
    errors.push(
      "Time must be a non-negative safe integer."
    );
  }

  return result(errors);
}

// -----------------------------------------------------------------------------
// Triangle validation
// -----------------------------------------------------------------------------

export function validateTriangle(
  triangle: readonly Vector[]
): ValidationResult {
  const errors: string[] = [];

  if (triangle.length !== 3) {
    errors.push(
      "A TMO triangle must contain exactly three vertices."
    );

    return result(errors);
  }

  if (!sameDimension(triangle)) {
    errors.push(
      "Triangle vertices must be finite and have equal dimensions."
    );

    return result(errors);
  }

  const a = triangle[0]!;
  const b = triangle[1]!;
  const c = triangle[2]!;

  const ab = distance(a, b);
  const bc = distance(b, c);
  const ca = distance(c, a);

  if (
    ab <= EPSILON ||
    bc <= EPSILON ||
    ca <= EPSILON
  ) {
    errors.push(
      "Triangle vertices must be distinct."
    );

    return result(errors);
  }

  // General metric-space degeneracy test.
  if (
    ab + bc <= ca + EPSILON ||
    bc + ca <= ab + EPSILON ||
    ca + ab <= bc + EPSILON
  ) {
    errors.push(
      "Triangle is degenerate."
    );
  }

  return result(errors);
}

// -----------------------------------------------------------------------------
// Paired invariant triangles
// -----------------------------------------------------------------------------

export function validatePairedTriangles(
  first: readonly Vector[],
  second: readonly Vector[],
  tolerance = 1e-6
): ValidationResult {
  const errors: string[] = [];

  if (
    !Number.isFinite(tolerance) ||
    tolerance < 0
  ) {
    return result([
      "Tolerance must be a finite non-negative number.",
    ]);
  }

  const firstValidation =
    validateTriangle(first);

  const secondValidation =
    validateTriangle(second);

  errors.push(...firstValidation.errors);
  errors.push(...secondValidation.errors);

  if (errors.length > 0) {
    return result(errors);
  }

  const firstEdges = [
    distance(first[0]!, first[1]!),
    distance(first[1]!, first[2]!),
    distance(first[2]!, first[0]!),
  ];

  const secondEdges = [
    distance(second[0]!, second[1]!),
    distance(second[1]!, second[2]!),
    distance(second[2]!, second[0]!),
  ];

  const scale =
    secondEdges[0]! / firstEdges[0]!;

  for (let i = 1; i < 3; i++) {
    const edgeScale =
      secondEdges[i]! / firstEdges[i]!;

    if (
      Math.abs(edgeScale - scale) >
      tolerance
    ) {
      errors.push(
        "Paired triangles do not preserve uniform edge scaling."
      );

      break;
    }
  }

  return result(errors);
}

// -----------------------------------------------------------------------------
// Rotation validation
// -----------------------------------------------------------------------------

export function validateRotation(
  matrix: Matrix,
  tolerance = 1e-6
): ValidationResult {
  const errors: string[] = [];

  if (
    !Number.isFinite(tolerance) ||
    tolerance < 0
  ) {
    return result([
      "Tolerance must be a finite non-negative number.",
    ]);
  }

  const n = matrix.length;

  if (n === 0) {
    return result([
      "Rotation matrix cannot be empty.",
    ]);
  }

  if (
    matrix.some(
      row =>
        row.length !== n ||
        !row.every(isFiniteNumber)
    )
  ) {
    return result([
      "Rotation matrix must be square and finite.",
    ]);
  }

  // Test orthogonality: R^T R = I.
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let dot = 0;

      for (let k = 0; k < n; k++) {
        dot +=
          matrix[k]![i]! *
          matrix[k]![j]!;
      }

      const expected =
        i === j ? 1 : 0;

      if (
        Math.abs(dot - expected) >
        tolerance
      ) {
        return result([
          "Rotation matrix is not orthogonal.",
        ]);
      }
    }
  }

  // A true rotation must have determinant +1.
  const det = determinant(matrix);

  if (Math.abs(det - 1) > tolerance) {
    errors.push(
      "Rotation matrix must have determinant +1."
    );
  }

  return result(errors);
}

// -----------------------------------------------------------------------------
// Determinant
// -----------------------------------------------------------------------------

function determinant(
  matrix: Matrix
): number {
  const n = matrix.length;

  if (n === 1) {
    return matrix[0]![0]!;
  }

  if (n === 2) {
    return (
      matrix[0]![0]! * matrix[1]![1]! -
      matrix[0]![1]! * matrix[1]![0]!
    );
  }

  let det = 0;

  for (let column = 0; column < n; column++) {
    const minor: number[][] = [];

    for (let row = 1; row < n; row++) {
      const minorRow: number[] = [];

      for (let col = 0; col < n; col++) {
        if (col !== column) {
          minorRow.push(
            matrix[row]![col]!
          );
        }
      }

      minor.push(minorRow);
    }

    const sign =
      column % 2 === 0 ? 1 : -1;

    det +=
      sign *
      matrix[0]![column]! *
      determinant(minor);
  }

  return det;
}

// -----------------------------------------------------------------------------
// Temporal transition validation
// -----------------------------------------------------------------------------

export function validateTransition(
  previous: TMOState,
  next: TMOState
): ValidationResult {
  const errors: string[] = [];

  const previousValidation =
    validateState(previous);

  const nextValidation =
    validateState(next);

  if (!previousValidation.valid) {
    errors.push(
      ...previousValidation.errors.map(
        error => `Previous state: ${error}`
      )
    );
  }

  if (!nextValidation.valid) {
    errors.push(
      ...nextValidation.errors.map(
        error => `Next state: ${error}`
      )
    );
  }

  if (errors.length > 0) {
    return result(errors);
  }

  if (next.time !== previous.time + 1) {
    errors.push(
      `Expected time ${previous.time + 1}, received ${next.time}.`
    );
  }

  if (
    previous.points.length !==
    next.points.length
  ) {
    errors.push(
      "Point count changed across the temporal transition."
    );
  }

  if (
    previous.anchor.length !==
    next.anchor.length
  ) {
    errors.push(
      "Anchor dimension changed across the temporal transition."
    );
  }

  return result(errors);
}

// -----------------------------------------------------------------------------
// Lambda validation
// -----------------------------------------------------------------------------

export function validateLambda(
  lambda: number,
  criticalLambda: number
): ValidationResult {
  const errors: string[] = [];

  if (!Number.isFinite(lambda)) {
    errors.push("Lambda must be finite.");
  }

  if (
    !Number.isFinite(criticalLambda) ||
    criticalLambda < 0
  ) {
    errors.push(
      "Critical lambda must be finite and non-negative."
    );
  }

  return result(errors);
}

export function crossesLambdaThreshold(
  lambda: number,
  criticalLambda: number
): boolean {
  const validation =
    validateLambda(
      lambda,
      criticalLambda
    );

  if (!validation.valid) {
    throw new Error(
      validation.errors.join(" ")
    );
  }

  return lambda >= criticalLambda;
}

// -----------------------------------------------------------------------------
// CI assertion
// -----------------------------------------------------------------------------

export function assertValid(
  validation: ValidationResult
): asserts validation is ValidationResult & {
  readonly valid: true;
} {
  if (!validation.valid) {
    throw new Error(
      [
        "TMO validation failed.",
        ...validation.errors.map(
          error => `- ${error}`
        ),
      ].join("\n")
    );
  }
}
