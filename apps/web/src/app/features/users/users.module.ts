import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { UsersComponent } from '../users/users.component';
import { UsersRoutingModule } from './users-routing.module';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UsersService } from './services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { AddUserDialogComponent } from './components/add-user-dialog/add-user-dialog.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    UsersComponent,
    AddUserDialogComponent,
    EditUserComponent,
    ViewUserComponent,
    ListUsersComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatSelectModule,
    MatTableModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
  ],

  providers: [UsersService],
})
export class UsersModule {}
