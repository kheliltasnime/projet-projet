import { Component } from '@angular/core';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.css']
})
export class EquipmentsComponent {
  equipmentsList: Equipments[] =[];
  constructor(
    private equipmentsService: EquipmentsService,private dialog:MatDialog
  ){}
  ngOnInit(): void {
    this.displayEquipments();
  }

  displayEquipments() {
    this.equipmentsService.getAllEquipments().subscribe((res) => {
      this.equipmentsList = res;
      console.log(res);
    });
  }

  selectedEquipment!: Equipments ;

  selectEquipment(Equipments : any ) {
    this.selectedEquipment = Equipments;
  }
  

  
Openpopup(component:any) {
  var _popup = this.dialog.open(component, {
    width: '40%',
    enterAnimationDuration: '1000ms',
    exitAnimationDuration: '1000ms',
    
  });
  
}

addcustomer(){
  this.Openpopup( PopupComponent);
}
}
