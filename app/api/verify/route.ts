
import { NextResponse } from "next/server";
import * as snarkjs from "snarkjs";
import vKey from "../../../public/verification_key.json";

export async function POST(request: Request) {
  console.log("🔔 /api/verify POST recibido");
  const { proof, publicSignals } = await request.json();
 
  console.time("zk-verify");
  const ok = await snarkjs.groth16.verify(vKey, publicSignals, proof);
  console.timeEnd("zk-verify"); 
  console.log("✅ zk verify result:", ok);
  return NextResponse.json({ ok });
}
