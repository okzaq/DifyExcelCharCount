/**
 * thresholdFilter.ts
 * 閾値フィルタリングの純関数
 */
import type { RowAnalysis } from '../types';

/**
 * 閾値を超える行を返す
 * @param analyses 全行の分析結果
 * @param threshold 閾値（この値を超えた行を対象とする）
 */
export function filterByThreshold(
  analyses: RowAnalysis[],
  threshold: number
): RowAnalysis[] {
  return analyses.filter((r) => r.charCount > threshold);
}

/**
 * 文字数降順でソートし上位 N 件を返す
 * @param analyses 全行の分析結果
 * @param topN 上位件数
 */
export function getTopRows(analyses: RowAnalysis[], topN: number): RowAnalysis[] {
  return [...analyses]
    .sort((a, b) => b.charCount - a.charCount)
    .slice(0, topN);
}
