import { Component } from '@angular/core';
import { BenefitComponent } from '../benefit/benefit.component';
import { EquipmentsService } from '../../services/equipments.service';
import { RoomsService } from '../../services/rooms.service';
import { Equipments } from '../../model/equipments';
import { Rooms } from '../../model/rooms';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  
equipmentsList: Equipments[] =[];
  roomsList: Rooms[] =[];
  equipmentTypes: string[] = [];
  roomsTypes: string[] = [];

  reservations: Reservation[] = [];
  
  isButtonEnabled: boolean = false;
  selectedCategory: string = '';
  subcategories: string[] = [];
  
  selectedSubcategory: string = '';

  filteredEquipmentsList: Equipments[] = [];
  filteredRoomsList: Rooms[] = [];

  availableEquipments:Equipments[]=[];
  availableRooms:Rooms[]=[];
  selectedDate: string='';
  selectedDepartureTime: string = '';
  selectedReturnTime: string = '';
  departureDatesList: { date: string; departureHour: string; returnHour: string; }[] = [];


  updateButtonState() {
    this.isButtonEnabled = this.equipmentsList.some(equipment => equipment.checked) || this.roomsList.some(room => room.checked);
  }

  title = 'myangularproject';
  constructor(
    private equipmentsService: EquipmentsService,
    private roomsService : RoomsService,
    private router : Router,
    private reservationService : ReservationService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    console.log('ouiiiiiiii');
  //  this.displayEquipments();
    //this.displayRooms();
    this.loadAvailableEquipmentsAndRooms();
    this.getEquipmentTypes();
    this.getRoomsTypes();
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedDate = params['date'];
      
      this.selectedDepartureTime = params['departureTime'];
      this.selectedReturnTime = params['returnTime'];
      
    console.log('Selected date:', this.selectedDate);
    console.log('Selected departure time:', this.selectedDepartureTime);
    console.log('Selected return time:', this.selectedReturnTime);
  
      if (this.selectedDate) {
        
        // Si la date de départ est définie, charger les réservations correspondantes
        this.loadReservationsByDepartureDate(this.selectedDate);
      //  this.loadAllReservations();
       
      }
    });
  }
  private equipmentsSubscription: Subscription | undefined;
  private roomsSubscription: Subscription | undefined;
  ngOnDestroy(): void {
    // Désabonnez-vous des abonnements pour éviter les fuites de mémoire
    if (this.equipmentsSubscription) {
      this.equipmentsSubscription.unsubscribe();
    }
    if (this.roomsSubscription) {
      this.roomsSubscription.unsubscribe();
    }
  }
 
  loadAvailableEquipmentsAndRooms(): void {
    this.reservationService.getAllReservations().subscribe(reservations => {
      const reservedEquipmentsIds = reservations.map(res => res.equipmentsId);
      const reservedRoomsIds = reservations.map(res => res.roomsId);

      this.equipmentsService.getAllEquipments().subscribe(allEquipments => {
        this.availableEquipments = allEquipments.filter(equip => equip.id !== null && equip.id !== undefined && !reservedEquipmentsIds.includes(equip.id));
        this.filteredEquipmentsList = this.availableEquipments; // Display only available equipments
      });
      
      this.roomsService.getAllRooms().subscribe(allRooms => {
        this.availableRooms = allRooms.filter(room => !reservedRoomsIds.includes(room.id));
        this.filteredRoomsList = this.availableRooms; // Display only available rooms
      });
    });
  }
  loadReservationsByDepartureDate(selectedDate: string): void {
    // Initialiser la liste des réservations
    let reservations: Reservation[] = [];
    this.availableEquipments = [];
    this.availableRooms = [];
    // Récupérer toutes les réservations
    this.reservationService.getAllReservations().subscribe({
        next: (res) => {
            // Remplir la liste des réservations
            reservations = res;

            // Afficher les réservations récupérées
            console.log('Reservations:', reservations);

            // Extraire les dates de départ de la liste des réservations
            this.departureDatesList = this.extractDepartureDates(reservations);
            console.log('Departure Dates,Departure time and return time List:', this.departureDatesList);

            // Continuer le traitement des dates de départ extraites...
            // Filtrer les réservations dont la date de départ correspond à selectedDate
            const matchingReservations: Reservation[] = reservations.filter(reservation => {
                // Vérifier si la date de départ de la réservation correspond à selectedDate
                return reservation.departDate === selectedDate &&
                       reservation.departHour === this.selectedDepartureTime &&
                       reservation.returnHour === this.selectedReturnTime;
            });
          
            // Afficher les réservations dont la date de départ correspond à selectedDate et aux heures sélectionnées
            console.log('Matching Reservations:', matchingReservations);
            const matchingReservationsWithIds: {
              roomsId?: number | undefined;
              equipmentsId?: number | undefined;
          }[] = matchingReservations.map(reservation => {
              return {
                  roomsId: reservation.roomsId,
                  equipmentsId: reservation.equipmentsId
              };
          });
          
          
          
          console.log('Matching Reservations with IDs:', matchingReservationsWithIds);
           // Récupérer et filtrer les équipements
           this.equipmentsService.getAllEquipments().subscribe(equipments => {
            this.availableEquipments = equipments.filter(equipment =>
                !matchingReservationsWithIds.some(res => res.equipmentsId === equipment.id)
            );
            console.log('Available Equipments:', this.availableEquipments);
        });

        // Récupérer et filtrer les chambres
        this.roomsService.getAllRooms().subscribe(rooms => {
            this.availableRooms = rooms.filter(room =>
                !matchingReservationsWithIds.some(res => res.roomsId === room.id)
            );
            console.log('Available Rooms:', this.availableRooms);
        });
          
        },
        error: (error) => {
            console.error('Erreur lors de la récupération des réservations:', error);
        }
    });
}

extractDepartureDates(reservations: Reservation[]): { date: string, departureHour: string, returnHour: string }[] {


  // Parcourir toutes les réservations
  reservations.forEach(reservation => {
      // Vérifier si la date de départ est définie et non null
      if (reservation.departDate && reservation.departHour && reservation.returnHour) {
          // Ajouter la date de départ au tableau
          this.departureDatesList.push({
              date: reservation.departDate,
              departureHour: reservation.departHour,
              returnHour: reservation.returnHour
          });
      }
  });
console.log("listaaa:",this.departureDatesList);
  // Retourner le tableau de dates de départ avec heures de départ et de retour
  return this.departureDatesList;
}





  
  
  
  getEquipmentTypes() {
    this.equipmentsService.getEquipmentTypes().subscribe((res) => {
        this.equipmentTypes = res;
        this.subcategories = res;
        console.log(res);

    });
}
  
  getRoomsTypes() {
    this.roomsService.getRoomsTypes().subscribe((res) => {
      this.roomsTypes = res;
      
      this.subcategories = res; // Mettre à jour les sous-catégories avec les types d'équipement
  
      console.log(res); // Log the retrieved room types to verify data
    });
  }




  displayEquipments() {
    this.equipmentsService.getAllEquipments().subscribe((res) => {
    //  this.equipmentsList = res;
      this.filteredEquipmentsList = res;
      console.log(res);
    });
  }

  displayRooms() {
    this.roomsService.getAllRooms().subscribe((res) => {
    //  this.roomsList = res;
      this.filteredRoomsList = res;
      console.log(res);
    });
  }
/*
  selectedEquipment!: Equipments ;

  selectEquipment(equipments : any ) {
    this.selectedEquipment = equipments;
  }

   

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe(reservations => {
      this.reservations = reservations;
    });
  }
  
  selectedDepartureDate: Date = new Date(); // Initialize with current date
  selectedReturnDate: Date = new Date();

  checkAvailability(): void {
    // Compare selected dates with reservations
    const isDepartureDateAvailable = this.isDateAvailable(this.selectedDepartureDate);
    const isReturnDateAvailable = this.isDateAvailable(this.selectedReturnDate);

    // Provide feedback to the user
    if (isDepartureDateAvailable && isReturnDateAvailable) {
      console.log('Selected dates are available for reservation.');
    } else {
      console.log('Selected dates are not available for reservation.');
    }
  }

  isDateAvailable(dateToCheck: Date): boolean {
    // Implement logic to check if the date is available
    // You can compare with the reservations array using some logic
    return true; // Placeholder return value
  }
  */
  result: any;

  onCategoryChange(event: any) {
      console.log('Event:', event); // Vérifiez la structure de l'objet event
      const category = event.target?.value;
      console.log('Selected category:', category); // Vérifiez la valeur de la catégorie sélectionnée
  
      this.selectedCategory = category; // Mettre à jour la variable selectedCategory avec la catégorie sélectionnée
  
      if (category === 'category1') {
          this.getEquipmentTypes(); // Appel de la méthode pour récupérer les types d'équipement
      } else if (category === 'category2') {
          this.getRoomsTypes(); // Appel de la méthode pour récupérer les types de chambre
      } else {
          this.subcategories = []; // Effacer les sous-catégories si aucune catégorie n'est sélectionnée
          this.result = null; // Remettre le résultat à null si aucune catégorie n'est sélectionnée
      }
  }
  
  
  
  
  onSubcategoryChange(event: any) {
    this.selectedSubcategory = event.target.value;
    const selectedCategory = this.selectedCategory;
    
    if (this.selectedCategory === 'category1') {
      // Effectuer la recherche d'équipements basée sur la sous-catégorie sélectionnée
      // Vous pouvez utiliser la variable selectedSubcategory ici pour effectuer la recherche
      
    } else if (this.selectedCategory === 'category2') {
      // Effectuer la recherche de chambres basée sur la sous-catégorie sélectionnée
      // Vous pouvez utiliser la variable selectedSubcategory ici pour effectuer la recherche
    }
    
  }
  
// Déclaration de la propriété filteredRoomsList comme un tableau vide
  search() {
    // Réinitialiser les listes des équipements et des chambres
    this.filteredEquipmentsList = [];
    this.filteredRoomsList = [];
  
    // Récupérez la valeur de la catégorie et de la sous-catégorie sélectionnées
    const selectedCategory = (document.getElementById('category') as HTMLSelectElement).value;
    const selectedSubcategory = (document.getElementById('subcategory') as HTMLSelectElement).value;
  
     // Affichez les valeurs récupérées dans la console
  console.log('Selected Category:', selectedCategory);
  console.log('Selected Subcategory:', selectedSubcategory);

    if (selectedCategory === 'category1') { // 'category1' devrait correspondre à 'Equipments'
      this.equipmentsService.getAllEquipments().subscribe(equipments => {
        if (selectedSubcategory) {
          // Filtrer uniquement si une sous-catégorie est sélectionnée
          this.filteredEquipmentsList = equipments.filter(equipment => equipment.type === selectedSubcategory);
        } else {
          // Si aucune sous-catégorie n'est sélectionnée, afficher tous les équipements
          this.filteredEquipmentsList = equipments;
        }
      });
    
      console.log('filteredEquipmentsList :', this.filteredEquipmentsList);  } 
    else if (selectedCategory === 'category2') { // 'category2' devrait correspondre à 'Rooms'
      this.roomsService.getAllRooms().subscribe(rooms => {
        if (selectedSubcategory) {
          // Filtrer uniquement si une sous-catégorie est sélectionnée
          this.filteredRoomsList = rooms.filter(room => room.type === selectedSubcategory);
        } else {
          // Si aucune sous-catégorie n'est sélectionnée, afficher toutes les chambres
          this.filteredRoomsList = rooms;
        }
      });
      console.log('filteredRoomsList :', this.filteredRoomsList);  }
      else {
        this.displayEquipments();
        this.displayRooms();
      }
  }
  











}
