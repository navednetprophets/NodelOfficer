import { Routes } from '@angular/router';


export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () =>
  //     import('./know-your-eligibility/know-your-eligibility.component').then(
  //       (comp) => comp.KnowYourEligibilityComponent
  //     ),
  // },

  // {
  //   path: '',
  //   loadComponent: () =>
  //     import('./ministry-wise-scheme-list/ministry-wise-scheme-list.component').then(
  //       (comp) => comp.MinistryWiseSchemeListComponent
  //     ),
  // },
  // {
  //   path: 'ministryWiseSchemeList',
  //   loadComponent: () =>
  //     import('./ministry-wise-scheme-list/ministry-wise-scheme-list.component').then(
  //       (comp) => comp.MinistryWiseSchemeListComponent
  //     ),
  // },
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
