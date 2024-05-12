export interface Rooms{
    id? : number;
    name? : string;
    type? : string;
    location? : string;
   
    reservation_State?:string;
    description?:string;
    occupied?:string;
    free?:string;
    maintenance_status? : string;
    capacity? :number;
    createdAt? : Date;
    updatedAt? : Date;
    category?: string; // Ajouter la propriété category
  subcategory?: string; // Ajouter la propriété subcategory
  state?:string;
  benefit_id?:number | null;
  checked?: boolean;
  departHour: string; 
  departDate:Date;
  returnHour:string;
}