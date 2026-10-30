import { NextResponse } from "next/server";
import { verifyEvent } from "@/lib/db";

export async function POST(req, { params }) {
  const { id } = await params;
  const { scout } = await req.json();
  if (!scout?.trim()) return NextResponse.json({ error: "Enter your scout name." }, { status: 400 });
  const result = await verifyEvent(id, scout);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ verifications: result.event.verifications });
}
