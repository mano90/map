import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  constructor(private http: HttpClient) {}
  getItem(nomCommune: string): Observable<any> {
    const url = environment.urlBack + 'commune/getItem';
    const data = {
      nom: nomCommune,
    };
    return this.http.post<any>(url, data);
  }
}
