import type { FailureCode } from "../validation/result";

import type {
  CoreAuditRef,
  CoreEvaluationId,
  CoreOutputEnvelope,
} from "../core/contract";

export type DomainStatus =
  | "VALID"
  | "INVALID"
  | "INDETERMINATE";

export type DomainGuardResult<
  G extends string,
  F extends string,
> =
  | {
      readonly guard: G;
      readonly status: "VALID";
    }
  | {
      readonly guard: G;
      readonly status: "INVALID";
      readonly failure: F;
      readonly details?: string;
    }
  | {
      readonly guard: G;
      readonly status: "INDETERMINATE";
      readonly failure: F;
      readonly details?: string;
    };

export interface DomainProfileContext<C> {
  readonly core: Readonly<CoreOutputEnvelope>;
  readonly domain: Readonly<C>;
}

interface DomainResultBase<
  I extends string,
  V extends string,
  G extends string,
  F extends string,
> {
  readonly profile: I;
  readonly version: V;

  readonly coreEvaluationId: CoreEvaluationId;
  readonly coreAuditRef: CoreAuditRef;

  readonly guards:
    readonly DomainGuardResult<G, F>[];

  readonly failures: readonly F[];

  readonly evidenceFailures:
    readonly FailureCode[];

  readonly limitations:
    readonly string[];
}

export type DomainProfileResult<
  I extends string,
  V extends string,
  G extends string,
  F extends string,
  ValidDisposition extends string,
  HoldDisposition extends string,
  RejectDisposition extends string,
> =
  | (
      DomainResultBase<I, V, G, F> & {
        readonly status: "VALID";
        readonly disposition: ValidDisposition;
        readonly failures: readonly [];
      }
    )
  | (
      DomainResultBase<I, V, G, F> & {
        readonly status: "INDETERMINATE";
        readonly disposition: HoldDisposition;
      }
    )
  | (
      DomainResultBase<I, V, G, F> & {
        readonly status: "INVALID";
        readonly disposition: RejectDisposition;
      }
    );

export interface DomainProfile<
  I extends string,
  V extends string,
  C,
  R,
> {
  readonly id: I;
  readonly version: V;

  validate(
    context: DomainProfileContext<C>,
  ): R;
}

export interface ProfileCompatibility<
  I extends string,
  V extends string,
> {
  readonly profileId: I;
  readonly profileVersion: V;

  readonly supportedCoreContracts:
    readonly string[];
}
