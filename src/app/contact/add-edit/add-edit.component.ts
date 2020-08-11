import { MyValidator } from './../../_shared/my-validator';
import { CustomDateParserFormatter } from './../../_services/custom-date-parser-formatter.';
import { Communication } from '../../_models/communication';
import { Address } from './../../_models/address';
import { CONTACT_TYPES } from './../../_shared/contact-types';
import { ADDRESS_TYPES } from './../../_shared/address-types';
import { STATES } from './../../_shared/states';
import { ContactService } from './../../_services/contact.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgbDateStruct, NgbDatepicker, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: number;

  isAddMode: boolean;
  loading = false;
  submitted = false;
  showAddAddress = true;
  showRemoveAddress = true;
  showAddContact = true;
  showRemoveContact = true;

  states = STATES;
  addressTypes = ADDRESS_TYPES;
  contactTypes = CONTACT_TYPES;

  contactErrorMessage = null;

  date = new Date();
  maxDate = { 
    year: this.date.getFullYear(), 
    month: this.date.getMonth() + 1, 
    day: this.date.getDate()};
  minDate = { year: 1930, month: 1, day: 1 };
  @ViewChild('d', { read: NgbDatepicker }) d: NgbDatepicker;

  constructor(
    private idService: ContactService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private dateFormatter: NgbDateParserFormatter,
    private validator: MyValidator
  ) { }
    
  public get f() {
    return this.form.controls;
  }

  public get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  public get communications(): FormArray {
    return this.form.get('communications') as FormArray;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;  
    this.isAddMode = !this.id;

    this.initForm();

    if (!this.isAddMode) {
      this.idService.getById(this.id)
        .subscribe(iden => {
          this.f.firstName.setValue(iden.firstName);
          this.f.lastName.setValue(iden.lastName);

          let dob = this.dateFormatter.parse(iden.dob);
          this.f.dob.setValue(dob);
          this.f.gender.setValue(iden.gender);
          this.f.title.setValue(iden.title);
          
          this.form.setControl('addresses', this.setAddressValue(iden.addresses));
          this.form.setControl('communications', this.setCommunicationValue(iden.communications));
        });
    }
  }

  initForm() {
    let dobModel: NgbDateStruct;
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      dob: [dobModel, Validators.required],
      gender: ['', Validators.required],
      addresses: this.fb.array(
        [this.newAddress()]),
      communications: this.fb.array(
        [this.newCommunication()])
    });

    this.clearDates();
  }

  setAddressValue(addresses: Address[]): FormArray {
    const aFormArray = new FormArray([]);
    addresses.forEach(add => {
      aFormArray.push(this.fb.group({
        id: add.id,
        type: add.type,
        number: add.number,
        unit: add.unit,
        street: add.street,
        city: add.city,
        zipCode: add.zipCode,
        state: add.state
      }));
    });
    return aFormArray;
  }

  setCommunicationValue(communications: Communication[]): FormArray {
    const cFormArray = new FormArray([]);
    communications.forEach(c => {
      cFormArray.push(this.fb.group({
        id: c.id,
        type: c.type,
        value: c.value,
        preferred: c.preferred
      }));
    });
    return cFormArray;
  }

  newAddress(): FormGroup {
    return this.fb.group({
      id: [''],
      type: ['', Validators.required],
      number: ['', Validators.required],
      unit: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      state: ['', Validators.required]
    });
  }

  newCommunication(): FormGroup {
    return this.fb.group({
      id: [''],
      type: ['', Validators.required],
      value: ['', Validators.required],
      preferred: ['']
    });
  }

  private clearDates(): void {
    this.f.dob.setValue(null);
  }

  addAddress() {
    if (this.addresses.length === this.addressTypes.length-1) {
      this.showAddAddress = false;
    }
    this.addresses.push(this.newAddress());
    this.showRemoveAddress = true;
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
    this.showAddAddress = true;
  }

  addContact() {
    if (this.communications.length === this.contactTypes.length-1) {
      this.showAddContact = false;
    }
    this.communications.push(this.newCommunication());
    this.showRemoveContact = true;
  }

  removeContact(index: number) {
    this.showAddContact = true;
    this.communications.removeAt(index);
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.contactErrorMessage = '';
    for (let c of this.communications.controls) {
      if (c.get('type').value === this.contactTypes[0].code &&
        !this.validator.emailValidator(c.get('value').value)) {
        this.contactErrorMessage = 'Enter a valid email.';
        c.get('value').setErrors({ 'incorrect': true });
        return;
      } else if (c.get('type').value === this.contactTypes[1].code &&
        !this.validator.mobileValidator(c.get('value').value)) {
        this.contactErrorMessage = 'Enter a valid format i.e +91-036-78658 or 91-036-78658';
        c.get('value').setErrors({ 'incorrect': true });
        return;
      } else if ((c.get('type').value === this.contactTypes[2].code ||
        c.get('type').value === this.contactTypes[3].code) &&
        !this.validator.phoneValidator(c.get('value').value)) {
        this.contactErrorMessage = 'Enter a valid format i.e 800-555-5555';
        c.get('value').setErrors({ 'incorrect': true });
        return;
      }
    }  

    this.loading = true;
    if (this.isAddMode) {
      this.createContact();
    } else {
      this.updateContact();
    }
    this.form.reset();
    this.addresses.clear();
    this.communications.clear();
  }

  changeContactType() {
    this.contactErrorMessage = '';
  }

  private createContact() {
    this.idService.create(this.form)
      .pipe(first())
      .subscribe(
        success => {
          console.error('Contact saved successfully.')
          this.router.navigate(['/contacts']);
        },
        error => {
          console.error(error);
          this.loading = false;
        }
      );
  }

  private updateContact() {
    this.idService.update(this.id, this.form)
      .pipe(first())
      .subscribe(
        success => {
          console.error('Contact updated successfully.')
          this.router.navigate(['/contacts']);
        },
        error => {
          console.error(error);
          this.loading = false;
        }
      );
  }

}
