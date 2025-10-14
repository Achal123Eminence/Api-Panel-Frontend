import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, NgZone,PLATFORM_ID } from '@angular/core';
import { User } from '../service/user';
import { Router } from '@angular/router';
import { catchError, throwError, map, from, switchMap  } from 'rxjs';
import { CryptoService } from '../service/crypto.service';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import * as Fingerprint2 from 'fingerprintjs2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const userService = inject(User);
  const router = inject(Router);
  const crypto = inject(CryptoService);
  const ngZone = inject(NgZone);

  // Skip when running on the server
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const token = userService.getToken();
  let authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

   // --- FingerprintJS modern ---
  const getFingerprintJS = async (): Promise<{ fingerprint: string; components: any }> => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return {
        fingerprint: result.visitorId,
        components: result.components ?? {}
      };
    } catch {
      return { fingerprint: '', components: {} };
    }
  };

  // --- Fingerprint2 legacy ---
  const getFingerprint2 = (): Promise<{ fingerprint: string; components: any }> => {
    return new Promise((resolve) => {
      Fingerprint2.get((components: any) => {
        const hash = Fingerprint2.x64hash128(
          components.map((c: any) => c.value).join(''),
          31
        );

        const compObj: any = {};
        for (let ch of components) {
          compObj[ch.key] = ch.value;
        }

        ngZone.run(() => {
          resolve({
            fingerprint: hash,
            components: compObj
          });
        });
      });
    });
  };

  // --- Decide which to use ---
  const getFingerprint = async (): Promise<{ fingerprint: string; components: any }> => {
    let fp = await getFingerprintJS();
    if (!fp.fingerprint) {
      fp = await getFingerprint2();
    }
    return fp;
  };

  return from(getFingerprint()).pipe(
    switchMap(({ fingerprint, components }) => {
      let modifiedBody: any = authReq.body; // <-- FIX: explicitly any

      if (modifiedBody && ['POST', 'PUT', 'PATCH'].includes(authReq.method)) {
        if (modifiedBody instanceof FormData) {
          // Handle FormData
          const newFormData = new FormData();
          modifiedBody.forEach((value: any, key: string) => {
            newFormData.append(key, value);
          });
          newFormData.append('fingerprint', fingerprint);
          newFormData.append('components', JSON.stringify(components));
          modifiedBody = newFormData;
        } else {
          // Handle JSON
          modifiedBody = {
            ...modifiedBody,
            fingerprint,
            components
          };
        }
        // Encrypt
        const encryptedBody = crypto.encrypt(modifiedBody);
        authReq = authReq.clone({ body: encryptedBody });
      }

      return next(authReq).pipe(
        map((event: any) => {
          if (event instanceof HttpResponse && event.body?.payload) {
            try {
              const decryptedData = crypto.decrypt(event.body.payload);
              return event.clone({ body: decryptedData });
            } catch (e) {
              console.error('Response decryption failed:', e);
            }
          }
          return event;
        }),
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            userService.logout();
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    })
  );
};
