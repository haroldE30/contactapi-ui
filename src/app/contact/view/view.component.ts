import { AlertService } from './../../_services/alert.service';
import { CONTACT_TYPES } from './../../_shared/contact-types';
import { Contact } from 'src/app/_models/contact';
import { ContactService } from './../../_services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
    private route: ActivatedRoute
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
