/**
 * rowStringBuilder.ts
 * 行文字列（header:value;... 形式）の生成ロジックを担う
 */
import type { SheetData, RowAnalysis, RowStringOptions } from '../types';

/**
 * 1行分のデータを "header:value;..." 形式の文字列に変換する
 * 純関数（副作用なし）
 */
export function buildRowString(
  headers: string[],
  row: Record<string, string>,
  options: RowStringOptions
): string {
  const { excludedHeaders, skipEmpty, trim } = options;

  const parts = headers
    .filter((h) => !excludedHeaders.has(h))
    .map((h) => {
      const raw = row[h] ?? '';
      // 改行文字を空白に正規化（セル内改行への対応）
      const value = (trim ? raw.trim() : raw).replace(/[\r\n]+/g, ' ');
      return { header: h, value };
    })
    .filter(({ value }) => !(skipEmpty && value === ''))
    .map(({ header, value }) => `${header}:${value}`);

  return parts.join(';');
}

/**
 * SheetData 全行の RowAnalysis 配列を返す
 * 集計は全行対象で実施する（表示件数の上限は呼び出し側で制御）
 */
export function analyzeRows(
  sheetData: SheetData,
  options: RowStringOptions
): RowAnalysis[] {
  return sheetData.rows.map((row, i) => {
    const rowString = buildRowString(sheetData.headers, row, options);
    return {
      rowIndex: i + 1, // データ行の1始まり番号
      rowString,
      charCount: rowString.length,
    };
  });
}
