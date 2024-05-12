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
  tableauResultat: { roomsId: number , departureDate: Date, departureHour: string, returnHour: string }[] = [];


 roomsWithDate: { roomsId: number, departureDate: Date, departureHour: string, returnHour:string }[] = [];

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
disableDescription:boolean=false;
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
  
      // Liste pour stocker les ID des équipements avec leur date de départ et heures
     // const equipmentsWithDate: { equipmentId: number, departureDate: Date, departureHour: string,returnHour:string }[] = [];
  
      // Filtrer les réservations à partir de la date actuelle
      const futureReservations = reservations.filter(reservation => {
        if (!reservation.departDate || !reservation.departHour || !reservation.returnHour) {
          return false; // Si departDate, departHour ou returnHour sont undefined, retourner false
        }
  
        // Convertir la date de départ de la réservation en objet Date avec le bon format
        const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
        const departureDate = new Date(year, month - 1, day); // Soustraire 1 de month car les mois sont indexés à partir de 0
  
        // Vérifier si la date de départ est après la date actuelle et que la date de retour est la même que la date de départ
        if (departureDate >= currentDate ) {
          // Vérifier si equipmentId est défini avant de l'ajouter à la liste
        // Vérifier si equipmentId est défini avant de l'ajouter à la liste
        if (reservation.roomsId !== null  && reservation.roomsId !== undefined) {
          this.roomService.getRoomsById(reservation.roomsId).subscribe((room: Rooms) => {
              console.log('Équipement associé à la réservation:', room);
          
            
              if (reservation.roomsId !== undefined && reservation.departHour !== undefined && reservation.returnHour !== undefined) {
                  this.roomsWithDate.push({
                      roomsId: reservation.roomsId,
                      departureDate: departureDate,
                      departureHour: reservation.departHour,
                      returnHour: reservation.returnHour,
                  });
              }
          });
      }
          return true; // Renvoyer true pour inclure cette réservation dans la liste des réservations futures
        } else {
          return false; // Renvoyer false pour exclure cette réservation de la liste des réservations futures
        }
      });
  
      this.tableauResultat = this.roomsWithDate; // Mise à jour de tableauResultat avec les données filtrées

    
// Afficher le tableau résultat
    console.log("tableauResultat",this.tableauResultat);



    this.roomService.getAllRooms().subscribe((equipments: Rooms[]) => {
      console.log('Tous les équipements:', equipments);
      
      // Stockez les équipements dans la variable de classe equipments
      this.rooms = equipments;
console.log(this.rooms);

      // Appeler la méthode pour filtrer et traiter les données
      this.filterAndProcessData();// Vous pouvez maintenant utiliser la liste equipmentsWithDate pour stocker ou manipuler les données comme nécessaire
    });
  });

  // Déclaration d'un tableau pour stocker les données finales
}
filterAndProcessData() {
  // Tableau pour stocker les données finales
  // Parcourir chaque élément de tableauResultat
  this.tableauResultat.forEach(element => {
    // Extraire l'ID de l'équipement
    const roomId = element.roomsId;

    // Vérifier si l'ID de l'équipement est défini
    if (roomId !== null) {
      const date = element.departureDate;
      const departureTime = element.departureHour;
      const returnTime = element.returnHour;

      // Rechercher les données de l'équipement correspondant à cet ID, à cette date et à cette heure
      const roomDataForId = this.rooms.find(room => room.id === roomId );

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
  this.FinalRoomData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Afficher les données finales
  console.log("finalEquipmentData", this.FinalRoomData);
}

onFieldChange(newValue: any, fieldName: string) {
  // Stockez la nouvelle valeur avec le nom du champ modifié
  console.log('Nouvelle valeur de', fieldName, ':', newValue);

  // Désactiver les autres champs si la condition est remplie
  if (fieldName === 'maintenance_status' && ['Under maintenance', 'Damaged'].includes(newValue)) {
    this.disableReservationState = true;
    this.disablefree = true;
    this.disableoccupied = true;
    this.disableDescription=true;
  } else if (fieldName === 'state' && newValue === 'Disabled') {
    this.disableReservationState = true;
    this.disablefree = true;
    this.disableoccupied = true;
    this.disableDescription=true;
  } else {
    // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
    this.disableReservationState = false;
    this.disableoccupied = false;
    this.disablefree = false;
    this.disableDescription=false;
  }

  // Vous pouvez stocker la nouvelle valeur dans un objet ou un tableau selon vos besoins
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
      this.disableDescription = true;
    } else {
      // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
      this.disableReservationState = false;
      this.disableoccupied = false;
      this.disablefree = false;
      this.disableDescription = false;
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
        capacity: room.roomData.capacity,
        maintenance_status: room.roomData.maintenance_status,
        description: room.roomData.description,
        reservation_State: room.roomData.reservation_State,
        free: room.roomData.returned,
        taken: room.roomData.taken,
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

incrementQuantity(room: any) {
  room.roomData.capacity++;
}

decrementQuantity(room: any) {
  if (room.roomData.capacity > 0) {
    room.roomData.capacity--;
  }

}
































}