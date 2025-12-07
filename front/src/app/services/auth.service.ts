import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'jwt_token';

  constructor() {
    // Initialize current user from token if it exists
    const token = this.getToken();
    if (token) {
      // In a real app, you might want to validate the token or fetch user data
      // For now, we'll set the user when they login
    }
  }

  register(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/register`, {
      email,
      password
    });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        // Store the token in localStorage
        localStorage.setItem(this.TOKEN_KEY, response.token);
        // Update current user
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
}
