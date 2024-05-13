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


  equipmentsWithDate: { equipmentId: number, departureDate: Date, departureHour: string, returnHour:string ,equipmentData:Equipments}[] = [];

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
  
      // Filtrer les réservations à partir de la date actuelle et concernant des équipements
      const futureReservations = reservations.filter(reservation => {
        if (!reservation.departDate || !reservation.departHour || !reservation.returnHour) {
          return false; // Exclure les réservations sans date de départ, heure de départ, heure de retour
        }
  
        if (reservation.category !== 'Equipments') {
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
        if (reservation.equipmentsId !== null && reservation.equipmentsId !== undefined) {
          const equipmentId: number = reservation.equipmentsId; // Assurez-vous que c'est un number
          this.equipmentService.getEquipmentsById(equipmentId).subscribe((equipment: Equipments) => {
            console.log('Équipement associé à la réservation:', equipment);
  
            // Assurez-vous que tous les champs requis sont présents
            if (reservation.departDate && reservation.departHour && reservation.returnHour) {
              const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
              const departureDate = new Date(year, month - 1, day);
  
              this.equipmentsWithDate.push({
                equipmentId: equipmentId, // Utilisez la variable temporaire qui est garantie d'être un number
                departureDate: departureDate,
                departureHour: reservation.departHour,
                returnHour: reservation.returnHour,
                equipmentData: equipment
              });
  
              console.log("equipmentsWithDate",this.equipmentsWithDate);
              // Vérifier si toutes les opérations asynchrones sont terminées
              if (this.equipmentsWithDate.length === futureReservations.length) {
                this.filterAndProcessData();
              }
            }
          });
        }
      });
  
    });
  
    // Récupérer tous les équipements
    this.equipmentService.getAllEquipments().subscribe((equipement: Equipments[]) => {
      console.log('Tous les equip:', equipement);
  
      // Stockez les équipements dans la variable de classe equipments
      this.equipments = equipement;
  
    
    });


  }
  
  
  filterAndProcessData() {
    // Utiliser loadFutureReservationsAndEquipments pour charger les données
  
      // Tableau pour stocker les données finales
    
  console.log("eeee");
console.log(this.tableauResultat);
console.log(this.equipments);
      // Parcourir chaque élément de tableauResultat
      this.equipmentsWithDate.forEach(element => {
        // Extraire l'ID de l'équipement
        const equipmentId = element.equipmentId;

        // Vérifier si l'ID de l'équipement est défini
        if (equipmentId !== null) {
          const date = element.departureDate;
          const departureTime = element.departureHour;
          const returnTime = element.returnHour;
  
          // Rechercher les données de l'équipement correspondant à cet ID, à cette date et à cette heure
          const equipmentDataForId = this.equipments.find(equipment => equipment.id === equipmentId );
  console.log(equipmentDataForId);
          // Vérifier si des données ont été trouvées
          if (equipmentDataForId) {
            equipmentDataForId.returned = "returned";
            equipmentDataForId.taken = "Not taken";
            equipmentDataForId.reservation_State = "Reserved";
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
  
      // Trier les données par date
      this.FinalEquipmentData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
      // Afficher les données finales
      console.log("Final Equipment Data", this.FinalEquipmentData);
    ;
  }
  
  

onFieldChange(newValue: any, fieldName: string) {
  // Stockez la nouvelle valeur avec le nom du champ modifié
  console.log('Nouvelle valeur de', fieldName, ':', newValue);

  // Désactiver les autres champs si la condition est remplie
  if (fieldName === 'maintenance_status' && ['Under maintenance', 'Damaged'].includes(newValue)) {
    this.disableReservationState = true;
    this.disableReturned = true;
    this.disableTaken = true;
  
    this.FinalEquipmentData.forEach((equipmentData: any) => {
      if (equipmentData.equipmentData && equipmentData.equipmentData.taken &&equipmentData.equipmentData.returned) {
        equipmentData.equipmentData.taken="Not taken";
        equipmentData.equipmentData.returned="returned";

       
      }
    });





  } else if (fieldName === 'state' && newValue === 'Disabled') {
    this.disableReservationState = true;
    this.disableReturned = true;
    this.disableTaken = true;
    
  } else {
    // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
    this.disableReservationState = false;
    this.disableReturned = false;
    this.disableTaken = false;
   
  }

  // Vous pouvez stocker la nouvelle valeur dans un objet ou un tableau selon vos besoins
}

// Définir des variables de contrôle pour activer ou désactiver l'édition des champs
performAction(equipement: any) {
  // Afficher une alerte de confirmation
  const confirmation = window.confirm("Are you sure you want to perform this action?");
  
  // Vérifier si l'utilisateur a confirmé
  if (confirmation) {
    // Vérifier si les champs Maintenance Status et Equipment State ont les valeurs nécessaires pour désactiver les autres champs
    if (
      (equipement.equipmentData.maintenance_status === 'Damaged' || equipement.equipmentData.maintenance_status === 'Under maintenance') &&
      equipement.equipmentData.state === 'Disabled'
    ) {
      // Désactiver les autres champs
      this.disableReservationState = true;
      this.disableReturned = true;
      this.disableTaken = true;
    
    } else {
      // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
      this.disableReservationState = false;
      this.disableReturned = false;
      this.disableTaken = false;
      
    }

    // Mettez ici le code pour gérer l'action pour l'équipement spécifique
    console.log("Action performed for equipment:", equipement);
console.log("**---------",this.donneesEquipements);
    // Trouver l'index de l'équipement dans donneesEquipements
    const index = this.FinalEquipmentData.findIndex((e: any) => e.equipmentId === equipement.equipmentId);

    // Vérifier si l'index est valide
    if (index !== -1) {
      // Stocker l'ID de l'équipement
      const equipmentId = equipement.equipmentId;

      // Stocker les caractéristiques modifiées
      const modifiedCharacteristics = {
        // Ajoutez ici les caractéristiques modifiées que vous souhaitez stocker
        // Par exemple, si vous souhaitez stocker la quantité modifiée
        quantity: equipement.equipmentData.quantity,
        maintenance_status: equipement.equipmentData.maintenance_status,
        reservation_State: equipement.equipmentData.reservation_State,
       
        state: equipement.equipmentData.state
        // Ajoutez d'autres caractéristiques modifiées si nécessaire
      };
    
      // Faites quelque chose avec l'ID de l'équipement et les caractéristiques modifiées
      console.log("ID de l'équipement modifié:", equipmentId);
      console.log("Caractéristiques modifiées:", modifiedCharacteristics);

      // Effectuez la mise à jour de l'équipement
      this.equipmentService.editEquipment(equipement.equipmentId, equipement.equipmentData).subscribe(response => {
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
  if (newValue === 'taken') {
      equipmentData.equipmentData.returned = 'Not returned';
  } else {
      equipmentData.equipmentData.returned = 'returned';
  }
}

updateOccupiedField(newValue: string, equipmentData: any) {
  if (newValue === 'returned') {
      equipmentData.equipmentData.taken = 'Not taken';
  } else {
      equipmentData.equipmentData.taken = 'taken';
  }
}


incrementQuantity(equipement: any) {
  equipement.equipmentData.quantity++;
}

decrementQuantity(equipement: any) {
  if (equipement.equipmentData.quantity > 0) {
    equipement.equipmentData.quantity--;
  }

}



}