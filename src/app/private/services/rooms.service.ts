import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rooms } from '../model/rooms';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  baseUrl = 'http://localhost:8083/api/arsii';

  constructor(private httpclient: HttpClient) { }

  getAllRooms(){
    return this.httpclient.get<Rooms[]>(this.baseUrl+'/rooms');
  }
  getRoomsById(id : number){
    return this.httpclient.get<Rooms>(this.baseUrl + '/rooms/' +id );
  }
  editRoom(id: number,rooms:Rooms){
    return this.httpclient.put(this.baseUrl + '/rooms/' + id, rooms);
  }
}
