/**
 * sheetUtils.ts
 * シートからのデータ抽出・ヘッダー解釈の責務を担う
 *
 * 設計方針:
 * - sheet_to_json に header:1 オプションを渡し、生の2次元配列を取得する
 * - これにより Object.keys() 依存によるヘッダー順序崩れを防ぐ
 * - 各セルは cellText を元に文字列化（Excelの表示値に近い形）
 */
import * as XLSX from 'xlsx';
import type { SheetData } from '../types';

/** セル値を文字列に変換する（null/undefined は空文字） */
function cellValueToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) {
    // 日付は YYYY/MM/DD HH:mm 形式に
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, '0');
    const dd = String(value.getDate()).padStart(2, '0');
    const hh = String(value.getHours()).padStart(2, '0');
    const mi = String(value.getMinutes()).padStart(2, '0');
    // 時刻部分がゼロなら日付のみ
    if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0) {
      return `${yyyy}/${mm}/${dd}`;
    }
    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
  }
  if (typeof value === 'number') {
    // 整数は整数表示、小数は最大10桁まで
    return Number.isInteger(value) ? String(value) : value.toPrecision(10).replace(/\.?0+$/, '');
  }
  return String(value);
}

/**
 * 指定シートから SheetData を抽出する
 * @param workbook XLSX.WorkBook
 * @param sheetName 対象シート名
 * @returns SheetData
 * @throws {Error} シートが存在しない、またはヘッダー行がない場合
 */
export function extractSheetData(
  workbook: XLSX.WorkBook,
  sheetName: string
): SheetData {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`シート "${sheetName}" が見つかりません`);
  }

  // header:1 で生の2次元配列を取得（ヘッダー順序を確実に保持）
  const raw: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false, // テキスト変換を優先
  });

  if (raw.length === 0) {
    throw new Error('シートにデータがありません（ヘッダー行も含む）');
  }

  // 1行目をヘッダーとして解釈
  const headerRow = raw[0];
  if (!headerRow || headerRow.length === 0) {
    throw new Error('ヘッダー行が空です');
  }

  // ヘッダーを文字列化（重複ヘッダーには連番を付与して区別）
  const headerCounts = new Map<string, number>();
  const headers: string[] = headerRow.map((cell) => {
    const base = cellValueToString(cell).trim();
    if (!base) return '(空)';
    const count = headerCounts.get(base) ?? 0;
    headerCounts.set(base, count + 1);
    return count === 0 ? base : `${base}_${count}`;
  });

  // 2行目以降をデータ行として変換
  const rows: Record<string, string>[] = raw.slice(1).map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      const cell = row[i] !== undefined ? row[i] : '';
      record[header] = cellValueToString(cell);
    });
    return record;
  });

  return { headers, rows };
}
