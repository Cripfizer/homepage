import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');

  // Prepare headers object
  const headers: any = {};

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add Content-Type and Accept headers for API Platform
  if (req.url.includes('/api/')) {
    headers['Content-Type'] = 'application/ld+json';
    headers['Accept'] = 'application/ld+json';
  }

  // Clone the request with headers
  const authReq = req.clone({ setHeaders: headers });

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
