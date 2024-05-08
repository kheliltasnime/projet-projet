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
  searchText: string = ''; 
  equipmentsList: Equipments[] =[];
  filteredEquipmentList: Equipments[] = [];
  selectedEquipment: Equipments | undefined;

  constructor(
    private equipmentsService: EquipmentsService,private dialog:MatDialog
  ){}
  ngOnInit(): void {
  
    this.displayEquipments();
  }


  search(): void {
    // Filtrer la liste d'employés en fonction du texte de recherche
    if (this.searchText.trim() === '') {
      // Si le champ de recherche est vide, réinitialiser filteredEmployeeList avec employeeList
      this.filteredEquipmentList = this.equipmentsList;
    } else {
      // Sinon, appliquer la recherche normalement
      this.filteredEquipmentList = this.equipmentsList.filter(equipment => {
        // Vérifier si employee.firstName, employee.lastName et employee.email ne sont pas undefined
        const model = equipment.model ? equipment.model.toLowerCase() : '';
        const name = equipment.name ? equipment.name.toLowerCase() : '';
        const type = equipment.type ? equipment.type.toLowerCase() : '';
    
        // Rechercher le texte dans firstName, lastName et email
        return (
          model.includes(this.searchText.toLowerCase()) ||
          name.includes(this.searchText.toLowerCase()) ||
          type.includes(this.searchText.toLowerCase())
        );
      });
    }console.log('Filtered equipment List:', this.filteredEquipmentList);
  }



  displayEquipments() {
    this.equipmentsService.getAllEquipments().subscribe((res) => {
      this.equipmentsList = res;
      
      this.filteredEquipmentList = res;
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
      this.displayEquipments();
    });
   
  }
  
}
