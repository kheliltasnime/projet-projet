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
import {MatSlideToggleModule} from  '@angular/material/slide-toggle';
import { EditRoomComponent } from './private/components/benefit/rooms/edit/edit-room/edit-room.component' ;
import { MatCardModule } from '@angular/material/card';
import { PopupComponent } from './private/components/popup/popup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PopuupComponent } from './popuup/popuup/popuup.component';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PopiComponent } from './popi/popi/popi.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Injectable } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DetailsModalComponent } from './private/components/benefit/equipments/details-modal/details-modal.component';

class CustomDateFormatter extends CalendarNativeDateFormatter{
  public override dayViewHour({ date,locale}: DateFormatterParams) : string{
    return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute: 'numeric'}).format(date);
  }

  public override weekViewHour({ date,locale}: DateFormatterParams) : string{
    return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute: 'numeric'}).format(date);
  }
}
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
    PopupComponent,
    HistoryComponent,
    BenefitComponent,
    HeaderComponent,
    EquipmentsComponent,
    RoomsComponent,
    ReservationComponent,
    EditRoomComponent,
    PopuupComponent,
    PopiComponent,
    DetailsModalComponent,
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    OverlayModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatSlideToggleModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    MatIconModule,
    CdkMenuModule,
    BrowserAnimationsModule,
    CdkMenuModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CdkMenuModule,
    OverlayModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    {provide: CalendarDateFormatter, useClass: CustomDateFormatter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
