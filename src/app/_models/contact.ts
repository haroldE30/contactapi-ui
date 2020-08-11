import { Communication } from './communication';
import { Address } from './address';
export class Contact {
    id: number;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    title: string;
    addresses: Address[];
    communications: Communication[];
}
