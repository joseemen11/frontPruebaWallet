'use client';
import { useState } from 'react';

import { useSmartWallet } from '@/hooks/useSmartWallet';
import { keccak256, toUtf8Bytes } from 'ethers';

export default function Login() {
  const [vc, setVc] = useState<any>(null);
  const contract = useSmartWallet();

  async function onUnlock() {
    const pin = prompt('Ingresa tu PIN') || '';
    const salt = Uint8Array.from(atob(localStorage.getItem('vc_salt')!), c=>c.charCodeAt(0));
    const iv   = Uint8Array.from(atob(localStorage.getItem('vc_iv')!),   c=>c.charCodeAt(0));
    const cipher = Uint8Array.from(atob(localStorage.getItem('vc_cipher')!), c=>c.charCodeAt(0));

    const keyMat = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name:'PBKDF2', salt, iterations:100_000, hash:'SHA-256' },
      keyMat, { name:'AES-GCM', length:256 }, false, ['decrypt']
    );
    const plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv }, key, cipher);
    const decrypted = JSON.parse(new TextDecoder().decode(plain));
    setVc(decrypted);

    // 3) Llamar al contrato con el hash
    if (contract) {
      const hash = keccak256(toUtf8Bytes(JSON.stringify(decrypted)));
      await contract.storeCredential(hash);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login SSI</h1>
      <button onClick={onUnlock} className="w-full bg-green-600 text-white py-2 rounded">
        Desbloquear y Anclar VC
      </button>
      {vc && (
        <div className="mt-6 p-4 border rounded">
          <p><strong>Nombre:</strong> {vc.credentialSubject.firstName}</p>
          <p><strong>Apellido:</strong> {vc.credentialSubject.lastName}</p>
          <p><strong>Doc #:</strong> {vc.credentialSubject.docNumber}</p>
        </div>
      )}
    </main>
  );
}
