import { Contact } from './../../_models/contact';
import { ContactService } from './../../_services/contact.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockContactService: ContactService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      providers: [ DatePipe, TitleCasePipe ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockContactService = TestBed.inject(ContactService);
    mockContactService.getAll = jasmine.createSpy().and.returnValues(of([]));

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch contacts', () => {
    fixture.detectChanges();
    expect(mockContactService.getAll).toHaveBeenCalled();
  });

});
