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
import { MatDialog } from '@angular/material/dialog';
import { DetailsModalComponent } from '../benefit/equipments/details-modal/details-modal.component';
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


  equipments: any = { checked: false }; // Initialisation à false
  checkedItems: any[] = [];


  filteredEquipmentsList: Equipments[] = [];
  filteredRoomsList: Rooms[] = [];

  availableEquipments:Equipments[]=[];
  availableRooms:Rooms[]=[];
  selectedDate: string='';
  selectedDepartureTime: string = '';
  selectedReturnTime: string = '';
  departureDatesList:{ equipmentsId: number | undefined; roomsId: number | undefined }[] = [];
 
  equipmentsId:number=0;
  roomsId:number=0;
  updateButtonState() {
    this.isButtonEnabled = this.equipmentsList.some(equipment => equipment.checked) || this.roomsList.some(room => room.checked);
  }

  title = 'myangularproject';
  constructor(public dialog: MatDialog,
    private equipmentsService: EquipmentsService,
    private roomsService : RoomsService,
    private router : Router,
    private reservationService : ReservationService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    console.log('ouiiiiiiii');
  //this.displayEquipments();
   // this.displayRooms();
   
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
        this.loadReservationsByDepartureDate(this.selectedDate,this.selectedDepartureTime,this.selectedReturnTime);
    
      }
    });
    
  }
  onCheckboxChange(event: any, item: any, selectedDate: string, selectedDepartureTime: string, selectedReturnTime: string) {
    console.log('Checkbox état:', event.checked ? 'coché' : 'non coché');
  
    if (event.checked) {
      // Créer un nouvel objet contenant toutes les données nécessaires
      const newItem = {
        ...item,
        selectedDate: selectedDate,
        selectedDepartureTime: selectedDepartureTime,
        selectedReturnTime: selectedReturnTime
      };
      console.log('checkedItems ye tas ',newItem);
      this.reservationService.checkedItems.push(newItem);
    } else {
      // Supprimer l'élément de la liste si la case est décochée
      const index = this.reservationService.checkedItems.findIndex(x => 
        x.id === item.id);  // Assurez-vous que chaque 'item' a un identifiant unique ou modifiez la condition pour correspondre à votre cas d'usage.
      if (index !== -1) {
        this.reservationService.checkedItems.splice(index, 1);
      }
    }
   
  }
  

  onSubmit() {
    // Redirigez l'utilisateur vers la page de liste
    this.router.navigateByUrl('reservation/list');
  }



  initializeDefaultLists(): void {
    this.filteredEquipmentsList = this.availableEquipments;
    this.filteredRoomsList = this.availableRooms;
  }
  loadReservationsByDepartureDate(selectedDate: string,selectedDepartureTime: string, selectedReturnTime: string): void {
    // Initialiser la liste des réservations
   // let reservations: Reservation[] = [];
    this.availableEquipments = [];
    this.availableRooms = [];
  
    // Récupércoer toutes les réservations
    this.reservationService.getAllReservations().subscribe({
        next: (res) => {
            // Remplir la liste des réservations avec les réservations pour la date sélectionnée
            this.reservations = res.filter(reservation =>   reservation.departDate === selectedDate && 
              reservation.departHour === selectedDepartureTime && 
              reservation.returnHour === selectedReturnTime
          );

            // Afficher les réservations récupérées dans la console
            console.log('*Reservations for selected date:*', this.reservations);

            // Extraire les dates de départ, heures de départ, heures de retour, équipementsId et roomsId de la liste des réservations
            this.departureDatesList = this.extractDepartureDates(this.reservations);
            console.log('in this date  and time : Equipment Id, Room Id List:', this.departureDatesList);

           
            
            // Récupérer et filtrer les équipements disponibles
            this.equipmentsService.getAllEquipments().subscribe(equipments => {
                this.availableEquipments = equipments.filter(equipment =>
                    !this.departureDatesList.some(res => res.equipmentsId === equipment.id)
                );
                console.log('Available Equipments:', this.availableEquipments);
                this.initializeDefaultLists();
                
            });

            // Récupérer et filtrer les chambres disponibles
            this.roomsService.getAllRooms().subscribe(rooms => {
                this.availableRooms = rooms.filter(room =>
                    !this.departureDatesList.some(res => res.roomsId === room.id)
                );
                console.log('Available Rooms:', this.availableRooms);
                this.initializeDefaultLists();
            });
            //ici on appelle la table equipment pour les id dans availbaleequipments et on stocke les details dans filterequipments
        },
        error: (error) => {
            console.error('Erreur lors de la récupération des réservations:', error);
        }
    });
}
extractDepartureDates(reservations: Reservation[]): { equipmentsId: number | undefined; roomsId: number | undefined }[] {
   this.departureDatesList;//{ equipmentsId: ; roomsId: number | undefined }[] = [];

  // Parcourir toutes les réservations
  reservations.forEach(reservation => {
    // Vérifier si les identifiants d'équipements et de chambres sont définis et non null
    if (reservation.equipmentsId !== undefined && reservation.roomsId !== undefined) {
      // Ajouter les identifiants d'équipements et de chambres au tableau
      this.departureDatesList.push({
        equipmentsId: reservation.equipmentsId,
        roomsId: reservation.roomsId
      });
    }
  });

  console.log("equi id et room id :", this.departureDatesList);
  // Retourner le tableau de dates de départ avec les identifiants d'équipements et de chambres
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
  

  openDetailsModal(item: any) {
    const category = item.category; 
    const dialogRef = this.dialog.open(DetailsModalComponent, {
      width: '250px',
      data: { item: item,itemcategory:category }
    });
  console.log('item',item);
  console.log('item categogry',category);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  









}