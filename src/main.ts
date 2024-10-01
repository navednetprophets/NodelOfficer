import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// console remove code
if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = function () { };
  }
}
if (environment.staging) {
  enableProdMode();
  if (window) {
    window.console.log = function () { };
  }
}