import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Address } from '../_models/address';
import { Communication } from '../_models/communication';
import { Contact } from '../_models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private casePipe: TitleCasePipe
  ) { }

  private handleError(response: HttpErrorResponse) {
    let errorMessage = 'Uknown Error';
    if (response.error instanceof ErrorEvent) {
      errorMessage = `Error: ${response.error.message}`;
    } else {
      errorMessage = `Error: ${response.status}\nMessage: ${response.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getAll() {
    return this.http.get<Contact[]>(`${environment.apiUrl}/contacts`)
      .pipe(catchError(this.handleError));
  }

  getById(id: number) {
    return this.http.get<Contact>(`${environment.apiUrl}/contacts/${id}`).pipe(catchError(this.handleError));
  }

  create(form: FormGroup) {
    let idn = this.buildId(form);
    return this.http.post(`${environment.apiUrl}/contacts`, idn).pipe(catchError(this.handleError));
  }

  update(id: number, form: FormGroup) {
    let idn = this.buildId(form);
    return this.http.put(`${environment.apiUrl}/contacts/${id}`, idn).pipe(catchError(this.handleError));
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/contacts/${id}`).pipe(catchError(this.handleError));
  }

  private buildId(form: FormGroup): Contact {
    let id = new Contact();
    
    id.firstName = this.formatCase(form.value.firstName);
    id.lastName = this.formatCase(form.value.lastName);
    id.dob = this.formatDate(form.value.dob);
    id.gender = form.value.gender;
    id.title = this.formatCase(form.value.title);

    id.addresses = this.buildAddresses(form);
    id.communications = this.buildContacts(form);

    return id;
  }

  private buildAddresses(form: FormGroup): Address[] {
    let adds = [];

    for (const address of form.value.addresses) {
      let add =  new Address();
      add.id = address.id;
      add.type = address.type;
      add.number = address.number;
      add.unit = address.unit;
      add.street = address.street;
      add.city = address.city;
      add.zipCode = address.zipCode;
      add.state = address.state;

      adds.push(add);
    }

    return adds;
  } 

  private buildContacts(form: FormGroup): Communication[] {
    let contacts = [];

    for (const contact of form.value.communications) {
      let c = new Communication();
      c.id = contact.id;
      c.type = contact.type;
      c.value = contact.value;
      c.preferred = contact.preferred;

      contacts.push(c);
    }
    
    return contacts;
  }

  private formatCase(value: string): string {
    return this.casePipe.transform(value);
  }

  private formatDate(date): string {
    let pattern = "MM/dd/yyyy";
    let d = new Date();
    d.setFullYear(date.year, date.month-1, date.day);
    return this.datePipe.transform(d, pattern);
  }
}
