import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(public loaderService: LoaderService,) { }
  ngOnInit(): void {

  }
  title = 'nodelOfficerDetails-project';
}

// export function noFutureDateValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Clear the time part of the date
//     const selectedDate = new Date(control.value);

//     if (selectedDate > today) {
//       return { noFutureDate: { value: control.value } };
//     }

//     return null;
//   };
// }
