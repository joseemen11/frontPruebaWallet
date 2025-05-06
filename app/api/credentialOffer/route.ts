import { NextResponse } from 'next/server';

export async function GET() {
  // Credencial simulada
  const vc = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential", "IdentityCredential"],
    issuer: "did:example:issuer",
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: "did:example:holder",
      firstName: "Juan",
      lastName: "Pérez",
      docNumber: "ABC123456"
    },
    proof: { type: "NoProofForDemo" }
  };
  return NextResponse.json(vc);
}
