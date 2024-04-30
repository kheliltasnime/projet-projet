export interface Reservation{
    id? : number;
    name? : string;
    equipmentsId? : number;
    roomsId? : number;
    category? : string;
    subCategory? : string;
    departDate? : string;
    departHour? : string ;
    returnHour? : string;
    createdAt? : Date;
    updatedAt? : Date;
}