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

  constructor(
    private idService: ContactService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.idService.getById(this.id)
      .subscribe(data => this.contact = data);
  
  }
}
