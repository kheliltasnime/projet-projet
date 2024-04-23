import { Component } from '@angular/core';
import { Benefit } from '../../model/Benefit';
import { BenefitService } from '../../services/benefit.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-benefit',
  templateUrl: './benefit.component.html',
  styleUrls: ['./benefit.component.css']
})
export class BenefitComponent {

  benefitList: Benefit[] =[];
  
  constructor(
    private benefitService: BenefitService,
    private router: Router
  ){}
  ngOnInit(): void {
    this.displayBenefit();
  }

  displayBenefit() {
    this.benefitService.getAllBenefit().subscribe((res) => {
      this.benefitList = res;
      console.log(res);
    });
  }

  redirectToCategoryPage(category: string): void {
    // Rediriger vers la page spécifique en fonction de la catégorie du bénéfice
    if (category === 'Equipments') {
      this.router.navigate(['/benefit/equipments']);
    } else {
      this.router.navigate(['/benefit/rooms']);
    }
  }
}
