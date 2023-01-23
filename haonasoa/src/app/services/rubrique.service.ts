import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from '../Classes/item';

@Injectable({
  providedIn: 'root',
})
export class RubriqueService {
  constructor(private http: HttpClient) {}

  listeRubrique(): Observable<Item[]> {
    const url = environment.urlBack + 'rubrique/liste';
    return this.http.get<Item[]>(url);
  }
}
