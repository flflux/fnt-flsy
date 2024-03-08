import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitegroupsComponent } from './sitegroups.component';

describe('SitegroupsComponent', () => {
  let component: SitegroupsComponent;
  let fixture: ComponentFixture<SitegroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SitegroupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SitegroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
