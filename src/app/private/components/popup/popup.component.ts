import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'; 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
 import { Equipments } from '../../model/equipments';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {

//  selectedEquipment!: Equipments;
  selectedEquipment : Equipments ={quantity: 0,price:0,category:'',subcategory:'',maintenance_status:'',state:''};
  
}
