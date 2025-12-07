import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');

  // Clone the request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch 401 errors
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('jwt_token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
