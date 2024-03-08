import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditSitegroupComponent } from './edit-sitegroup.component';

describe('EditSitegroupComponent', () => {
  let component: EditSitegroupComponent;
  let fixture: ComponentFixture<EditSitegroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSitegroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSitegroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
