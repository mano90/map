import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatistiqueCommune {
  constructor(private http: HttpClient) {}

  getByRubrique(
    idrubrique: number,
    statistiqueDistrict: number
  ): Observable<any> {
    const url =
      environment.urlBack +
      'StatistiqueCommune/getByRubrique/' +
      idrubrique +
      '/' +
      statistiqueDistrict;

    return this.http.get<any>(url);
  }

  getByRubriqueAndName(idrubrique: number, nom: string): Observable<any> {
    const url =
      environment.urlBack + 'statistiqueCommune/getByRubriqueAndName/';
    const data = {
      rubrique: idrubrique,
      nomCommune: nom,
    };
    return this.http.post<any>(url, data);
  }

  getByRubriqueAndNameDistrict(
    idrubrique: number,
    nom: string
  ): Observable<any> {
    const url =
      environment.urlBack + 'statistiqueCommune/getByRubriqueAndNameDistrict/';
    const data = {
      rubrique: idrubrique,
      nomDistrict: nom,
    };
    return this.http.post<any>(url, data);
  }

  saveStatistiqueCommune(
    idrubrique: number,
    valeur: number,
    refCommune: string
  ) {
    const url =
      environment.urlBack + 'statistiqueCommune/saveStatistiqueCommune/';
    const data = {
      rubrique: idrubrique,
      valeur: valeur,
      refCommune: refCommune,
    };
    return this.http.post<any>(url, data);
  }
}
