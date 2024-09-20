import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-show-document',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    CommonModule,
    MatDialogContent
  ],
  templateUrl: './show-document.component.html',
  styleUrl: './show-document.component.scss'
})
export class ShowDocumentComponent implements OnInit {
  displayDocList: Array<any> = [];
  constructor(public _dialogRef: MatDialogRef<ShowDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  ngOnInit(): void {
    this.displayDocList = this.data

  }

}