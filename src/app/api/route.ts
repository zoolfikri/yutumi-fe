import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ product: "tes" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(body);
}
