import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '@fnt-flsy/data-transfer-types';
import { ViewOrganizationRoleDto, ViewUser } from "@fnt-flsy/data-transfer-types";

@Component({
  selector: 'fnt-flsy-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
  user: ViewUser | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.usersService.getUserById(+userId).subscribe({
        next: (user: ViewUser) => {
          this.user = user;
        },
        error:
        (error: any) => {
          console.error('Error fetching user details:', error);
        }
    });
    }
  }

  goToListPage() {
    this.router.navigate(['/users']);
  }
}