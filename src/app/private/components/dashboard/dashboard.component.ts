import { Component } from '@angular/core';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { Equipments } from '../../model/equipments';
import { EquipmentsService } from '../../services/equipments.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  currentMonth: string = ''; // Variable pour stocker le mois actuel
  reservationDepartDates: string[] = []; // Variable pour stocker les dates de départ des réservations
  reservationsThisMonth: number = 0; // Variable pour stocker le nombre de réservations ce mois-ci
  equipmentStates: string[] = []; // Variable pour stocker les états des équipements
  disabledCount: number = 0; // Variable pour stocker le nombre d'états "disabled"
  totalEquipments: number = 0; // Variable pour stocker le nombre total d'équipements
  pour:number=0;
  constructor(private reservationService: ReservationService,private equipmentService: EquipmentsService) { }

  ngOnInit(): void {
    this.getCurrentMonth();
    this.getReservationDepartDates();
    this.getEquipmentStates();
  }

  getCurrentMonth(): void {
    const currentDate = new Date(); // Obtenez la date actuelle
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentMonth = monthNames[currentDate.getMonth()]; // Obtenez le nom du mois actuel
  }
  getReservationDepartDates(): void {
    this.reservationService.getAllReservations().subscribe(reservations => {
      // Bouclez à travers toutes les réservations et extrayez les dates de départ
      this.reservationDepartDates = reservations.map(reservation => reservation.departDate)
        .filter(date => date !== undefined) // Filtrez les valeurs undefined
        .map(date => date as string); // Convertissez le type en string
  
      // Initialisez la variable de somme des réservations pour ce mois
      this.reservationsThisMonth = 0;
  
      // Obtenez le mois actuel
      const currentMonth = new Date().getMonth() + 1; // Ajoutez 1 car les mois dans JavaScript commencent à 0
  
      // Bouclez à travers les dates de départ et comparez les mois avec le mois actuel
      this.reservationDepartDates.forEach(date => {
        // Vérifiez si la date est null avant de la traiter (ceci est facultatif si vous êtes sûr que les dates ne sont pas nulles)
        if (date) {
          // Analyser la chaîne de date dans le format "DD-MM-YYYY"
          const [day, month, year] = date.split('-');
          // Convertir la chaîne en nombre pour comparer avec le mois actuel
          const reservationMonth = parseInt(month, 10);
          if (reservationMonth === currentMonth) {
            // Si le mois de la réservation correspond au mois actuel, augmentez le nombre de réservations ce mois-ci
            this.reservationsThisMonth++;
          }
        }
      });
      
    });
    console.log(this.reservationsThisMonth);
  }
  
  getEquipmentStates(): void {
    this.equipmentService.getAllEquipments().subscribe(equipments => {
      // Bouclez à travers tous les équipements et extrayez les états
      const equipmentStates = equipments.map(equipment => equipment.state)
        .filter(state => state !== undefined) // Filtrez les valeurs undefined
        .map(state => state as string); // Convertissez le type en string si nécessaire

      // Calculer le nombre d'états égaux à "disabled"
      this.disabledCount = equipmentStates.filter(state => state === 'Disabled').length;
      console.log(this.disabledCount);
      // Mettre à jour le nombre total d'équipements
      this.totalEquipments = equipmentStates.length;
      console.log(this.totalEquipments);
      this.pour=(this.disabledCount /this. totalEquipments) * 100
    });
  }
  


























}
