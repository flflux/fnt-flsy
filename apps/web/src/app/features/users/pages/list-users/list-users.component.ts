import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { User } from '@fnt-flsy/data-transfer-types';
import { ListUserPage } from '@fnt-flsy/data-transfer-types';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from './../../components/add-user-dialog/add-user-dialog.component';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';

@Component({
  selector: 'fnt-flsy-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  users: MatTableDataSource<ListUserPage>;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageSize = 10;
  totalItems = 0;
  pageOffset = 0;
  emailFilter = '';
  firstNameFilter = '';
  lastNameFilter = '';
  private userAddedSubscription: Subscription | undefined;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private usersService: UsersService,
    private router: Router,

    private dialog: MatDialog
  ) {
    this.users = new MatTableDataSource<ListUserPage>([]);
  }

  ngOnInit() {
    this.loadUsers();

    this.userAddedSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/users/add') && this.userAddedSubscription) {
          this.userAddedSubscription.unsubscribe();
          this.loadUsers();
        }
      }
    });
  }
 
  ngOnDestroy() {
    if (this.userAddedSubscription) {
      this.userAddedSubscription.unsubscribe();
    }
  }

  loadUsers() {
    this.usersService
      .getUsers(
        this.pageSize,
        this.pageOffset,
        this.emailFilter,
        this.firstNameFilter,
        this.lastNameFilter,
        'firstName',
        'asc'
      )
      .subscribe({
        next: (users) => {
          this.users.data = users.content;
          this.totalItems = users.total;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '700px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((newUser) => {
      if (newUser) {
        this.loadUsers();
      }
    });
  }
  openEditUser(id:number): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: {id},
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        console.log('Edit dialog closed with result:', result);
        this.loadUsers();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageOffset = event.pageIndex;
    this.loadUsers();
  }

  onQueryChange() {
    this.pageOffset = 0;
    this.paginator.pageIndex = 0;
    this.loadUsers();
  }
  clearFirstNameFilter() {
    this.firstNameFilter = ''; 
    this.onQueryChange(); 
  }
  clearEmailFilter() {
    this.emailFilter = '';
    this.onQueryChange();
  }
  

  clearSearch() {
    this.emailFilter = '';
    this.pageOffset = 0;
    this.paginator.pageIndex = 0;
    this.onQueryChange();
  }
}
