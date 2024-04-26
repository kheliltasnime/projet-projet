import { Component } from '@angular/core';
import { CalendarEvent, CalendarView,  } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  activeButton: string | undefined;
  activeDayIsOpen =false;

  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  constructor(){
    const event1 = {
      title: "Pc hp Reservation",
      start: new Date("2024-04-25T10:30"),
      end: new Date("2024-04-25T13:00"),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    }

    this.events.push(event1);
  }

  setView(view : CalendarView) {
    this.view = view;
  }

  dayClicked({date,events}: {date: Date; events: CalendarEvent[] }): void {
    if(isSameMonth(date, this.viewDate)){
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true ) || events.length === 0
      ) {
        this.activeDayIsOpen =false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventClicked(event : any){
    console.log(event);
  }
  eventTimesChanged(event: any){
    event.event.start = event.newStart;
    event.event.end = event.newEnd;
    this.refresh.next();
  }

}
