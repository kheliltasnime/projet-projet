import { Component } from '@angular/core';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';
import * as $ from 'jquery';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { Reservation } from 'src/app/private/model/reservation';
@Component({
  selector: 'app-maintenance-equip',
  templateUrl: './maintenance-equip.component.html',
  styleUrls: ['./maintenance-equip.component.css']
})
export class MaintenanceEquipComponent {
  equipments: Equipments[] = [];
  selectedEquipment: Equipments | undefined;
  tableauResultat: { equipmentId: number , departureDate: Date, departureHour: string, returnHour: string }[] = [];


  equipmentsWithDate: { equipmentId: number, departureDate: Date, departureHour: string, returnHour:string }[] = [];

  FinalEquipmentData: {
    equipmentId: number;
    date: Date;
    departureTime: string; // Ajout de l'heure de départ
    returnTime: string; // Ajout de l'heure de retour
    equipmentData: any;
  }[]=[];

  disableReservationState: boolean = false;
disableReturned: boolean = false;
disableTaken: boolean = false;
disableDescription:boolean=false;
   donneesFinales: any[] = [];
    donneesEquipements: any[] = [];
  constructor(
    private equipmentService: EquipmentsService,
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
          if (reservation.equipmentsId !== undefined) {
            // Stocker l'ID de l'équipement avec sa date de départ et heure de départ dans la liste
            this.equipmentsWithDate.push({
              equipmentId: reservation.equipmentsId, // Assuré que reservation.equipmentsId est défini
              departureDate: departureDate,
              departureHour: reservation.departHour,
              returnHour:reservation.returnHour,
              
            });
          } 
          return true; // Renvoyer true pour inclure cette réservation dans la liste des réservations futures
        } else {
          return false; // Renvoyer false pour exclure cette réservation de la liste des réservations futures
        }
      });
  
      this.tableauResultat = this.equipmentsWithDate; // Mise à jour de tableauResultat avec les données filtrées

      

// Afficher le tableau résultat
    console.log("tableauResultat",this.tableauResultat);



    this.equipmentService.getAllEquipments().subscribe((equipments: Equipments[]) => {
      console.log('Tous les équipements:', equipments);
      
      // Stockez les équipements dans la variable de classe equipments
      this.equipments = equipments;
console.log(this.equipments);

/*
const isDamagedOrUnderMaintenance = this.equipments.some(equipment => ['Damaged', 'Under maintenance'].includes(equipment.maintenance_status!));
this.disableReservationState = isDamagedOrUnderMaintenance;
this.disableReturned = isDamagedOrUnderMaintenance;
this.disableTaken = isDamagedOrUnderMaintenance;
this.disableDescription = isDamagedOrUnderMaintenance;*/

const isOperational = this.equipments.every(equipment => equipment.maintenance_status === 'Operational');
if (isOperational) {
  this.disableReservationState = false;
  this.disableReturned = false;
  this.disableTaken = false;
  this.disableDescription = false;
} else {
  this.disableReservationState = true;
  this.disableReturned = true;
  this.disableTaken = true;
  this.disableDescription = true;
}
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
    const equipmentId = element.equipmentId;

    // Vérifier si l'ID de l'équipement est défini
    if (equipmentId !== null) {
      const date = element.departureDate;
      const departureTime = element.departureHour;
      const returnTime = element.returnHour;

      // Rechercher les données de l'équipement correspondant à cet ID, à cette date et à cette heure
      const equipmentDataForId = this.equipments.find(equipment => equipment.id === equipmentId );

      // Vérifier si des données ont été trouvées
      if (equipmentDataForId) {
        // Ajouter les données trouvées au tableau final
        this.FinalEquipmentData.push({
          equipmentId: equipmentId,
          date: date,
          departureTime: departureTime,
          returnTime: returnTime,
          equipmentData: equipmentDataForId
        });
      }
    }
  });
  this.FinalEquipmentData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Afficher les données finales
  console.log("finalEquipmentData", this.FinalEquipmentData);
}

onFieldChange(newValue: any, fieldName: string) {
  // Stockez la nouvelle valeur avec le nom du champ modifié
  console.log('Nouvelle valeur de', fieldName, ':', newValue);

  // Désactiver les autres champs si la condition est remplie
  if (fieldName === 'maintenance_status' && ['Under maintenance', 'Damaged'].includes(newValue)) {
    this.disableReservationState = true;
    this.disableReturned = true;
    this.disableTaken = true;
    this.disableDescription=true;
  } else if (fieldName === 'state' && newValue === 'Disabled') {
    this.disableReservationState = true;
    this.disableReturned = true;
    this.disableTaken = true;
    this.disableDescription=true;
  } else {
    // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
    this.disableReservationState = false;
    this.disableReturned = false;
    this.disableTaken = false;
    this.disableDescription=false;
  }

  // Vous pouvez stocker la nouvelle valeur dans un objet ou un tableau selon vos besoins
}

// Définir des variables de contrôle pour activer ou désactiver l'édition des champs

performAction(equipement: any) {
  // Mettez ici le code pour gérer l'action pour l'équipement spécifique
  const confirmation = window.confirm("Are you sure you want to perform this action?");
  
  // Vérifier si l'utilisateur a confirmé
  if (confirmation) {
    // Mettez ici le code pour gérer l'action pour l'équipement spécifique
    console.log("Action performed for equipment:", equipement);
  // Trouver l'index de l'équipement dans donneesEquipements
  const index = this.donneesEquipements.findIndex((e: any) => e.equipmentId === equipement.equipmentId);

  // Vérifier si l'index est valide
  if (index !== -1) {
    // Stocker l'ID de l'équipement
    const equipmentId = equipement.equipmentId;

    // Stocker les caractéristiques modifiées
    const modifiedCharacteristics = {
      // Ajoutez ici les caractéristiques modifiées que vous souhaitez stocker
      // Par exemple, si vous souhaitez stocker la quantité modifiée
      quantity: equipement.equipmentData.quantity,
      maintenance_status:equipement.equipmentData.maintenance_status,
      description:equipement.equipmentData.description,
      reservation_State:equipement.equipmentData.reservation_State,
      returned:equipement.equipmentData.returned,
      taken:equipement.equipmentData.taken,
      state:equipement.equipmentData.state
      // Ajoutez d'autres caractéristiques modifiées si nécessaire
    };
   
  
    // Faites quelque chose avec l'ID de l'équipement et les caractéristiques modifiées
    console.log("ID de l'équipement modifié:", equipmentId);
    console.log("Caractéristiques modifiées:", modifiedCharacteristics);
  } else {
    console.error("ID d'équipement non trouvé dans donneesEquipements.");
  }
  console.log("equiiiiiiiiiiiii",equipement.equipmentData);
  this.equipmentService.editEquipment(equipement.equipmentId, equipement.equipmentData).subscribe(response => {
    console.log('Mise à jour réussie', response);
}, error => {
    console.error('Erreur lors de la mise à jour', error);
});
}}

incrementQuantity(equipement: any) {
  equipement.equipmentData.quantity++;
}

decrementQuantity(equipement: any) {
  if (equipement.equipmentData.quantity > 0) {
    equipement.equipmentData.quantity--;
  }

}
































}