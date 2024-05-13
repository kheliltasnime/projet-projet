import { Component } from '@angular/core';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service'; 
import * as $ from 'jquery';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { Reservation } from 'src/app/private/model/reservation';

@Component({
  selector: 'app-maintenance-room',
  templateUrl: './maintenance-room.component.html',
  styleUrls: ['./maintenance-room.component.css']
})
export class MaintenanceRoomComponent {
  rooms: Rooms[] = [];
  selectedRoom: Rooms | undefined;

  tableauResultat: { roomId: number , departureDate: Date, departureHour: string, returnHour: string }[] = [];


  roomsWithDate: { roomId: number, departureDate: Date, departureHour: string, returnHour:string ,roomData:Rooms}[] = [];

  FinalRoomData: {
    roomId: number;
    date: Date;
    departureTime: string; // Ajout de l'heure de départ
    returnTime: string; // Ajout de l'heure de retour
    roomData: any;
  }[]=[];
disableReservationState: boolean = false;
disablefree: boolean = false;
disableoccupied: boolean = false;


   donneesFinales: any[] = [];
    donneesrooms: any[] = [];

  constructor(
    private roomService: RoomsService,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.loadFutureReservationsAndEquipments();

  }

 
  loadFutureReservationsAndEquipments() {
    // Obtenir la date actuelle
    const currentDate = new Date();
  
    // Récupérer toutes les réservations
    this.reservationService.getAllReservations().subscribe((reservations: Reservation[]) => {
      console.log('Toutes les réservations:', reservations);
  
      // Filtrer les réservations à partir de la date actuelle et concernant des équipements
      const futureReservations = reservations.filter(reservation => {
        if (!reservation.departDate || !reservation.departHour || !reservation.returnHour) {
          return false; // Exclure les réservations sans date de départ, heure de départ, heure de retour
        }
  
        if (reservation.category !== 'Rooms') {
          return false; // Exclure cette réservation si elle ne concerne pas des équipements
        }
  
        // Convertir la date de départ de la réservation en objet Date avec le bon format
        const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
        const departureDate = new Date(year, month - 1, day); // Soustraire 1 de month car les mois sont indexés à partir de 0
  
        // Vérifier si la date de départ est après la date actuelle et que la date de retour est la même que la date de départ
        return departureDate >= currentDate;
      });
  
      // Traiter les réservations futures
      futureReservations.forEach(reservation => {
        if (reservation.roomsId !== null && reservation.roomsId !== undefined) {
          const roomId: number = reservation.roomsId; // Assurez-vous que c'est un number
          this.roomService.getRoomsById(roomId).subscribe((room: Rooms) => {
            console.log('room associé à la réservation:', room);
  
            // Assurez-vous que tous les champs requis sont présents
            if (reservation.departDate && reservation.departHour && reservation.returnHour) {
              const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
              const departureDate = new Date(year, month - 1, day);
  
              this.roomsWithDate.push({
                roomId: roomId, // Utilisez la variable temporaire qui est garantie d'être un number
                departureDate: departureDate,
                departureHour: reservation.departHour,
                returnHour: reservation.returnHour,
                roomData: room
              });
  
              console.log("roomsWithDate",this.roomsWithDate);
              // Vérifier si toutes les opérations asynchrones sont terminées
              if (this.roomsWithDate.length === futureReservations.length) {
                this.filterAndProcessData();
              }
            }
          });
        }
      });
  
    });
  
    // Récupérer tous les équipements
    this.roomService.getAllRooms().subscribe((room: Rooms[]) => {
      console.log('Tous les equip:', this.rooms);
  
      // Stockez les équipements dans la variable de classe equipments
      this.rooms = room;
  
    
    });


  }
  
  
  filterAndProcessData() {
    // Utiliser loadFutureReservationsAndEquipments pour charger les données
  
      // Tableau pour stocker les données finales
    
  console.log("eeee");
console.log(this.tableauResultat);
console.log(this.rooms);
      // Parcourir chaque élément de tableauResultat
      this.roomsWithDate.forEach(element => {
        // Extraire l'ID de l'équipement
        const roomId = element.roomId;

        // Vérifier si l'ID de l'équipement est défini
        if (roomId !== null) {
          const date = element.departureDate;
          const departureTime = element.departureHour;
          const returnTime = element.returnHour;
  
          // Rechercher les données de l'équipement correspondant à cet ID, à cette date et à cette heure
          const roomDataForId = this.rooms.find(room => room.id === roomId );
  console.log(roomDataForId);
          // Vérifier si des données ont été trouvées
          if (roomDataForId) {
            // Ajouter les données trouvées au tableau final
            this.FinalRoomData.push({
              roomId: roomId,
              date: date,
              departureTime: departureTime,
              returnTime: returnTime,
              roomData: roomDataForId
            });
          }
        }
      });
  
      // Trier les données par date
      this.FinalRoomData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
      // Afficher les données finales
      console.log("Final Equipment Data", this.FinalRoomData);
    ;
  }
  
  


onFieldChange(newValue: any, fieldName: string) {
  // Stockez la nouvelle valeur avec le nom du champ modifié
  console.log('Nouvelle valeur de', fieldName, ':', newValue);

  // Désactiver les autres champs si la condition est remplie
  if (fieldName === 'maintenance_status' && ['Under maintenance', 'Damaged'].includes(newValue)) {
    this.disableReservationState = true;
    this.disablefree = true;
    this.disableoccupied = true;
   
  } else if (fieldName === 'state' && newValue === 'Disabled') {
    this.disableReservationState = true;
    this.disablefree = true;
    this.disableoccupied = true;
  
  } else {
    // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
    this.disableReservationState = false;
    this.disableoccupied = false;
    this.disablefree = false;
 
  }

}

// Définir des variables de contrôle pour activer ou désactiver l'édition des champs
performAction(room: any) {
  // Afficher une alerte de confirmation
  const confirmation = window.confirm("Are you sure you want to perform this action?");
  
  // Vérifier si l'utilisateur a confirmé
  if (confirmation) {
    // Vérifier si les champs Maintenance Status et Equipment State ont les valeurs nécessaires pour désactiver les autres champs
    if (
      (room.roomData.maintenance_status === 'Damaged' || room.roomData.maintenance_status === 'Under maintenance') &&
      room.roomData.state === 'Disabled'
    ) {
      // Désactiver les autres champs
      this.disableReservationState = true;
      this.disablefree = true;
      this.disableoccupied = true;
     
    } else {
      // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
      this.disableReservationState = false;
      this.disableoccupied = false;
      this.disablefree = false;
      
    }

    // Mettez ici le code pour gérer l'action pour l'équipement spécifique
    console.log("Action performed for equipment:", room);
console.log("**---------",this.donneesrooms);
    // Trouver l'index de l'équipement dans donneesEquipements
    const index = this.FinalRoomData.findIndex((e: any) => e.roomId === room.roomId);

    // Vérifier si l'index est valide
    if (index !== -1) {
      // Stocker l'ID de l'équipement
      const roomId = room.roomId;

      // Stocker les caractéristiques modifiées
      const modifiedCharacteristics = {
        // Ajoutez ici les caractéristiques modifiées que vous souhaitez stocker
        // Par exemple, si vous souhaitez stocker la quantité modifiée
      
        maintenance_status: room.roomData.maintenance_status,
       
        reservation_State: room.roomData.reservation_State,
       
      
        state: room.roomData.state
        // Ajoutez d'autres caractéristiques modifiées si nécessaire
      };
    
      // Faites quelque chose avec l'ID de l'équipement et les caractéristiques modifiées
      console.log("ID de l'équipement modifié:", roomId);
      console.log("Caractéristiques modifiées:", modifiedCharacteristics);

      // Effectuez la mise à jour de l'équipement
      this.roomService.editRoom(room.roomId, room.roomData).subscribe(response => {
        console.log('Mise à jour réussie', response);
      }, error => {
        console.error('Erreur lors de la mise à jour', error);
      });
    } else {
      console.error("ID d'équipement non trouvé dans donneesEquipements.");
    }
  } else {
    // Afficher un message d'annulation
    console.log("L'exécution de l'action a été annulée.");
  }
}


updateFreeField(newValue: string, equipmentData: any) {
  if (newValue === 'occupied') {
      equipmentData.roomData.free = 'Not free';
  } else {
      equipmentData.roomData.free = 'free';
  }
}

updateOccupiedField(newValue: string, equipmentData: any) {
  if (newValue === 'free') {
      equipmentData.roomData.occupied = 'Not occupied';
  } else {
      equipmentData.roomData.occupied = 'occupied';
  }
}

  }






























