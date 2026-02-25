/**
 * API Route: POST /api/register-entry
 * Called when a user lands on the success page after payment.
 * We pass the Stripe session_id so we only count each payment once (no double count on refresh).
 * Uses Upstash Redis: SADD "entered_sessions" session_id, and if it's new, INCR "entered_count".
 */

import { NextResponse } from "next/server";

const SESSIONS_KEY = "entered_sessions";
const COUNT_KEY = "entered_count";

async function registerEntry(sessionId) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { count: 0, ok: false };

  // Add this session_id to the set. SADD returns the number of members added (1 if new).
  // Upstash REST format: REST_URL/sadd/key/member (member in URL path).
  const addRes = await fetch(`${url}/sadd/${SESSIONS_KEY}/${encodeURIComponent(sessionId)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const addData = await addRes.json();
  if (addData.error) {
    console.error("Upstash SADD error:", addData.error);
    return { count: 0, ok: false };
  }
  const added = addData.result === 1;

  if (!added) {
    // Already counted (e.g. user refreshed success page). Return current count.
    const getRes = await fetch(`${url}/get/${COUNT_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    const count = getData.result !== null ? parseInt(getData.result, 10) : 0;
    return { count, ok: true };
  }

  // New entry: increment count. INCR returns the new value.
  const incrRes = await fetch(`${url}/incr/${COUNT_KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const incrData = await incrRes.json();
  const count = typeof incrData.result === "number" ? incrData.result : parseInt(incrData.result, 10) || 1;
  return { count, ok: true };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sessionId = body?.session_id;
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "session_id required" }, { status: 400 });
    }
    const result = await registerEntry(sessionId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Register entry error:", err);
    return NextResponse.json({ count: 0, ok: false }, { status: 500 });
  }
}
