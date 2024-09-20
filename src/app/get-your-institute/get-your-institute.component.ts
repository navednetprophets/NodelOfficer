import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRadioButton } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EncryptionDecryptionService } from '../services/encrytion-decryption.service';
import { CommonService } from '../services/common.service';
import { AlertServiceService } from '../services/aleart.service';
import { LoaderService } from '../services/loader.service';
import Swal from 'sweetalert2';


// Your component class definition
export interface PeriodicElement {
  institutionId: string;
  instituteName: string;
  aisheCode: string;
  state: any;
  district: any;
  address: any;
}
@Component({
  selector: 'app-get-your-institute',
  standalone: true,
  imports: [
    MatRadioButton,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './get-your-institute.component.html',
  styleUrl: './get-your-institute.component.scss',
})
export class GetYourInstituteComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['sn', 'aisheCode', 'instituteName', 'instituteState', 'instituteDistrict', 'address'];
  dataSource!: MatTableDataSource<any>;
  unSubscribe: Subject<any> = new Subject();
  state: any[] = [];
  district: any;
  filterdDistrict: any = [];
  formSubmit: FormGroup;
  list: any;
  filterbyData: string[] = [];
  payload: any;
  aisheCode: any;
  aisheCodeList: any[] = [];
  searchText: any;
  radioChecked: boolean = false;
  udiseCodeList: any[] = [];
  selectedItem: any;
  selectedRadioOption: any;
  length: number = 100;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  page: any;
  size: any;
  localData: any;
  pageIndex: number = 1;
  responseData: boolean = false;
  responseaAisheCode: boolean = false;
  responseaUdiseCode: boolean = false;
  districtName: any;
  instituteKycStatus: any;
  instituteKycStatusudise: any;
  instituteKycStatusaishes: any;
  stateName: any;
  // pageEvent: any = PageEvent;
  constructor(
    public _dialogRef: MatDialogRef<GetYourInstituteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private loaderService: LoaderService,
    private _router: Router,
    private _alert: AlertServiceService,
    private _encService: EncryptionDecryptionService,
    private _common: CommonService
  ) {
    this.formSubmit = this.getAllformControlls();
    this.localData = sessionStorage.getItem('prePost');
  }

  ngOnInit() {
    this.getStateMaster();
  }
  getAllformControlls() {
    return this._fb.group({
      state: [''],
      district: [''],
      instituteName: [''],
      aishecode: [''],
      udiseCode: [''],
    });
  }

  onInputChange(event: any) {
    let inputValue = event.target.value;
    let capitalizedValue = inputValue.toUpperCase();
    this.formSubmit.get('aishecode')?.setValue(capitalizedValue);
  }
  onInputChange1(event: any) {
    let inputValue = event.target.value;
    let capitalizedValue = inputValue.toUpperCase();
    this.formSubmit.get('instituteName')?.setValue(capitalizedValue);
  }

  get submitformControll() {
    return this.formSubmit.controls;
  }

  getValue(element: any) {
    if (element) {
      Swal.fire({
        title: element.instituteName,
        text: 'Do you want to select this institute?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        timerProgressBar: true,
      }).then((result) => {
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
          this.radioChecked = true;
          this.selectedRadioOption = element;
          this.getSelectedData();
        }
      });
    }
  }
  getSelectedData() {
    if (this.instituteKycStatusudise == true) {
      if (this.selectedRadioOption != '' && this.selectedRadioOption != null) {
        const data2 = { data: this.selectedRadioOption };
        localStorage.setItem('item', JSON.stringify(data2));
        this._dialogRef.close(true);
      } else {
        localStorage.removeItem('item');
      }
    } else if (this.instituteKycStatusaishes == true) {
      if (this.selectedRadioOption != '' && this.selectedRadioOption != null) {
        const data2 = { data: this.selectedRadioOption };
        localStorage.setItem('item', JSON.stringify(data2));
        this._dialogRef.close(true);
      } else {
        localStorage.removeItem('item');
      }
    } else if (this.instituteKycStatus == true) {
      if (this.selectedRadioOption != '' && this.selectedRadioOption != null) {
        const data2 = { data: this.selectedRadioOption };
        localStorage.setItem('item', JSON.stringify(data2));
        this._dialogRef.close(true);
      } else {
        localStorage.removeItem('item');
      }
    } else {
      this._dialogRef.close(true);
      this._alert.swalPopError(
        'Your institute has not completed the KYC; INO will not be able to verify the application unless he/ she completes the KYC.'
      );
    }
  }

  getStateMaster() {
    this.loaderService.showLoader();
    this.filterdDistrict = [];
    this._common
      .getStateList()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          const jsonArray = JSON.parse(this._encService.decrypt(res.data[0]));
          this.state = jsonArray;
          this.state = this.state.slice();
        },
      });
  }

  loadDistrct(stateCode: any) {
    this.loaderService.showLoader();
    this._common
      .getDistrictload(stateCode)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res.data && res.data.length > 0) {
            const jsonArray = JSON.parse(this._encService.decrypt(res.data[0]));
            this.filterdDistrict = jsonArray;
            this.district = this.filterdDistrict;
            this.filterdDistrict = this.district.slice();
          } else {
            console.error('No data found in the response');
          }
        },
        error: (error) => {
          console.error('Error occurred while fetching districts:', error);
        },
      });
  }

  searchName(data: any) {
    this.loaderService.showLoader();
    if (sessionStorage.getItem('prePost')) {
      let payload = {
        state: +data.value.state ? data.value.state : '',
        district: +data.value.district ? data.value.district : '',
        aisheCode: '',
        page: 0,
        size: 50000,
        prePostMatricValue: this.localData,
        instituteName: data.value.instituteName ? data.value.instituteName : '',
      };
      const stringpayload = payload;
      const encryptedRequestBody = this._encService.encrypt(stringpayload);
      this._common
        .instituteName(encryptedRequestBody)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe({
          next: (res: any) => {
            this.loaderService.hideLoader();
            if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
              const jsonArray = JSON.parse(this._encService?.decrypt(res.data[0]));
              this.instituteKycStatus = jsonArray[0]?.instituteKycstatus;
              const districtValue = this.districtName;
              const stateValue = this.stateName;
              this.list = jsonArray;
              this.getStateName(data.value.state);
              this.getDistrictName(data.value.district);
              this.list.forEach((listItem: any) => {
                listItem.districtName = districtValue;
                listItem.stateName = stateValue;
              });

              if (this.list) {
                this.responseData = true;
              }
              this.dataSource = new MatTableDataSource(this.list);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              console.error('Error: No record found.');
              this._alert.swalPopError('Error: No record found');
            }
          },
          complete: () => { },
        });
    } else {
      this._dialogRef.close(true);
      this._alert.swalPopError(
        'please select scholarship category.'
      );
    }


  }

  aisheCodeSearch(data: any) {
    this.loaderService.showLoader();
    this._common
      .searchAisheCode(data.controls.aishecode.value, this.localData)
      .pipe(takeUntil(this.unSubscribe))
      ?.subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            const jsonArray = JSON.parse(this._encService?.decrypt(res.data[0]));
            this.aisheCodeList = jsonArray;
            this.instituteKycStatusaishes = this.aisheCodeList[0]?.instituteKycstatus;
            if (this.aisheCodeList) {
              this.responseaAisheCode = true;
            }
          } else {
            console.error('Error: No record found.');
            this._alert.swalPopError('Error: No record found');
          }
        },
      });
  }

  udiseCodeSearch(data: any) {
    this.loaderService.showLoader();
    this._common
      .searchudiseCode(data, this.localData)
      .pipe(takeUntil(this.unSubscribe))
      ?.subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            const jsonArray = JSON.parse(this._encService?.decrypt(res.data[0]));
            this.udiseCodeList = jsonArray;
            this.instituteKycStatusudise = this.udiseCodeList[0]?.instituteKycstatus;

            if (this.udiseCodeList) {
              this.responseaUdiseCode = true;
            }
          } else {
            console.error('Error: No record found.');
            this._alert.swalPopError('Error: No record found');
          }
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDistrictName(districtId: any) {
    const selectedDistrict = this.filterdDistrict.find((item: { district_id: number }) => item.district_id === districtId);
    this.districtName = selectedDistrict ? selectedDistrict.district_name : 'None';
  }
  getStateName(stateId: any) {
    const selectedState = this.state.find((item: { state_id: number }) => item.state_id === stateId);
    this.stateName = selectedState ? selectedState.state_name : '';
  }
}
