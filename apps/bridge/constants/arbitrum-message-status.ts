export enum ArbitrumMessageStatus {
  /**
   * ArbSys.sendTxToL1 called, but assertion not yet confirmed
   */
  UNCONFIRMED = 0,
  /**
   * Assertion for outgoing message confirmed, but message not yet executed
   */
  CONFIRMED = 1,
  /**
   * Outgoing message executed (terminal state)
   */
  EXECUTED = 2,
}
