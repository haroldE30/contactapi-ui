import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ViewComponent } from './view/view.component';
import { ContactRoutingModule } from './contact-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortableHeader } from './list/sortable.directive';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ContactRoutingModule,
        NgbModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        ViewComponent,
        SortableHeader
    ]
})
export class ContactModule { }