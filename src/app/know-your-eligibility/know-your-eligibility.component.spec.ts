import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowYourEligibilityComponent } from './know-your-eligibility.component';

describe('KnowYourEligibilityComponent', () => {
  let component: KnowYourEligibilityComponent;
  let fixture: ComponentFixture<KnowYourEligibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowYourEligibilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KnowYourEligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
