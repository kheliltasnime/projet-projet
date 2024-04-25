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

  selectedEquipment: Equipments = {
    id: 0, // ou une autre valeur par défaut appropriée
    quantity: 0,
    price: 0,
    name: '',
    type: '',
    manufactuer: '', // Notez la correction de l'orthographe de "manufacturer"
    model: '',
    maintenance_status: '',
    state: '',
    category: '',
    subcategory: '',
    benefit_id:7
  };
  
  equipmentId!: number;
 


  

  constructor(
    private route: ActivatedRoute,
    private equipmentsService: EquipmentsService,
    private el: ElementRef,
    private router: Router,
    private fb: FormBuilder, 
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
    this.equipmentsService.getEquipmentsById(this.equipmentId).subscribe(
      originalEquipment => {
        // Effectuez la mise à jour de l'équipement uniquement si des champs ont été modifiés
        if (originalEquipment.state !== this.selectedEquipment.state ||
            originalEquipment.quantity !== this.selectedEquipment.quantity ||
            originalEquipment.price !== this.selectedEquipment.price ||
            originalEquipment.maintenance_status !== this.selectedEquipment.maintenance_status) {
  
          // Envoyez une requête au backend pour mettre à jour l'équipement
          this.equipmentsService.editEquipment(this.equipmentId, this.selectedEquipment).subscribe(
            editEquipment => {
              // L'équipement est mis à jour avec succès dans la base de données
              console.log('Equipment updated successfully:', editEquipment);
              // Vous pouvez également réinitialiser le formulaire ou effectuer d'autres actions nécessaires
            },
            error => {
              // Gérez les erreurs de mise à jour de l'équipement
              console.error('Error updating equipment:', error);
            }
          );
        } else {
          // Aucun champ modifié, ne faites rien ou affichez un message à l'utilisateur
          console.log('No fields were modified.');
        }
      },
      error => {
        // Gérez les erreurs de récupération de l'équipement d'origine
        console.error('Error getting original equipment:', error);
      }
      

    );
    this.dialogRef.close();
    this.router.navigate(['benefit/equipments']);
    console.log("Going back..."); // Exemple: affichage d'un message dans la console
  }
  
  


 
  addEquipment() {
    this.equipmentsService.addEquipment(this.selectedEquipment).subscribe((res) => { 
      this.router.navigate(['/equipments']);
      console.log(res);});
  }

 

}
