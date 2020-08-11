import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const contactModule = () => import('./contact/contact.module').then(x => x.ContactModule);

const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'contacts', loadChildren: contactModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
