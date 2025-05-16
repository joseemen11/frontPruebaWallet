"use client";

import { useState } from "react";
import axios from "axios";
import { Wallet } from "@ethersproject/wallet";
const mockResponse = {
  data: {
    did: "did:polygonid:polygon:amoy:2qT4gyu9uGUt5HQRtATQZ91cFqvsRT1uq7HzmGLbCY",
    offerUrl:
      "https://wallet.privado.id#request_uri=https%3A%2F%2Fdbackbilletera.blockchainconsultora.com%3A3100%2Fv2%2Fqr-store%3Fid%3D35b1468e-78c6-4a49-ac35-2f050284a71f",
    credentialData: {
      id: "e4f9904d-3104-11f0-99f7-caadbe619ef5",
      proofTypes: ["BJJSignature2021", "Iden3SparseMerkleTreeProof"],
      revoked: false,
      schemaHash: "7ed2bce3d6fab6efe706a7e76a0881dd",
      vc: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld",
          "ipfs://QmZbsTnRwtCmbdg3r9o7Txid37LmvPcvmzVi1Abvqu1WKL",
        ],
        credentialSchema: {
          id: "ipfs://QmTojMfyzxehCJVw7aUrdWuxdF68R7oLYooGHCUr9wwsef",
          type: "JsonSchema2023",
        },
        credentialStatus: {
          id: "https://dbackbilletera.blockchainconsultora.com:3100/v2/agent",
          revocationNonce: 2657144900,
          type: "Iden3commRevocationStatusV1.0",
        },
        credentialSubject: {
          dateOfBirth: 929059200,
          documentExpirationDate: 1886889600,
          familyName: "AREVALO FERRUFINO",
          firstName: "JUAN CARLOS",
          fullName: "JUAN CARLOS AREVALO FERRUFINO",
          governmentIdentifier: "8673548",
          governmentIdentifierType: "national id document",
          id: "did:polygonid:polygon:amoy:2qT4gyu9uGUt5HQRtATQZ91cFqvsRT1uq7HzmGLbCY",
          type: "BasicPerson",
        },
        id: "urn:uuid:e4f9904d-3104-11f0-99f7-caadbe619ef5",
        issuanceDate: "2025-05-14T20:49:13.968053388Z",
        issuer:
          "did:polygonid:polygon:amoy:2qQyrRByM5TDiZzssZZ3UCKo9Lc1q8jLTx9PPyAE1H",
        proof: [
          {
            coreClaim:
              "7ed2bce3d6fab6efe706a7e76a0881dd2200000000000000000000000000000002134189bbb7fe0c11a3ba45ee3fad15d3b36e12e630cb1ce0f26b1122700d00b612a076dfa1cae27b637a9d019d35da6d05955db2bf2c29997f5daeb495cd25000000000000000000000000000000000000000000000000000000000000000044d0609e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            issuerData: {
              authCoreClaim:
                "cca3371a6cb1b715004407e325bd993c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000816bf6c9c74c3eef80c0769278389aa213ad03b6cfa65ee7f4f1537ca65d9323495de9ffdd09eacffefa088a7460b52431d308b4f4ceb3facc5993d3064b90120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
              credentialStatus: {
                id: "http://localhost:3001/v2/agent",
                revocationNonce: 0,
                type: "Iden3commRevocationStatusV1.0",
              },
              id: "did:polygonid:polygon:amoy:2qQyrRByM5TDiZzssZZ3UCKo9Lc1q8jLTx9PPyAE1H",
              mtp: {
                existence: true,
                siblings: [],
              },
              state: {
                claimsTreeRoot:
                  "4286dba188a6842c4e2218364b959fa5cd1ea91ad11d97b376544c47f278812b",
                value:
                  "07fb61c47e13a524bc7709e4d71a7ecb9cf1b07ce84e52f2521b165183350721",
              },
            },
            signature:
              "60a65cbd338cc3c746e5536b78e6c3a6d37642247e3930e684cd5a2c1f15358e6d300a34ece6e0765de3ccfb5ece3175b6edd9d3af99eb315fc7d09843a4a004",
            type: "BJJSignature2021",
          },
        ],
        type: ["VerifiableCredential", "BasicPerson"],
      },
    },
  },
  message: "Verification created successfully",
};

const DEV_PRIVATE_KEY =
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

export default function Register() {
  const { did, credentialData } = mockResponse.data;
  const [streamId, setStreamId] = useState<string>();
  const [msg, setMsg] = useState<string>("Listo para guardar en Ceramic");

  async function handleSaveCeramic() {
    try {
      setMsg("Firmando mensaje para Lit...");

      const signer = new Wallet(DEV_PRIVATE_KEY);

      const message = `Lit Authentication\nTimestamp: ${Date.now()}`;

      const sig = await signer.signMessage(message);
      const address = await signer.getAddress();

      const authSig = {
        sig,
        signedMessage: message,
        derivedVia: "web3.personal_sign",
        address,
      };

      setMsg("Enviando VC + authSig al backend…");
      // 4️⃣ Llamamos a tu NestJS + Lit + Ceramic
      const res = await axios.post("http://localhost:3001/kyc/store", {
        vc: credentialData.vc,
        authSig,
      });

      setStreamId(res.data.streamId);
      setMsg("✅ Stream ID recibido. ¡VC guardada en Ceramic!");
    } catch (e: any) {
      console.error(e);
      setMsg("❌ Error: " + e.message);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Simulación KYC + Lit/Ceramic</h1>

      <div>
        <p>
          <strong>DID:</strong> {did}
        </p>
      </div>

      <div>
        <h2 className="font-semibold">Verifiable Credential (VC)</h2>
        <pre className="p-2 bg-gray-100 rounded text-sm overflow-auto">
          {JSON.stringify(credentialData.vc, null, 2)}
        </pre>
      </div>

      <button
        onClick={handleSaveCeramic}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Guardar en Ceramic
      </button>

      {msg && <p className="mt-4">{msg}</p>}

      {streamId && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p>
            <strong>Stream ID:</strong> {streamId}
          </p>
          <p>Consultar con Postman:</p>
          <code className="block break-all">
            GET https://gateway-clay.ceramic.network/api/v0/streams/{streamId}
          </code>
        </div>
      )}
    </main>
  );
}
