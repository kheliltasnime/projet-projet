import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/private/services/reservation.service';
@Component({
  selector: 'app-listreserv',
  templateUrl: './listreserv.component.html',
  styleUrls: ['./listreserv.component.css']
})
export class ListreservComponent {

  constructor(public reservationService: ReservationService) {}

  ngOnInit() {
    console.log('Checked Items:', this.reservationService.checkedItems);
  }
  
 // Méthode appelée lors du clic sur le bouton de validation
 validateReservation() {
  // Ici, insérez la logique pour traiter la validation de la réservation
  console.log('Validating reservation with these items:', this.reservationService.checkedItems);
  // Par exemple, naviguer vers une autre page ou envoyer les données via un service
}







}
