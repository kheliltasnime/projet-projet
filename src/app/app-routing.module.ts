import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './private/components/employee/employee.component';
import { DetailsEmployeeComponent } from './private/components/employee/details-employee/details-employee.component';
import { HomeComponent } from './private/components/home/home.component';
import { DashboardComponent } from './private/components/dashboard/dashboard.component';
import { ChartsComponent } from './private/components/charts/charts.component';
import { CalendarComponent } from './private/components/calendar/calendar.component';
import { HistoryComponent } from './private/components/history/history.component';
import { BenefitComponent } from './private/components/benefit/benefit.component';
import { RoomsComponent } from './private/components/benefit/rooms/rooms.component';
import { EquipmentsComponent } from './private/components/benefit/equipments/equipments.component';
import { ReservationComponent } from './private/components/reservation/reservation.component';

const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent,
  },
  {
    path: 'employee/:id',
    component:DetailsEmployeeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'charts',
    component: ChartsComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
  {
    path: 'benefit',
    component: BenefitComponent,
  },
  {
    path: 'benefit/equipments',
    component: EquipmentsComponent,
  },
  {
    path: 'benefit/rooms',
    component: RoomsComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'reservation',
    component: ReservationComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
