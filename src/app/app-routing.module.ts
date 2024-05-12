import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './private/components/employee/employee.component';

import { DashboardComponent } from './private/components/dashboard/dashboard.component';
import { ChartsComponent } from './private/components/charts/charts.component';
import { CalendarComponent } from './private/components/calendar/calendar.component';
import { HistoryComponent } from './private/components/history/history.component';
import { BenefitComponent } from './private/components/benefit/benefit.component';
import { RoomsComponent } from './private/components/benefit/rooms/rooms.component';
import { EquipmentsComponent } from './private/components/benefit/equipments/equipments.component';
import { ReservationComponent } from './private/components/reservation/reservation.component';
import { EditRoomComponent } from './private/components/benefit/rooms/edit/edit-room/edit-room.component';
import { PopupComponent } from './private/components/popup/popup.component';
import { PopiComponent } from './popi/popi/popi.component';
import { ListreservComponent } from './private/components/reservation/listreserv/listreserv.component';
import { LoginComponent } from './private/components/login/login/login.component';
import { TechnicienComponent } from './private/components/employee/technicien/technicien.component';
import { MaintenanceEquipComponent } from './private/components/employee/technicien/maintenance-equip/maintenance-equip.component';
import { MaintenanceRoomComponent } from './private/components/employee/technicien/maintenance-room/maintenance-room.component';
const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent,
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
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'reservation',
    component: ReservationComponent,
  },
  {
    path: 'tas',
    component: EditRoomComponent,
  },
  {
    path: 'equipments',
    component: EquipmentsComponent,
  },
  {
    path: 'equipments/:id',
    component: PopupComponent,
  },
  {
    path: 'rooms',
    component: EquipmentsComponent,
  },
  {
    path: 'rooms/:id',
    component: PopupComponent,
  },
  {
    path: 'employee/:id',
    component: PopiComponent,
  },
  {
    path: 'reservation/list',
    component: ListreservComponent,
  },
  {
    path:'technicien',
    component:TechnicienComponent,
  },
  {
    path:'technicien/maintenance-equipment',
    component:MaintenanceEquipComponent,
  },
  {
    path:'technicien/maintenance-room',
    component:MaintenanceRoomComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
