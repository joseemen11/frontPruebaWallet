'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    // 1) Subir imágenes y recibir offer_url
    const { data } = await axios.post('/api/kyc/upload', fd);
    const vc = await (await fetch(data.offer_url)).json();
    // 2) Pedir PIN y cifrar VC
    const pin = prompt('Define un PIN (>=6 dígitos)') || '';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv   = crypto.getRandomValues(new Uint8Array(12));
    const keyMat = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      { name:'PBKDF2', salt, iterations:100_000, hash:'SHA-256' },
      keyMat, { name:'AES-GCM', length:256 }, false, ['encrypt']
    );
    const enc = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(vc)));
    // 3) Guardar en localStorage
    localStorage.setItem('vc_cipher', btoa(String.fromCharCode(...new Uint8Array(enc))));
    localStorage.setItem('vc_salt',   btoa(String.fromCharCode(...salt)));
    localStorage.setItem('vc_iv',     btoa(String.fromCharCode(...iv)));
    setMsg('¡Registro completo! Redirigiendo a login…');
    setTimeout(()=>router.push('/login'), 1000);
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Registro KYC (demo)</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {['front','back','selfie'].map((name) => (
          <input key={name} type="file" name={name} required className="block w-full p-2 border rounded" />
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Enviar</button>
      </form>
      {msg && <p className="mt-4 text-green-600">{msg}</p>}
    </main>
  );
}
