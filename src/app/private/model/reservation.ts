export interface Reservation{
    id? : number;
    name? : string;
    equipmentId? : number;
    roomId? : number;
    category? : string;
    subCategory? : string;
    departDate? : string;
    departHour? : string ;
    returnHour? : string;
    createdAt? : Date;
    updatedAt? : Date;
}