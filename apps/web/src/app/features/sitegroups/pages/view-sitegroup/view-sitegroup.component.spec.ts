import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSitegroupComponent } from './view-sitegroup.component';

describe('ViewSitegroupComponent', () => {
  let component: ViewSitegroupComponent;
  let fixture: ComponentFixture<ViewSitegroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSitegroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSitegroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
