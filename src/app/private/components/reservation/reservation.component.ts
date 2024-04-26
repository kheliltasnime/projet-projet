import { Component } from '@angular/core';
import { BenefitComponent } from '../benefit/benefit.component';
import { EquipmentsService } from '../../services/equipments.service';
import { RoomsService } from '../../services/rooms.service';
import { Equipments } from '../../model/equipments';
import { Rooms } from '../../model/rooms';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
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
  filteredEquipments: Equipments[] = [];
  selectedSubcategory: string = '';


  updateButtonState() {
    this.isButtonEnabled = this.equipmentsList.some(equipment => equipment.checked) || this.roomsList.some(room => room.checked);
  }

  title = 'myangularproject';
  constructor(
    private equipmentsService: EquipmentsService,
    private roomsService : RoomsService,
    private reservationService : ReservationService,
  ){}

  ngOnInit(): void {
    this.displayEquipments();
    this.displayRooms();
    this.getEquipmentTypes();
    this.loadReservations();

  }
  getEquipmentTypes() {
    this.equipmentsService.getEquipmentTypes().subscribe((res) => {
      this.equipmentTypes = res;
      this.result = res; // Stocker les types d'équipement dans une variable temporaire
      this.subcategories = res; // Mettre à jour les sous-catégories avec les types d'équipement
  
      console.log(res);
    });
  }
  
  getRoomsTypes() {
    this.roomsService.getRoomsTypes().subscribe((res) => {
      this.roomsTypes = res;
      this.result = res; // Stocker les types d'équipement dans une variable temporaire
      this.subcategories = res; // Mettre à jour les sous-catégories avec les types d'équipement
  
      console.log(res); // Log the retrieved room types to verify data
    });
  }





  displayEquipments() {
    this.equipmentsService.getAllEquipments().subscribe((res) => {
      this.equipmentsList = res;
      console.log(res);
    });
  }

  displayRooms() {
    this.roomsService.getAllRooms().subscribe((res) => {
      this.roomsList = res;
      console.log(res);
    });
  }

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
    const selectedSubcategory = event.target.value;
    const selectedCategory = this.selectedCategory;
    if (this.selectedCategory === 'category1') {
      // Effectuer la recherche d'équipements basée sur la sous-catégorie sélectionnée
      // Vous pouvez utiliser la variable selectedSubcategory ici pour effectuer la recherche
    } else if (this.selectedCategory === 'category2') {
      // Effectuer la recherche de chambres basée sur la sous-catégorie sélectionnée
      // Vous pouvez utiliser la variable selectedSubcategory ici pour effectuer la recherche
    }
  }
  
  
  
  // Add the search function to your component class
searchEquipments() {
  const selectedCategory = this.selectedCategory;
  const selectedSubcategory = this.selectedSubcategory;

  if (selectedCategory === 'category1') {
    // Filter equipments based on selected subcategory
    this.filteredEquipments = this.equipmentsList.filter(equipment => equipment.type === selectedSubcategory);
  } else if (selectedCategory === 'category2') {
    // Handle filtering for rooms (if needed)
    // Example: this.filteredRooms = this.roomsList.filter(room => room.type === selectedSubcategory);
  }
}














}
