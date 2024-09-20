import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictNodelOfficerDetailsListComponent } from './district-nodel-officer-details-list.component';

describe('DistrictNodelOfficerDetailsListComponent', () => {
  let component: DistrictNodelOfficerDetailsListComponent;
  let fixture: ComponentFixture<DistrictNodelOfficerDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictNodelOfficerDetailsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistrictNodelOfficerDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
