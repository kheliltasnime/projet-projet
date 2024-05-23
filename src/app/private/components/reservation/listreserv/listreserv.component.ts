import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'; 
import { MatDialog } from '@angular/material/dialog';
import * as emailjs from 'emailjs-com';
import { Reservation } from 'src/app/private/model/reservation';
import { EmailService } from 'src/app/private/services/email.service';

import { NotifService,AppNotification } from 'src/app/private/services/notif.service';
@Component({
  selector: 'app-listreserv',
  templateUrl: './listreserv.component.html',
  styleUrls: ['./listreserv.component.css']
})
export class ListreservComponent {
  reservationState: any[] = [];
  selectedDate:string='';
  departureTime:string='';
  returnTime:string='';
data:any[]=[];

 //userName = localStorage.getItem('username');
 email = "kheliltasnime@gmail.com";
  constructor(public reservationService: ReservationService,
    private router: Router,private fb:FormBuilder,
    public emailService:EmailService,
    private NotifService: NotifService
   ) {}

  ngOnInit() {
    console.log("ahaya",this.reservationService.checkedItems);
  
   // hedhy feha date et heure  ili hiye checked
    this.reservationService.getReservationState().subscribe((data: any[]) => {
      // Mettez à jour la variable locale avec les données de l'état de réservation
      this.reservationState = data;
      this.data=data;
      console.log("norù*******",data);
    
     
    });
  }/*
  sendEmail() {
    const to: string[] = ['kheliltassnime@gmail.com']; // Adresse e-mail du destinataire
    const cc: string[] = ['kheliltassnime@gmail.com']; // Adresse e-mail en copie
    const subject = "Test Subject"; // Sujet du courriel
    const body = "This is a test email."; // Corps du courriel
  
    // Vérification si les adresses e-mail sont valides
    if (this.validateEmails(to) && this.validateEmails(cc)) {
        console.log("Email addresses are valid.");
        console.log("Data:", to, cc, subject, body);
        
        // Appel de la méthode d'envoi d'e-mail du service approprié
        this.emailService.sendEMail(to, cc, subject, body).subscribe({
            next: (response) => console.log(response),
            error: (error) => console.error(error)
        });
    } else {
        console.error('Invalid email address for to or cc.');
    }
}*/


notifications: AppNotification[] = [];

sendEmail() {
  const to: string[] = ['kheliltassnime@gmail.com']; // Adresse e-mail du destinataire
  const cc: string[] = ['kheliltasnime@gmail.com']; // Adresse e-mail en copie
  const subject = "Reservation "; // Sujet du courriel
  const body = "Dear [Recipient's Name],\n your Order Has Been Successfully Placed! \n Best regards, \n Admin"; 

  this.emailService.sendEmail(to, cc, subject, body).subscribe(
    response => {
      console.log('Email sent successfully', response);
      const newNotification: AppNotification = {
        date_envoi: new Date().toISOString().split('T')[0], // Date au format YYYY-MM-DD
        heure: new Date().toLocaleTimeString(), // Heure actuelle
        type: 'Email',
        titre: subject,
        message: body
      };
      this.NotifService.addNotification(newNotification).subscribe(
        notifResponse => {
          console.log('Notification stored successfully', notifResponse);
          this.notifications.push(notifResponse); // Ajouter la nouvelle notification à la liste
        },
        notifError => {
          console.error('Error storing notification', notifError);
        }
      );
    



    },
    error => {
      console.error('Error sending email', error);
    }
  );
}

// Méthode pour valider le format des adresses e-mail
validateEmails(emails: string[]): boolean {
    for (const email of emails) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            console.error('Invalid email address:', email);
            return false;
        }
    }
    return true;
}

  








  /*
  form :FormGroup=this.fb.group({
  
    to_name: this.userName ,
    
    from_name: '',
    from_email:'',
    subject:'',
    message:''
    });

async send(){
  emailjs.init('GDIu91oJLy4x2Qpry');
  let response =await emailjs.send("service_a7y27df","template_g4ch4ug",{
    from_name: 'Admin', // Remplacez par votre nom
    to_name: this.userName, // Remplacez par le nom du destinataire
    to_email: this.email
   , // Remplacez par votre adresse e-mail
    subject: 'Reservation', // Remplacez par le sujet du message
    message: 'Your Reservation is added successfully'
  }).then(response => {
    // Traitez la réponse si nécessaire
    alert('Message sent successfully!');
  }).catch(error => {
    // Traitez les erreurs si nécessaire
    console.error('Error sending message:', error);
    alert('An error occurred while sending the message.');
  });
}*/
  
 // Méthode appelée lors du clic sur le bouton de validation
 onAddMoreClicked(): void {
  this.reservationService.sendAddMoreClicked();
}
 validateReservation() {
 // const equipmentIds: number[] = [];
  // Parcourir tous les éléments vérifiés
  for (const item of this.reservationService.checkedItems) {
    // Extraire les informations nécessaires de l'objet 'item'
     this.selectedDate = item.selectedDate;
     this.departureTime = item.selectedDepartureTime;
     this.returnTime = item.selectedReturnTime;

    // Vérifier si l'élément possède les propriétés nécessaires
    if ('category' in item &&'type' in item && 'selectedDate' in item && 'selectedDepartureTime' in item && 'selectedReturnTime' in item && 'id' in item) {
      const category = item.category;
      const id = item.id;
      const subcategory=item.type;
      const selectedDate=this.selectedDate;
    ///  equipmentIds.push(id);
      // Maintenant, vous avez toutes les informations nécessaires pour chaque élément
      // Faites ce que vous devez faire avec ces informations, comme les envoyer à un service ou les traiter directement ici
      console.log('Selected Date:', this.selectedDate);
      console.log('Departure Time:', this.departureTime);
      console.log('Return Time:', this.returnTime);
      console.log('Category:', category);
      console.log('Subcategory:', subcategory);
      console.log('ID:', id);

      // Continuez à exécuter votre logique de validation ou d'autres opérations ici
    }
  }
   // Stocker les identifiants d'équipements dans la liste avant d'appeler la méthode 'addReservationFromCheckedItems'
  // console.log('Equipment IDs:', equipmentIds);// Appeler la méthode pour ajouter les réservations

  
  this.addReservationFromCheckedItems();
  this.reservationService.sendAddMoreClicked();
 // this.send();
 this.sendEmail();
  this.router.navigate(['/calendar']);
}

addReservationFromCheckedItems() {
  for (const item of this.reservationService.checkedItems) {
    const reservation: Reservation = {
      departDate: item.selectedDate,
      departHour: item.selectedDepartureTime,
      returnHour: item.selectedReturnTime,
      category: item.category,
      subCategory:item.type
    };
console.log("fi add fama ???????",reservation);//nnonn 
    // Vérifiez si la catégorie est "Equipments" ou "Rooms"
    if (item.category === 'Equipments') {
      reservation.equipmentsId = item.id;
    } else if (item.category === 'Rooms') {
      reservation.roomsId = item.id;
    }

    // Ajouter la réservation
    this.reservationService.addReservation(reservation).subscribe(
      (response) => {
        console.log('Reservation added successfully:', response);
      },
      (error) => {
        console.error('Error adding reservation:', error);
      }
    );
  }
   
}

showSuccessMessage() {
  alert('Reservation added successfully');
}

goBack() {

  console.log("f go back ------------",this.reservationState);
  this.reservationState=this.data;
this.reservationService.storeReservationState(this.reservationState);
 // Naviguer vers la page de réservation
  this.router.navigate(['/reservation']); // Remplacez '/previous-page' par le chemin de la page précédente
}
Back(){
  this.router.navigate(['/calendar']);
}












}