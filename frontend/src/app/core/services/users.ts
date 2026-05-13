import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10, search: string = '', role?: string): Observable<UsersResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search);

    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, { params });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, dto);
  }

  updateUser(id: string, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, dto);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  updateProfile(id: string, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, dto);
  }

  changePassword(id: string, dto: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/password`, dto);
  }
}