import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Equip } from '../model/Equip';
@Injectable({
  providedIn: 'root'
})
export class EquipService {

  baseUrl = 'http://localhost:8083/api/arsii';
  private equipmentsUrl = this.baseUrl + '/equip'; 

  constructor(private httpclient: HttpClient) { }
  
  
  getAllEquip(){
    return this.httpclient.get<Equip[]>(this.baseUrl+'/equip');
  }
}
