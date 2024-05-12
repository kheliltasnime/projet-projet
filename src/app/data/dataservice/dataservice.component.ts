
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/private/services/data.service'; 
@Component({
  selector: 'app-dataservice',
  templateUrl: './dataservice.component.html',
  styleUrls: ['./dataservice.component.css']
})
export class DataserviceComponent {
  equipementLePlusReserve: number = 0; // Initialisation par défaut
  nombreDeReservations: number = 0; // Initialisation par défaut

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getResults().subscribe(data => {
      this.equipementLePlusReserve = data.most_reserved_equipment_id;
      this.nombreDeReservations = data.num_reservations_most_reserved;
    });
  }
}
