import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { AddOrganizationComponent } from './pages/add-organization/add-organization.component';
import { OrganizationsComponent } from './organizations.component';
import { MatTableModule } from '@angular/material/table';
import { ListOrganizationsComponent } from './pages/list-organizations/list-organizations.component';
import { EditOrganizationComponent } from './pages/edit-organization/edit-organization.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator'; // Add this import
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrganizationsService } from './services/organizations.service';
import { RouterModule } from '@angular/router';
import { ViewOrganizationsComponent } from './pages/view-organizations/view-organizations.component';
import { DeleteConfirmationDialogComponent } from './pages/DeleteConfirmationDialog/delete-confirmation-dialog.component';

@NgModule({
  declarations: [
    ListOrganizationsComponent,
    AddOrganizationComponent,
    OrganizationsComponent,
    EditOrganizationComponent,
    ViewOrganizationsComponent,
    DeleteConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    OrganizationsRoutingModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatCardModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatToolbarModule,
    MatTableModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
