import { totp, generateSecret } from 'speakeasy';
import { GeneratedSecret } from 'speakeasy';
import QRCode from 'qrcode';

export function verify2FAToken(token: string, secret: string): boolean {
  return totp.verify({ secret, token, encoding: 'base32' });
}

export function generateQR(qrUrl: string): Promise<string> {
  return QRCode.toDataURL(qrUrl);
}

export function generate2FAToken(name: string, issuer: string): GeneratedSecret {
  return generateSecret({
    name,
    // warning: current NPM version of the package doesn't use issuer
    // https://github.com/speakeasyjs/speakeasy/issues/86#issuecomment-314737950
    issuer,
  });
}
