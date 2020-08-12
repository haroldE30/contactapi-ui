import { CONTACT_TYPES } from './../../_shared/contact-types';
import { Communication } from './../../_models/communication';
import { Contact } from 'src/app/_models/contact';
import { ContactService } from './../../_services/contact.service';
import { STATES } from './../../_shared/states';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {
  contact:Contact = null;
  id: number;

  contactTypes = CONTACT_TYPES;

  communications = [];

  constructor(
    private idService: ContactService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.idService.getById(this.id)
      .subscribe(data => { 
        this.contact = data
      
        //group communication by type
        if (this.contact.communications) {
          this.contactTypes.forEach((ctype) => {
            this.contact.communications.forEach((comm) => {
              if (ctype.code === comm.type) {
                this.communications.push(comm);
              }
            })
          });
        }
      });
  }
}
