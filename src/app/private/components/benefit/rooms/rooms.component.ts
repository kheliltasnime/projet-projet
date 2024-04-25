

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
  selectedRoom: Rooms | undefined;
  constructor(
    private RoomsService: RoomsService,private dialog:MatDialog
  ){}
  ngOnInit(): void {
    this.displayRooms();
  }

  displayRooms() {
    this.RoomsService.getAllRooms().subscribe((res) => {
      this.roomsList = res;
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
