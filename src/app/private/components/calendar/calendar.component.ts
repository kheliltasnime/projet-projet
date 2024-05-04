import { Component } from '@angular/core';
import { CalendarEvent, CalendarView,  } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { ValidatorFn,FormControl, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  activeButton: string | undefined;
  activeDayIsOpen =false;

  events: CalendarEvent[] = [];
  refresh = new Subject<void>();

  selectedDate: string='';
  selectedDepartureTime: string='';
  selectedReturnTime: string='';
  

  reservationForm: FormGroup;

  constructor(private router :Router ,private fb: FormBuilder){
    this.reservationForm = this.fb.group({  
      departureDate: [null, [Validators.required, this.futureDateValidator()]],
      departureTime: [null, [Validators.required, Validators.pattern('^08:[0-5][0-9]$|^09:[0-5][0-9]$|^1[0-7]:[0-5][0-9]$')]],
      returnTime: [null, [Validators.required, Validators.pattern('^08:[0-5][0-9]$|^09:[0-5][0-9]$|^1[0-7]:[0-5][0-9]$')]],
    }, { validators: this.timeRangeValidator() }); // Ajouter le validateur de plage d'heures
    
    const event1 = {
      title: "Pc hp Reservation",
      start: new Date("2024-04-25T10:30"),
      end: new Date("2024-04-25T13:00"),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    };
    this.events.push(event1);
    this.reservationForm.get('departureDate')?.valueChanges.subscribe(value => {
      this.selectedDate = value; // Mettre à jour selectedDate
      console.log('Departure date changed:', value);
    });

    // Écouteur d'événement de modification pour le champ 'departureTime'
    this.reservationForm.get('departureTime')?.valueChanges.subscribe(value => {
      this.selectedDepartureTime = value; // Mettre à jour selectedDepartureTime
      console.log('Departure time changed:', value);
    });

    // Écouteur d'événement de modification pour le champ 'returnTime'
    this.reservationForm.get('returnTime')?.valueChanges.subscribe(value => {
      this.selectedReturnTime = value; // Mettre à jour selectedReturnTime
      console.log('Return time changed:', value);
    });

    // Observateur de valeur pour tout le formulaire
    this.reservationForm.valueChanges.subscribe(formValue => {
      console.log('Form value changed:', formValue);
    });
  }

  ngOnInit(): void {
  //  this.reservationForm = this.fb.group({
    //  departureDate: ['', Validators.required],
     // departureTime: ['', Validators.required],
      //returnTime: ['', Validators.required]
    //});
  }
  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {
        const departureDate = control.get('departureDate')?.value;
        const departureTime = control.get('departureTime')?.value;
        const returnTime = control.get('returnTime')?.value;
  
        // Obtenir l'heure actuelle en Tunisie
        const currentDateTunisia = new Date().toLocaleString('en-US', { timeZone: 'Africa/Tunis' });
  
        if (departureDate && departureTime && returnTime) {
          // Convertir la date de départ en objet Date
          const selectedDepartureDate = new Date(departureDate);
  
          // Si la date de départ est aujourd'hui en Tunisie
          if (isSameDay(selectedDepartureDate, new Date(currentDateTunisia))) {
            // Convertir l'heure de départ en objet Date
            const selectedDepartureTime = new Date(`2000-01-01T${departureTime}`);
  
            // Obtenir l'heure actuelle en Tunisie
            const currentHour = new Date(currentDateTunisia).getHours();
            const currentMinute = new Date(currentDateTunisia).getMinutes();
  
            // Convertir l'heure actuelle en objet Date pour comparer avec l'heure de départ
            const currentTime = new Date(`2000-01-01T${currentHour}:${currentMinute}`);
  
            // Si l'heure de départ est dans le passé par rapport à l'heure actuelle en Tunisie
            if (selectedDepartureTime <= currentTime) {
              return { pastDepartureTime: true };
            }
          }
  
          // Vérifier si les heures sont dans l'intervalle spécifié (08:00 - 18:00)
          const departureHour = parseInt(departureTime.split(':')[0]);
          const returnHour = parseInt(returnTime.split(':')[0]);
  
          if (departureHour < 8 || returnHour > 18) {
            return { invalidTimeRange: true };
          }
  
          // Vérifier si l'heure de départ est avant l'heure de retour
          if (departureHour >= returnHour) {
            return { invalidTimeOrder: true };
          }
        }
      }
  
      return null;
    };
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
  // bech etsjel date w ethzni lel reservation
  navigateAndSave() {
    // Récupérer et afficher la valeur de la date de départ
   // Récupérer et afficher la valeur de la date de départ
this.selectedDate = this.reservationForm.get('departureDate')?.value;
console.log('Selected Departure Date:', this.selectedDate);

// Récupérer et afficher la valeur de l'heure de départ
this.selectedDepartureTime = this.reservationForm.get('departureTime')?.value;
console.log('Selected Departure Time:', this.selectedDepartureTime);

// Récupérer et afficher la valeur de l'heure de retour
this.selectedReturnTime = this.reservationForm.get('returnTime')?.value;
console.log('Selected Return Time:', this.selectedReturnTime);



// Formatter la date au format "jj-mm-aaaa"
const formattedDate = this.formatDate(this.selectedDate);
console.log('Selected Departure Daaaaaaaate:', this.selectedDate);



// Afficher les paramètres de requête avant la navigation
console.log('Navigating with query params:', {
    date: formattedDate,
    departureTime: this.selectedDepartureTime,
    returnTime: this.selectedReturnTime
});

// Naviguer vers la route /reservation avec les paramètres de requête
this.router.navigate(['/reservation'], {
    queryParams: {
        date: formattedDate,
        departureTime: this.selectedDepartureTime,
        returnTime: this.selectedReturnTime
    }
});
  
}
// Fonction de formatage de date
formatDate(dateString: string): string {
  // Utiliser une expression régulière pour extraire les parties de la date
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
      // Reformater la date dans le format "jj-mm-aaaa" en inversant l'ordre des composants
      return match[3] + '-' + match[2] + '-' + match[1];
  } else {
      // Retourner la date d'origine si le format n'est pas reconnu
      console.warn('Le format de date n\'est pas reconnu:', dateString);
      return dateString;
  }
}


  //bech etvalidi el modal 
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      if (selectedDate < currentDate) {
        return { invalidDate: true };
      }
      return null;
    };
  }



}