import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListSitegroupsComponent } from './list-sitegroups.component';

describe('ListSitegroupsComponent', () => {
  let component: ListSitegroupsComponent;
  let fixture: ComponentFixture<ListSitegroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSitegroupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListSitegroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 