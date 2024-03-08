import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSitegroupComponent } from './add-sitegroup.component';

describe('AddSitegroupComponent', () => {
  let component: AddSitegroupComponent;
  let fixture: ComponentFixture<AddSitegroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSitegroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSitegroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
