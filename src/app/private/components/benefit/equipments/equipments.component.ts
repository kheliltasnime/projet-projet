import { Component ,OnInit} from '@angular/core';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.css']
})
export class EquipmentsComponent implements OnInit {
  equipmentsList: Equipments[] =[];
  selectedEquipment: Equipments | undefined;
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

 

  selectEquipment(Equipments : any ) {
    this.selectedEquipment = Equipments;
  }
  

  addCustomer(equipmentId: number | null | undefined) {
    if (equipmentId !== null && equipmentId !== undefined) {
      this.openPopup(equipmentId);
    } else {
      console.error('No equipment selected or ID is undefined');
    }
  }
  
  
  
  openPopup(equipmentId: number) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { equipmentId: equipmentId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
}
