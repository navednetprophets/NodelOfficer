import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ministry-wise-scheme-list',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './ministry-wise-scheme-list.component.html',
  styleUrls: ['./ministry-wise-scheme-list.component.scss']
})
export class MinistryWiseSchemeListComponent implements OnInit, AfterViewInit {
  accordian: boolean = true;
  scheme: boolean = false;

  @ViewChild('rangeInput') rangeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bubble') bubble!: ElementRef<HTMLSpanElement>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.rangeInput && this.bubble) {
      this.setBubble(this.rangeInput.nativeElement, this.bubble.nativeElement);

      this.rangeInput.nativeElement.addEventListener('input', () => {
        this.setBubble(this.rangeInput.nativeElement, this.bubble.nativeElement);
      });
    }
  }

  showScheme() {
    this.accordian = false;
    this.scheme = true;
  }

  setBubble(range: HTMLInputElement, bubble: HTMLSpanElement) {
    const val = range.value;
    const min = range.min ? parseInt(range.min, 10) : 0;
    const max = range.max ? parseInt(range.max, 10) : 100;
    const newVal = ((+val - min) * 100) / (max - min);
    bubble.innerHTML = val;

    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  }
}
