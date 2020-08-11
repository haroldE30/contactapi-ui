import { SortableHeader, SortEvent, compare } from './sortable.directive';
import { Contact } from '../../_models/contact';
import { ContactService } from './../../_services/contact.service';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  contacts: Contact[] = [];

  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader>;

  constructor(
    private idService: ContactService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.idService.getAll()
    .subscribe(data => this.contacts = data);
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.load();
    } else {
      this.contacts = [...this.contacts].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  deleteId(id: number) {
    const iden:any = this.contacts.find((x:Contact) => x.id === id);
    iden.isDeleting = true; 

    this.idService.delete(id).pipe(first())
    .subscribe(
      res => {
        console.log('Contact deleted successfully.');
        this.contacts = this.contacts.filter((x:Contact) => x.id !== id);
      },
      error => {
        console.log('Failed to delete contact', error);
      }
    );
  }

}
