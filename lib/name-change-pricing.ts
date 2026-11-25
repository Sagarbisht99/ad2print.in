/**
 * Name-change wording pricing.
 *
 * A package covers a fixed number of printed lines (5 by default). Every line
 * beyond that adds the package's extra-line rate — even when the extra line
 * holds just one word. When a package has no stored rate, the default is 20%
 * of the base rate. The same helper runs in the client preview and in the
 * server that creates the Razorpay order so both agree on the amount.
 *
 * Kept free of data/JSON imports so the same maths runs on the client preview
 * and on the server that creates the Razorpay order.
 */

import { countTextLines, wrapTextLines } from "@/lib/text-lines";

export const NAME_CHANGE_DEFAULT_BASE_LINES = 5;
/** Default extra-line rate when a package has no stored rate: 20% of base. */
export const NAME_CHANGE_DEFAULT_EXTRA_LINE_PERCENT = 0.2;
/** Characters in one preview/ad line — shared by the preview and pricing. */
export const NAME_CHANGE_CHARS_PER_LINE = 28;

export type NameChangeLineQuote = {
  /** Package rate for up to `includedLines`, in rupees. */
  baseRate: number;
  /** Printed lines counted from the ad matter. */
  lines: number;
  /** Lines included in the package rate. */
  includedLines: number;
  /** Lines beyond the included amount. */
  extraLines: number;
  /** Charge for one extra line, in rupees. */
  extraLineRate: number;
  /** Total extra-line charge, in rupees. */
  extraLineAmount: number;
  /** Base rate + extra-line charge, in rupees. */
  rate: number;
};

export function countNameChangeLines(
  text: string,
  charsPerLine = NAME_CHANGE_CHARS_PER_LINE,
): number {
  return countTextLines(text, charsPerLine);
}

export function wrapNameChangeLines(
  text: string,
  charsPerLine = NAME_CHANGE_CHARS_PER_LINE,
): string[] {
  return wrapTextLines(text, charsPerLine);
}

export function calculateNameChangeLineQuote(
  baseRate: number,
  text: string,
  options: { baseLines?: number; extraLineRate?: number; charsPerLine?: number } = {},
): NameChangeLineQuote {
  const safeBase = Math.max(0, Math.round(baseRate));
  const includedLines = Math.max(
    1,
    Math.round(options.baseLines ?? NAME_CHANGE_DEFAULT_BASE_LINES),
  );
  const extraLineRate =
    options.extraLineRate != null && Number.isFinite(options.extraLineRate)
      ? Math.max(0, Math.round(options.extraLineRate))
      : Math.round(safeBase * NAME_CHANGE_DEFAULT_EXTRA_LINE_PERCENT);

  const lines = countNameChangeLines(
    text,
    options.charsPerLine ?? NAME_CHANGE_CHARS_PER_LINE,
  );
  const extraLines = Math.max(0, lines - includedLines);
  const extraLineAmount = extraLines * extraLineRate;

  return {
    baseRate: safeBase,
    lines,
    includedLines,
    extraLines,
    extraLineRate,
    extraLineAmount,
    rate: safeBase + extraLineAmount,
  };
}
