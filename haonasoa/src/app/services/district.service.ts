import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DistrictService {
  constructor(private http: HttpClient) {}

  getItem(nomDistrict: string): Observable<any> {
    const url = environment.urlBack + 'district/getItem';
    const data = {
      nom: nomDistrict,
    };
    return this.http.post<any>(url, data);
  }
}
