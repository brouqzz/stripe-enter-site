/**
 * API Route: GET /api/count
 * Returns the number of people who have completed payment (entered).
 * The count is stored in Upstash Redis. If Redis is not configured, returns 0.
 */

import { NextResponse } from "next/server";

const COUNT_KEY = "entered_count";

async function getCount() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return 0;

  const res = await fetch(`${url}/get/${COUNT_KEY}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.result === null) return 0;
  return parseInt(data.result, 10) || 0;
}

export async function GET() {
  try {
    const count = await getCount();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Count error:", err);
    return NextResponse.json({ count: 0 });
  }
}
