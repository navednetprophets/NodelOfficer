import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryWiseSchemeListComponent } from './ministry-wise-scheme-list.component';

describe('MinistryWiseSchemeListComponent', () => {
  let component: MinistryWiseSchemeListComponent;
  let fixture: ComponentFixture<MinistryWiseSchemeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinistryWiseSchemeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinistryWiseSchemeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
