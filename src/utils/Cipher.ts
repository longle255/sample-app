import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

exports.encryptWithPublicKey = (toEncrypt: string): string => {
  const absolutePath = path.resolve(__dirname, '..', 'assets/keys/wallet.pub');
  const publicKey = fs.readFileSync(absolutePath, 'utf8');
  const buffer = Buffer.from(toEncrypt);
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

exports.decryptWithPrivateKey = (toDecrypt: string, privateKey: string, passkey: string | null): string => {
  const buffer = Buffer.from(toDecrypt, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: passkey,
    },
    buffer,
  );
  return decrypted.toString('utf8');
};
