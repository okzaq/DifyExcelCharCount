/**
 * fileParser.ts
 * ファイル読み込み・ワークブック変換の責務を担う
 */
import * as XLSX from 'xlsx';

/**
 * File オブジェクトを ArrayBuffer 経由で XLSX.WorkBook に変換する
 * @throws {Error} 読み込み失敗時
 */
export async function fileToWorkbook(file: File): Promise<XLSX.WorkBook> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, {
    type: 'array',
    cellText: true,   // セルテキスト形式を利用
    cellDates: true,  // 日付セルを Date オブジェクトに変換
  });
  return workbook;
}

/**
 * ワークブックに含まれるシート名の一覧を返す
 */
export function getSheetNames(workbook: XLSX.WorkBook): string[] {
  return workbook.SheetNames;
}
