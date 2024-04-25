import { Component, ViewChild, HostListener, ElementRef, Directive, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'; 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
 import { Equipments } from '../../model/equipments';
 import { ActivatedRoute, Router } from '@angular/router';
 import { EquipmentsService } from '../../services/equipments.service';
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  selectedEquipment!: Equipments;
  equipmentId!: number;
 


  

  constructor(
    private route: ActivatedRoute,
    private equipmentsService: EquipmentsService,
    private el: ElementRef,
    private router: Router,
    private dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

 
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const value = event?.target?.value; // Assurez-vous que event, event.target et event.target.value sont tous définis
    if (value) {
      this.el.nativeElement.value = value.replace(/[^0-9]*/g, '');
    }
  }
  


  ngOnInit(): void {
    this.equipmentId = this.data.equipmentId;
    if (this.equipmentId) {
      this.displayEquipments(this.equipmentId);
    }
  }

  displayEquipments(id: number) {
    this.equipmentsService.getEquipmentsById(id).subscribe((res) => {
        console.log("Equipment details:", res); // Ajout de cette ligne pour afficher les détails de l'équipement dans la console
        this.selectedEquipment = res;
    });
}

  
  
 
  goBack(): void {
    this.dialogRef.close();
    this.router.navigate(['benefit/equipments']);
    console.log("Going back..."); // Exemple: affichage d'un message dans la console
  }
  saveEquipment() {
    console.log("Selected Equipment ID:", this.selectedEquipment?.id); // Ajout de l'instruction de débogage
    
    if (this.selectedEquipment?.id) {
        this.updateEquipment(this.selectedEquipment?.id);
    } else {
        console.error("Cannot save equipment without ID. Please ensure equipment ID is set.");
    }
    this.router.navigate(['benefit/equipments']);
}

 

  updateEquipment (id: number){
    this.equipmentsService
    .editEquipment(id, this.selectedEquipment)
    .subscribe((res) => {
      console.log(res);
      this.router.navigate(['/equipments']);
    });
  }

 
  addEquipment() {
    this.equipmentsService.addEquipment(this.selectedEquipment).subscribe((res) => { 
      this.router.navigate(['/equipments']);
      console.log(res);});
  }

 

}
