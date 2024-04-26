import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../model/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

 
  baseUrl = 'http://localhost:8083/api/arsii';

  constructor(private httpclient: HttpClient) { }

  getAllReservations(){
    return this.httpclient.get<Reservation[]>(this.baseUrl+'/reservation');
  }

  deleteReservation(id: number){
    return this.httpclient.delete(this.baseUrl+'/reservation/' + id);
  }

  addReservation(reservation : Reservation) {
    return this.httpclient.post(this.baseUrl + '/reservation',reservation);
  }

  updateReservation(id: number,reservation:Reservation){
    return this.httpclient.put(this.baseUrl + '/reservation/' + id, reservation);
  }

  getReservationById(id : number){
    return this.httpclient.get<Reservation>(this.baseUrl + '/reservation/' +id );
  }
}
