import { ContactService } from './../../_services/contact.service';
import { BrowserModule } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditComponent } from './add-edit.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddEditComponent', () => {
  let component: AddEditComponent;
  let fixture: ComponentFixture<AddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditComponent ],
      providers: [ DatePipe, TitleCasePipe, ContactService,
        { 
          provide: ActivatedRoute, 
          useValue: {
            snapshot: {
              params: of({id: 1})
            }
          } 
        },
        FormBuilder,
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        NgbModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('details fields validity', () => {
    let firstName = component.form.controls.firstName;
    expect(firstName.valid).toBeFalsy();
    expect(firstName.errors.required).toBeTruthy();

    let lastName = component.form.controls.lastName;
    expect(lastName.valid).toBeFalsy();
    expect(lastName.errors.required).toBeTruthy();
    
    let dob = component.form.controls.dob;
    expect(dob.valid).toBeFalsy();
    expect(dob.errors.required).toBeTruthy();

    let gender = component.form.controls.dob;
    expect(gender.valid).toBeFalsy();
    expect(gender.errors.required).toBeTruthy();

    let title = component.form.controls.dob;
    expect(title.valid).toBeFalsy();
    expect(title.errors.required).toBeTruthy();
  });

  it('address fields validity', () => {
    let afa = component.form.get('addresses') as FormArray;
    for (let a of afa.controls) {
      expect(a.get('type').valid).toBeFalsy();
      expect(a.get('type').errors.required).toBeTruthy();
      expect(a.get('number').valid).toBeFalsy();
      expect(a.get('number').errors.required).toBeTruthy();
      expect(a.get('unit').valid).toBeFalsy();
      expect(a.get('unit').errors.required).toBeTruthy();
      expect(a.get('street').valid).toBeFalsy();
      expect(a.get('street').errors.required).toBeTruthy();
      expect(a.get('city').valid).toBeFalsy();
      expect(a.get('city').errors.required).toBeTruthy();
      expect(a.get('zipCode').valid).toBeFalsy();
      expect(a.get('zipCode').errors.required).toBeTruthy();
      expect(a.get('state').valid).toBeFalsy();
      expect(a.get('state').errors.required).toBeTruthy();
    }
  });

  it('communication fields validity', () => {
    let cfa = component.form.get('communications') as FormArray;
    for (let c of cfa.controls) {
      expect(c.get('type').valid).toBeFalsy();
      expect(c.get('type').errors.required).toBeTruthy();
      expect(c.get('value').valid).toBeFalsy();
      expect(c.get('value').errors.required).toBeTruthy();
    }
  });

  it('submitting a form', () => {
    expect(component.form.valid).toBeFalsy();
    component.form.controls.firstName.setValue('test first');
    component.form.controls.lastName.setValue('test last');
    component.form.controls.dob.setValue('04/29/1977');
    component.form.controls.gender.setValue('F');
    component.form.controls.title.setValue('test');

    const aFormArray = new FormArray([]);
    aFormArray.push(new FormBuilder().group({
      type: 'home',
      number: '123',
      unit: '6a',
      street: 'street',
      city: 'angels',
      zipCode: '90210',
      state: 'CA'
    }));
    component.form.setControl('addresses', aFormArray);
    
    const cFormArray = new FormArray([]);
    cFormArray.push(new FormBuilder().group({
      type: 'home',
      value: '800-555-5678',
      preferred: false
    }));
    component.form.setControl('communications', cFormArray);

    expect(component.form.valid).toBeTruthy();
  });
});
