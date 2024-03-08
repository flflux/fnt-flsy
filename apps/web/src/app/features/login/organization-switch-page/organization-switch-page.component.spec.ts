import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationSwitchPageComponent } from './organization-switch-page.component';

describe('OrganizationSwitchPageComponent', () => {
  let component: OrganizationSwitchPageComponent;
  let fixture: ComponentFixture<OrganizationSwitchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationSwitchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationSwitchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
