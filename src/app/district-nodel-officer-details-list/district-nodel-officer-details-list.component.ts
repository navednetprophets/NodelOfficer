import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { CommonService } from '../services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncryptionDecryptionService } from '../services/encrytion-decryption.service';
import { AlertServiceService } from '../services/aleart.service';
import { CustomEncryptionDecryptionService } from '../services/custom-encryption-decryption.service';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-district-nodel-officer-details-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDatepickerModule,MatNativeDateModule],
  templateUrl: './district-nodel-officer-details-list.component.html',
  styleUrl: './district-nodel-officer-details-list.component.scss'
})
export class DistrictNodelOfficerDetailsListComponent implements OnInit {
  unSubscribe: Subject<any> = new Subject();
  stateList: Array<any> = [];
  districtWiseSchemeDetails: Array<any> = []
  district: any;
  currentDateTime: string;
  filterdDistrict: Array<any> = []
  currentYear: number;
  imageSource: any;
  tableData: boolean = false
  captchaCode: any;
  stateCode: any;
  districtCode: any;
  captchaId: any;
  unSubscribeSubject: Subject<any> = new Subject();
  formSubmit: FormGroup;
  constructor(private loaderService: LoaderService, private commonservice: CommonService, private sanitizer: DomSanitizer, private _fb: FormBuilder, public encryptionService: EncryptionDecryptionService, private _alert: AlertServiceService, private customEncryptionService: CustomEncryptionDecryptionService,  private datePipe: DatePipe,private dateAdapter: DateAdapter<Date>) {
    this.formSubmit = this.getAllformControlls();
    const now = new Date();
    this.currentYear = now.getFullYear();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.dateAdapter.setLocale('en-GB');
    this.currentDateTime = this.datePipe.transform(now, 'MMMM, yyyy') || 'Unknown Date';
  }
  ngOnInit(): void {
    this.generateCaptchaImage();
    this.getstate();
    const data = "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"
    const myData =  this.customEncryptionService.decrypt(data)
    // console.log("=-==>",JSON.parse(myData))
    // console.log(this.customEncryptionService.decrypt('Ful8iDGzBovYiCvAcbr1u6Qi8cuEI/6vu0KfFtInyuY='))
  }
  getAllformControlls() {
    return this._fb.group({
      state: [null, Validators.required],
      district: [null, Validators.required],
      captchaText: [null, Validators.required],
    })
  }


  getstate() {
    this.loaderService.showLoader();
    this.commonservice
      .getStateList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.stateList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  generateCaptchaImage() {
    this.loaderService.showLoader();
    this.commonservice
      .GetCaptchaImage()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res) {
            this.captchaId = res.data[0].captchaId;
            this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${res.data[0].captchaBytFile}`
            );
            this.captchaCode = res.data[0].captchaCode;
            this.formSubmit.get('captchaText')?.setValue('');
          } else {
          }
        },
        error: (err) => {

        },
      });
  }


  loadDistrct(event: any) {
    this.stateCode = event.target.value
    // console.log(this.stateCode)
    this.loaderService.showLoader();
    this.commonservice
      .getDistrictload(this.stateCode)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res.data && res.data.length > 0) {
            const jsonArray = JSON.parse(this.encryptionService.decrypt(res.data[0]));
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

  getDistrictId(event: any) {
    this.districtCode = event.target.value
    // console.log(this.districtCode)
  }

  submitForm() {
    this.loaderService.showLoader();
    if (this.formSubmit.valid) {
      const payload = {
        state_id: +this.stateCode,
        district_id: +this.districtCode
      }
      let encryptPayload = this.customEncryptionService.encrypt(payload)
      this.commonservice
        .districtWiseNodalOfficerList(encryptPayload)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe({
          next: (res: any) => {
            this.formSubmit.reset();
            this.generateCaptchaImage();
            this.loaderService.hideLoader();
            if (res.data) {
              const jsonArray = this.customEncryptionService.decrypt(res.data)
              const data = JSON.parse(jsonArray)
              this.districtWiseSchemeDetails = data
              this.tableData = true
              // console.log(this.districtWiseSchemeDetails)
            } else if (res.data == null && res.status == false) {
              this._alert.swalPopError(res.msg)
              this.generateCaptchaImage();
            } else {

            }
          },
          error: (error) => {
            console.error(error);
          },
        });

    } else {
      this._alert.swalPopError("Please Fill All Required Fields.")
    }

  }

  validateCaptcha() {
    if (this.formSubmit.invalid) {
      this._alert.swalPopError('Please Fill All Required Fields.');
      this.formSubmit.markAllAsTouched();
      return;
    }
    this.loaderService.showLoader();

    let payload = {
      captchaId: this.captchaId,
      captchaText: this.formSubmit.get('captchaText')?.value,
    };
    this.commonservice
      .validateCaptcha(payload)
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res.body.status === 1) {
            this.submitForm();
          } else {
            this._alert.swalPopError('Invalid Captcha');
            this.generateCaptchaImage();
          }
        },
        error: (error) => {
          console.error('Error:', error);
          if (error.status === 500) {
            this.loaderService.hideLoader();
            this._alert.swalPopError(error.error.msg);
          } else {
            this._alert.swalPopError(
              'An error occurred. Please try again later.'
            );
          }
        },
      });
  }

}
