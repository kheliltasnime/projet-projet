import { Component } from '@angular/core';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../model/reservation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  searchText: string = ''; 
  employeeList: Employee[] = [];
  filteredEmployeeList: Employee[] = [];
   reservations$: Observable<any[]> = new Observable<any[]>(); 
  
  constructor(private employeeService: EmployeeService,private reservationService:ReservationService){}
  
  ngOnInit(): void {
    this.displayEmployee();
  }

  search(): void {
    // Filtrer la liste d'employés en fonction du texte de recherche
    if (this.searchText.trim() === '') {
      // Si le champ de recherche est vide, réinitialiser filteredEmployeeList avec employeeList
      this.filteredEmployeeList = this.employeeList;
    } else {
      // Sinon, appliquer la recherche normalement
      this.filteredEmployeeList = this.employeeList.filter(employee => {
        // Vérifier si employee.firstName, employee.lastName et employee.email ne sont pas undefined
        const firstName = employee.firstName ? employee.firstName.toLowerCase() : '';
        const lastName = employee.lastName ? employee.lastName.toLowerCase() : '';
        const email = employee.email ? employee.email.toLowerCase() : '';
    
        // Rechercher le texte dans firstName, lastName et email
        return (
          firstName.includes(this.searchText.toLowerCase()) ||
          lastName.includes(this.searchText.toLowerCase()) ||
          email.includes(this.searchText.toLowerCase())
        );
      });
    }console.log('Filtered Employee List:', this.filteredEmployeeList);
  }

  displayEmployee() {
    this.employeeService.getAllEmployee().subscribe((res) => {
      this.employeeList = res;
      this.filteredEmployeeList = res; // Initialiser filteredEmployeeList avec la liste d'employés initiale
    });
  }

  selectedEmployee!: Employee;

  selectEmployee(employee: any) {
    this.selectedEmployee = employee;
    console.log(this.selectedEmployee);
  }
 // Méthode pour récupérer les réservations de l'employé sélectionné par son ID
 getReservationsByEmployeeId(employeeId: number) {
  this.reservations$ = this.reservationService.getAllReservations().pipe(
    map(reservations => reservations.filter(reservation => reservation.employeeId === employeeId))
  );console.log(map);
}



}
