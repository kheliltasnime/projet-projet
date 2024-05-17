import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NotifService ,AppNotification} from '../../services/notif.service';


export const userItems = [
  {
    icon: 'far fa-user',
    label: 'Profile'
  },
  {
    icon: 'far fa-cog',
    label: 'Settings'
  },
  {
    icon: 'far fa-unlock-alt',
    label: 'Lock screen'
  },
  {
    icon: 'far fa-power-off',
    label: 'Log out'
  },

]

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
 
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;

  notifications: AppNotification[] = [];
  userItems = userItems;

  ngOnInit(): void {
    this.chackCanShowSearchOverlay(window.innerWidth);
    this.loadNotifications();
  }
  constructor(private NotifService: NotifService) {}

  private loadNotifications(): void {
    this.NotifService.getNotifications().subscribe(
      (data: AppNotification[]) => {
        this.notifications = data;
        console.log("notiff",this.notifications);
      },
      (error) => {
        console.error('Erreur lors du chargement des notifications', error);
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event : any){
    this.chackCanShowSearchOverlay(window.innerWidth);
  }

  getHeadClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'head-trimmed';
    } else{
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  chackCanShowSearchOverlay(innerWidth: number): void{
    if(innerWidth <845){
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay= false;
    }
  }

}
