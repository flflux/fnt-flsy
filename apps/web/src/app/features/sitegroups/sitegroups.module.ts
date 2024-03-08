import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { SitegroupsRoutingModule } from './sitegroups-routing.module';
import { AddSitegroupComponent } from './pages/add-sitegroup/add-sitegroup.component';
import { EditSitegroupComponent } from './pages/edit-sitegroup/edit-sitegroup.component';
import { ListSitegroupsComponent } from './pages/list-sitegroups/list-sitegroups.component';
import { ViewSitegroupComponent } from './pages/view-sitegroup/view-sitegroup.component';
import { SitegroupsComponent } from './sitegroups.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    AddSitegroupComponent,
    EditSitegroupComponent,
    ListSitegroupsComponent,
    ViewSitegroupComponent,
    SitegroupsComponent,
  ],
  imports: [
    CommonModule,
    SitegroupsRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatFormFieldModule,
    MatPaginatorModule,
    FormsModule,
    MatIconModule,
    RouterModule,
    MatTableModule,
    MatAutocompleteModule,
    MatButtonModule,
  ],
})
export class SitegroupsModule {}
