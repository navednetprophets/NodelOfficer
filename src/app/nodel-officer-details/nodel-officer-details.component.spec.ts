import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodelOfficerDetailsComponent } from './nodel-officer-details.component';

describe('NodelOfficerDetailsComponent', () => {
  let component: NodelOfficerDetailsComponent;
  let fixture: ComponentFixture<NodelOfficerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodelOfficerDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NodelOfficerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
