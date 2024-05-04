import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'; 
import { MatDialog } from '@angular/material/dialog';
import * as emailjs from 'emailjs-com';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public dialog: MatDialog) {}

  title = 'my_project';
  
  isSideNavCollapsed = false;
  screenWidth= 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }


}
