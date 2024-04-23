import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './private/components/employee/employee.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DetailsEmployeeComponent } from './private/components/employee/details-employee/details-employee.component';
import { SidebarComponent } from './private/shared/sidebar/sidebar.component';
import { HomeComponent } from './private/components/home/home.component';
import { DashboardComponent } from './private/components/dashboard/dashboard.component';
import { ChartsComponent } from './private/components/charts/charts.component';
import { CalendarComponent } from './private/components/calendar/calendar.component';
import { HistoryComponent } from './private/components/history/history.component';
import { BenefitComponent } from './private/components/benefit/benefit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './private/shared/header/header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { EquipmentsComponent } from './private/components/benefit/equipments/equipments.component';
import { RoomsComponent } from './private/components/benefit/rooms/rooms.component';
import { ReservationComponent } from './private/components/reservation/reservation.component';

import {MatSlideToggleModule} from  '@angular/material/slide-toggle' ;


@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    DetailsEmployeeComponent,
    SidebarComponent,
    HomeComponent,
    DashboardComponent,
    ChartsComponent,
    CalendarComponent,
   
    HistoryComponent,
    BenefitComponent,
    HeaderComponent,
    EquipmentsComponent,
    RoomsComponent,
    ReservationComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    OverlayModule,
    MatDialogModule,
    MatSlideToggleModule,
    CdkMenuModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
