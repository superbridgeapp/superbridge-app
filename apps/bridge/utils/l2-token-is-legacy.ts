import { match } from "ts-pattern";

/**
 * Legacy means we should use withdrawTo (vs bridgeERC20To)
 *
 * if mintable, we just use the legacy method
 * if a native token and using the default bridge, we _need_ to use bridgeERC20To
 * if it's a native token (or looks like one, like DAI), we use the legacy method
 */
export const l2TokenIsLegacy = (args: {
  l2Bridge: boolean;
  l1Token: boolean;

  isDefaultBridge: boolean;
}) =>
  match(args)
    // looks like mintable, old or new
    .with({ l2Bridge: true, l1Token: true }, () => true)
    // looks like a native token
    .with({ isDefaultBridge: true }, () => false)
    // something like dai
    .with({ isDefaultBridge: false }, () => true)
    .exhaustive();
