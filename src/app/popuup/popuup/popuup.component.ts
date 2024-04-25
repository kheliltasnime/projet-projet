import { Component, ViewChild, HostListener, ElementRef, Directive, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'; 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

 import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from 'src/app/private/services/rooms.service';
import { Rooms } from 'src/app/private/model/rooms';

@Component({
  selector: 'app-popuup',
  templateUrl: './popuup.component.html',
  styleUrls: ['./popuup.component.css']
})
export class PopuupComponent {

  selectedRomm: Rooms = {
    id: 0, // ou une autre valeur par défaut appropriée
    capacity: 0,
    
    name: '',
    type: '',
     
   location:'',
    maintenance_status: '',
    state: '',
    category: '',
    subcategory: '',
    benefit_id:8
  };
  
  roomId!: number;
 


  

  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomsService,
    private el: ElementRef,
    private router: Router,
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<PopuupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

 
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const value = event?.target?.value; // Assurez-vous que event, event.target et event.target.value sont tous définis
    if (value) {
      this.el.nativeElement.value = value.replace(/[^0-9]*/g, '');
    }
  }
  


  ngOnInit(): void {
    this.roomId = this.data.roomId;
    if (this.roomId) {
      this.displayRooms(this.roomId);
    }
  }
  

  displayRooms(id: number) {
    this.roomsService.getRoomsById(id).subscribe((res) => {
        console.log("room details:", res); // Ajout de cette ligne pour afficher les détails de l'équipement dans la console
        this.selectedRomm = res;
    });
}

  
  
 
  goBack(): void {
    this.dialogRef.close();
    this.router.navigate(['benefit/rooms']);
    console.log("Going back..."); // Exemple: affichage d'un message dans la console
  }

  saveRoom() {
    this.roomsService.getRoomsById(this.roomId).subscribe(
      originalRoom => {
        // Effectuez la mise à jour de l'équipement uniquement si des champs ont été modifiés
        if (originalRoom.state !== this.selectedRomm.state ||
          originalRoom.capacity !== this.selectedRomm.capacity ||
          originalRoom.location !== this.selectedRomm.location ||
          originalRoom.maintenance_status !== this.selectedRomm.maintenance_status) {
  
          // Envoyez une requête au backend pour mettre à jour l'équipement
          this.roomsService.editRoom(this.roomId, this.selectedRomm).subscribe(
            editRoom => {
              // L'équipement est mis à jour avec succès dans la base de données
              console.log('room updated successfully:', editRoom);
              // Vous pouvez également réinitialiser le formulaire ou effectuer d'autres actions nécessaires
            },
            error => {
              // Gérez les erreurs de mise à jour de l'équipement
              console.error('Error updating room:', error);
            }
          );
        } else {
          // Aucun champ modifié, ne faites rien ou affichez un message à l'utilisateur
          console.log('No fields were modified.');
        }
      },
      error => {
        // Gérez les erreurs de récupération de l'équipement d'origine
        console.error('Error getting original room:', error);
      }
      

    );
    this.dialogRef.close();
    this.router.navigate(['benefit/rooms']);
    console.log("Going back..."); // Exemple: affichage d'un message dans la console
  }
  
  





}
