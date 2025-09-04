import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private secretKey: CryptoJS.lib.WordArray;
  private iv: CryptoJS.lib.WordArray;

  constructor(){
    const passphrase = 'mysecretkey123456789';
    
    // Derive 32-byte key from passphrase (same as backend SHA256 + slice)
    const hashed = CryptoJS.SHA256(passphrase);
    const base64Key = CryptoJS.enc.Base64.stringify(hashed).substring(0, 32);
    this.secretKey = CryptoJS.enc.Utf8.parse(base64Key);

    // Fixed 16-byte IV
    this.iv = CryptoJS.enc.Utf8.parse('0000000000000000');
  };

  encrypt(data: any): string {
    const text = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(text, this.secretKey, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  decrypt(cipherText: string): any {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }
}
