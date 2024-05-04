import { Component } from '@angular/core';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  currentReservations: Reservation[] = [];
  upcomingReservations: Reservation[] = [];
  pastReservations: Reservation[] = [];
  
  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.loadReservations();
  }

 
  loadReservations(): void {
    // Récupérer toutes les réservations
    this.reservationService.getAllReservations().subscribe({
      next: (res) => {
        // Remplir les listes de réservations
        this.currentReservations = res;
        this.upcomingReservations = res;
        this.pastReservations = res;
      },
      error: (err) => {
        console.error("Une erreur s'est produite lors de la récupération des réservations :", err);
      }
    });
  }
  
}
