import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();

      console.error("Google Sheets error:", response.status, detail);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data Google Sheets.",
        },
        { status: 500 },
      );
    }

    const csv = await response.text();

    const parsed = Papa.parse<Record<string, string>>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      transform: (value) => value.trim(),
    });

    if (parsed.errors.length > 0) {
      console.error("CSV parsing errors:", parsed.errors);

      return NextResponse.json(
        {
          success: false,
          message: "Format CSV tidak valid.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: parsed.data,
    });
  } catch (error) {
    console.error("API Google Sheets error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data.",
      },
      { status: 500 },
    );
  }
}
