import { Component } from '@angular/core';
import { BenefitComponent } from '../benefit/benefit.component';
import { EquipmentsService } from '../../services/equipments.service';
import { RoomsService } from '../../services/rooms.service';
import { Equipments } from '../../model/equipments';
import { Rooms } from '../../model/rooms';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  reservationList: any[] = [];
  equipmentsList: Equipments[] =[];
  roomsList: Rooms[] =[];
  equipmentTypes: string[] = [];
  filteredEquipmentsList: Equipments[] = [];
  selectedCategory: string = '';
  //equipment: any;
  selectedEquipment: Equipments | null = null;
  constructor(
    private equipmentsService: EquipmentsService,
    private roomsService : RoomsService
  ){}

  ngOnInit(): void {
    this.displayEquipments();
    this.displayRooms();
    this.getEquipmentTypes();
  }
  getEquipmentTypes() {
    this.equipmentsService.getEquipmentTypes().subscribe((res) => {
      this.equipmentTypes = res;
      console.log(res);
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
  selectEquipment(equipment: Equipments) {
    this.selectedEquipment = equipment;
  }

  addToReservationList(selectedEquipment: Equipments) {
    if (selectedEquipment) {
      this.reservationList.push(selectedEquipment);
    }
  }

  search() {
    const category = (document.getElementById('category') as HTMLSelectElement).value;
  
    if (this.selectedCategory === 'Equipments') {
      // Effectuer une requête pour récupérer les équipements
      this.displayEquipments();
    } else if (this.selectedCategory  === 'Rooms') {
      // Effectuer une requête pour récupérer les chambres
      this.displayRooms();
    } else {
      // Gérer le cas où aucune catégorie n'est sélectionnée
      console.log('Please select a category');
    }
  }
  













}
