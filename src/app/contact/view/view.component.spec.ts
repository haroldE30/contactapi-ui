import { Address } from './../../_models/address';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ContactService } from './../../_services/contact.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComponent } from './view.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { Contact } from 'src/app/_models/contact';
import { Communication } from 'src/app/_models/communication';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;
  let mockContactService: ContactService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewComponent ],
      providers: [ DatePipe, TitleCasePipe,
        { 
          provide: ActivatedRoute, 
          useValue: {
            snapshot: {
              params: of({id: 1})
            }
          } 
        },
      ],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockContactService = TestBed.inject(ContactService);  

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch contact', () => {
    const address = <Address>{
      id: 1,
      type: 'home',
      number: '123',
      unit: '6a',
      street: 'hallway st',
      city: 'angels',
      zipCode: '90210',
      state: 'CA'
    };
    const comm = <Communication>{
      id: 1,
      type: 'home',
      value: '800-555-8555',
      preferred: true
    };
    const contact = <Contact>{
      id: 1,
      firstName: 'first',
      lastName: 'last',
      dob: '01/01/1970',
      gender: 'M',
      title: 'tester'
    };
    contact.addresses = [address];
    contact.communications = [comm];

    spyOn(mockContactService, 'getById').and.returnValue(of(contact));
    component.ngOnInit();

    fixture.detectChanges();
    expect(mockContactService.getById).toHaveBeenCalled();
  });
});
