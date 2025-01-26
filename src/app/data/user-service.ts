import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from '../../globals';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {
  }
  getData() {
    return this.http.get(config.apiUrl + '/users?token=538593009934300-1935924629');
  }
}
