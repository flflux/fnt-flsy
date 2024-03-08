import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SitesRoutingModule } from './sites-routing.module';
import { SitesComponent } from './sites.component'; // Make sure to import SitesComponent
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ListSitesComponent } from './pages/list-sites/list-sites.component';
import { AddSiteComponent } from './pages/add-site/add-site.component';
import { ViewSiteComponent } from './pages/view-site/view-site.component';
import { EditSiteComponent } from './pages/edit-site/edit-site.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    ListSitesComponent,
    AddSiteComponent,
    ViewSiteComponent,
    EditSiteComponent,
    SitesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SitesRoutingModule,
    MatPaginatorModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
})
export class SitesModule {}
