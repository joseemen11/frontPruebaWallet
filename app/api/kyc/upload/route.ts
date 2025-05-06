// app/api/kyc/upload/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: { bodyParser: false }, // deshabilita el parser integrado
};

export async function POST(request: Request) {
 
  const formData = await request.formData();

  
  const uploadDir = path.join(process.cwd(), 'public', 'tmp');
  await fs.mkdir(uploadDir, { recursive: true });

 
  for (const field of ['front', 'back', 'selfie']) {
    const fileField = formData.get(field);
    if (fileField instanceof File) {
      const buffer = Buffer.from(await fileField.arrayBuffer());

      const filename = `${Date.now()}-${fileField.name}`;
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
    }
  }

  // 4. Simula la respuesta de IDAnalyzer
  return NextResponse.json({ offer_url: '/api/credentialOffer' });
}
// crear una funcionn donde otro usuario pueda consultar tu edad y tú le des permiso
// consultas cruzadas entre contratos, quién ha votado(quien contrato identidad digital) y por quién (contrato app electoral)?