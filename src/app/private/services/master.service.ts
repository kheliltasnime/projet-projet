import { Injectable } from '@angular/core';
import { colorentity } from 'src/app/Entity/colorentity';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Country} from '../model/Customer';
import { Customer } from '../model/Customer';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

 
  SaveAssociate(data:any,code:any){
    return this.http.put('http://localhost:8083/api/arsii'+code,data);
  }

}
