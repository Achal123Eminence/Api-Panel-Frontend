import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { User } from '../service/user';
import { Router } from '@angular/router';
import { catchError, throwError, map } from 'rxjs';
import { CryptoService } from '../service/crypto.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(User);
  const router = inject(Router);
  const crypto = inject(CryptoService);

  const token = userService.getToken();
  let authReq = token ? req.clone({ setHeaders:{Authorization:`Bearer ${token}`}}) : req;

  // Encrypt request body (only for POST/PUT/PATCH with a body)
  if (authReq.body && ['POST', 'PUT', 'PATCH'].includes(authReq.method)) {
    const encryptedBody = crypto.encrypt(authReq.body);
    authReq = authReq.clone({ body: encryptedBody });
  }

  return next(authReq).pipe(
    map((event:any) => {
      // Decrypt response payload if present
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
      if(error.status === 401 || error.status === 403){
        userService.logout();
      }
      return throwError(()=> error);
    })
  );
};
