import { google, sheets_v4 as SheetV4 } from "googleapis";

export class SpreadsheetClient {
  constructor(private client: SheetV4.Sheets) {}

  static async build() {
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const client = google.sheets({ version: "v4", auth });
    return new SpreadsheetClient(client);
  }

  async getValues(sheetId: string, range = "A2:B"): Promise<SearchItem[]> {
    const res = await this.client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });
    return (
      res.data.values?.map((value: string[]) => ({
        word: value[0] as string,
        description: value[1] as string,
      })) || []
    );
  }

  async setValues(sheetId: string, values: SearchItem) {
    const targetRow = (await this.getLastRow(sheetId)) + 1;

    return await this.client.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `A${targetRow}:B${targetRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[values.word, values.description]],
      },
    });
  }

  private async getLastRow(sheetId: string) {
    const res = await this.client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A2:B",
    });
    return res.data.values?.length || 0;
  }
}
