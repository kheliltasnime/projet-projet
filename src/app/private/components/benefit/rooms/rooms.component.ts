

import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';
import { Component ,OnInit} from '@angular/core';

import { PopuupComponent } from 'src/app/popuup/popuup/popuup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  roomsList: Rooms[] =[];
  searchText: string = ''; 
  selectedRoom: Rooms | undefined;
  filteredRoomsList: Rooms[] = [];
  constructor(
    private RoomsService: RoomsService,private dialog:MatDialog
  ){}
  ngOnInit(): void {
    this.displayRooms();
  }
  
  search(): void {
    // Filtrer la liste d'employés en fonction du texte de recherche
    if (this.searchText.trim() === '') {
      // Si le champ de recherche est vide, réinitialiser filteredEmployeeList avec employeeList
      this.filteredRoomsList = this.roomsList;
    } else {
      // Sinon, appliquer la recherche normalement
      this.filteredRoomsList = this.roomsList.filter(room => {
        // Vérifier si employee.firstName, employee.lastName et employee.email ne sont pas undefined
        const location = room.location ? room.location.toLowerCase() : '';
        const name = room.name ? room.name.toLowerCase() : '';
        const reserved=room.reservation_State? room.reservation_State.toLowerCase():'';
        const free=room.free? room.free.toLowerCase():'';
        const occupied=room.occupied? room.occupied.toLowerCase():'';
        const type = room.type ? room.type.toLowerCase() : '';
    
        // Rechercher le texte dans firstName, lastName et email
        return (
          location.includes(this.searchText.toLowerCase()) ||
          name.includes(this.searchText.toLowerCase()) ||
          free.includes(this.searchText.toLowerCase()) ||
          occupied.includes(this.searchText.toLowerCase()) ||
          reserved.includes(this.searchText.toLowerCase()) ||
          type.includes(this.searchText.toLowerCase())
        );
      });
    }console.log('Filtered equipment List:', this.filteredRoomsList);
  }

  displayRooms() {
    this.RoomsService.getAllRooms().subscribe((res) => {
      this.roomsList = res;
       
      this.filteredRoomsList = res;
      console.log(res);
    });
  }

 

  selectRoom(Rooms : any ) {
    this.selectedRoom = Rooms;
  }
  

  addCustomer(roomId: number | null | undefined) {
    if (roomId !== null && roomId !== undefined) {
      this.openPopup(roomId);
    } else {
      console.error('No Room selected or ID is undefined');
    }
  }
  
  
  
  openPopup(roomId: number) {
    const dialogRef = this.dialog.open(PopuupComponent, {
      data: { roomId: roomId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.displayRooms();
    });
   
  }








}
