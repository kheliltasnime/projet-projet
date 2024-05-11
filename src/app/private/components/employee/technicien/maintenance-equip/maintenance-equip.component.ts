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
  tableauResultat: { equipmentId: number , departureDate: Date, departureHour: string }[] = [];
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
      const equipmentsWithDate: { equipmentId: number, departureDate: Date, departureHour: string }[] = [];
  
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
            equipmentsWithDate.push({
              equipmentId: reservation.equipmentsId, // Assuré que reservation.equipmentsId est défini
              departureDate: departureDate,
              departureHour: reservation.departHour
            });
          }
          return true; // Renvoyer true pour inclure cette réservation dans la liste des réservations futures
        } else {
          return false; // Renvoyer false pour exclure cette réservation de la liste des réservations futures
        }
      });
  
      this.tableauResultat = equipmentsWithDate; // Mise à jour de tableauResultat avec les données filtrées

  

    // Afficher le tableau résultat
    console.log("tableauResultat",this.tableauResultat);
    this.equipmentService.getAllEquipments().subscribe((equipments: Equipments[]) => {
      console.log('Tous les équipements:', equipments);
      
      // Stockez les équipements dans la variable de classe equipments
      this.equipments = equipments;
console.log(this.equipments);
      // Appeler la méthode pour filtrer et traiter les données
      this.filterAndProcessData();// Vous pouvez maintenant utiliser la liste equipmentsWithDate pour stocker ou manipuler les données comme nécessaire
    });
  });
  // Déclaration d'un tableau pour stocker les données finales
}
// Déclaration d'un tableau pour stocker les données d'équipements correspondantes
filterAndProcessData() {
  const equipmentsMap: { [key: number]: Equipments } = {};

  // Pour chaque élément de tableauResultat, trouver l'équipement correspondant dans la table equipments
  this.tableauResultat.forEach(element => {
    // Vérifier si l'équipement a déjà été ajouté à equipmentsMap
    if (!equipmentsMap[element.equipmentId]) {
      // Trouver l'équipement correspondant dans la table equipments
      const equipementCorrespondant = this.equipments.find(equipement => equipement.id === element.equipmentId);

      // Vérifier si l'équipement correspondant a été trouvé
      if (equipementCorrespondant) {
        // Ajouter les informations de date et heure à l'équipement correspondant
        equipementCorrespondant.departDate = element.departureDate;
        equipementCorrespondant.departHour = element.departureHour;

        // Stocker l'équipement dans l'objet equipmentsMap avec son ID comme clé
        equipmentsMap[element.equipmentId] = equipementCorrespondant;
      } else {
        console.log(`L'équipement avec l'ID ${element.equipmentId} n'a pas été trouvé dans la table equipments.`);
      }
    }
  });

  // Créer un tableau de données d'équipements enrichi avec les dates de départ
  this.donneesEquipements = Object.keys(equipmentsMap).map(key => ({
    equipmentId: parseInt(key),
    equipmentData: equipmentsMap[parseInt(key)]
  }));

  // Afficher les données finales
  console.log("donne", this.donneesEquipements);
}






onFieldChange(newValue: any, fieldName: string) {
  // Stockez la nouvelle valeur avec le nom du champ modifié
  console.log('Nouvelle valeur de', fieldName, ':', newValue);
  // Vous pouvez stocker la nouvelle valeur dans un objet ou un tableau selon vos besoins
  
}

performAction(equipement: any) {
  // Mettez ici le code pour gérer l'action pour l'équipement spécifique
  console.log("Action performed for equipment:", equipement);
}



}