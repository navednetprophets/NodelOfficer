import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'home-page',
    loadComponent: () =>
      import('./nodel-officer-details/nodel-officer-details.component').then(
        (comp) => comp.NodelOfficerDetailsComponent
      ),
  },
  {
    path: 'districtNodelOfficerDetails',
    loadComponent: () =>
      import('./district-nodel-officer-details-list/district-nodel-officer-details-list.component').then(
        (comp) => comp.DistrictNodelOfficerDetailsListComponent
      ),
  },

  {
    path: '**',
    redirectTo: '/home-page'
  }
];
