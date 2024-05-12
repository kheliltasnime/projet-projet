import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'assets/results.json'; // Chemin vers votre fichier JSON

  constructor(private http: HttpClient) { }

  getResults(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(data => console.log('Données récupérées depuis le fichier JSON :', data)),
      catchError(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données :', error);
        throw error;
      })
    );
  }
}
