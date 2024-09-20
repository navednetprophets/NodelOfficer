import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetYourInstituteComponent } from './get-your-institute.component';

describe('GetYourInstituteComponent', () => {
  let component: GetYourInstituteComponent;
  let fixture: ComponentFixture<GetYourInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetYourInstituteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetYourInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
