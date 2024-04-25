import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';
import { EditRoomComponent } from './edit/edit-room/edit-room.component';
import { PopupComponent } from '../../popup/popup.component';
import { MasterService } from 'src/app/private/services/master.service';
import { Customer } from 'src/app/private/model/Customer';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  roomsList: Rooms[] =[];
  dataSource:any;

 

  constructor(private service: MasterService,
    private roomsService: RoomsService,private dialog:MatDialog
  ){}

  ngOnInit(): void {
    this.displayRooms();
  }

  displayRooms() {
    this.roomsService.getAllRooms().subscribe((res) => {
      this.roomsList = res;
      console.log(res);
    });
  }












}
