import { Component, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { LoaderService } from '../services/loader.service';
import { CommonService } from '../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncryptionDecryptionService } from '../services/encrytion-decryption.service';
import { AlertServiceService } from '../services/aleart.service';
import { CustomEncryptionDecryptionService } from '../services/custom-encryption-decryption.service';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-nodel-officer-details',
  standalone: true,
  imports: [MatRadioModule, CommonModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './nodel-officer-details.component.html',
  styleUrl: './nodel-officer-details.component.scss'
})
export class NodelOfficerDetailsComponent implements OnInit {




  radioVal: any
  hideTableBtn: boolean = false
  ministry: boolean = true;
  scheme: boolean = false;
  state: boolean = false;
  district: boolean = false;
  zone: boolean = false;



  unSubscribe: Subject<any> = new Subject();
  formSubmit: FormGroup
  stateCode: any;
  zoneId: any;
  currentDateTime: string;
  districtId: any;
  ministryCode: any;
  filterdDistrict: Array<any> = []
  filterdScheme: Array<any> = []
  showTable: boolean = false;
  schemeId: any
  currentYear: number;
  stateList: Array<any> = [];
  ministryList: Array<any> = []
  ministryWiseNodalDetails: Array<any> = []
  imageSource: any;
  captchaCode: any;
  captchaId: any;
  unSubscribeSubject: Subject<any> = new Subject();
  constructor(private loaderService: LoaderService, private commonservice: CommonService, private sanitizer: DomSanitizer, private _fb: FormBuilder, public encryptionService: EncryptionDecryptionService, private _alert: AlertServiceService, private customEncryptionService: CustomEncryptionDecryptionService, private datePipe: DatePipe, private dateAdapter: DateAdapter<Date>) {
    this.formSubmit = this.getAllformControlls()
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
    this.getMinistry();
    // console.log(this.customEncryptionService.decrypt("GrOmcABtZn9quiqBeEa+1bSZhJoLi9Lk259VPr/3Lr8="))
  }

  getAllformControlls() {
    return this._fb.group({
      radioBtnVal: ['M'],
      ministry: [null],
      scheme: [null],
      state: [null],
      district: [null],
      zone: [null],
      captchaText: [null, Validators.required]

    })
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
          this.loaderService.hideLoader();
          console.error('Error:', error);
        },
      });
  }

  getMinistry() {
    this.loaderService.showLoader();
    this.commonservice
      .getMinistryList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            const jsonArray = this.customEncryptionService.decrypt(res.data)
            const data = JSON.parse(jsonArray)
            this.ministryList = data
          } else if (res.data == null && res.status == false) {
            this._alert.swalPopError(res.msg)
            // window.location.reload();
          }
        },
        error: (error: any) => {
          this.loaderService.hideLoader();
          console.error('Error:', error);
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
            // console.log(jsonArray)
            this.filterdDistrict = jsonArray;
          } else {
            console.error('No data found in the response');
          }
        },
        error: (error) => {
          this.loaderService.hideLoader();
          console.error('Error occurred while fetching districts:', error);
        },
      });


  }

  loadScheme(event: any) {
    this.ministryCode = event.target.value
    let payload = {
      "ministry_id": this.ministryCode
    }
    this.loaderService.showLoader();
    this.commonservice
      .getMinistryWiseSchemeList(this.customEncryptionService.encrypt(payload))
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res.data && res.data.length > 0) {
            const jsonArray = JSON.parse(this.customEncryptionService.decrypt(res.data));
            // console.log(jsonArray)
            this.filterdScheme = jsonArray;
            // console.log("===>myscheme",this.filterdScheme)
          } else if (res.data == null && res.status == false) {
            this._alert.swalPopError(res.msg)
          }
        },
        error: (error) => {
          console.error('Error occurred while fetching districts:', error);
        },
      });


  }

  validateCaptcha() {
    if (this.formSubmit.invalid) {
      this._alert.swalPopError('Please Fill Required Fields.');
      this.formSubmit.markAllAsTouched();
      return;
    } else {
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

  getDistrictId(event: any) {
    this.districtId = event.target.value
  }

  getSchemeId(event: any) {
    this.schemeId = event.target.value
    // console.log(this.schemeId)

  }

  getZoneID(event: any) {
    this.zoneId = event.target.value
    // console.log(this.zoneId)
  }

  submitForm() {
    // console.log("Form=>", this.formSubmit.value)
    this.loaderService.showLoader();
    const payload = {
      minStateDist: this.formSubmit.get('radioBtnVal')?.value,
      // minStateDist: this.radioVal,
      ministry_id: this.ministryCode,
      scheme_id: this.schemeId,
      state_id: this.stateCode,
      district_id: this.districtId,
      zone_ministry_id: this.zoneId,
    }
    // console.log("Payload", payload)
    const encryptPayload = this.customEncryptionService.encrypt(payload)
    // console.log(encryptPayload)
    this.commonservice
      .getSchemeWiseNodelOfficer(encryptPayload)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (res: any) => {
          // this.formSubmit.get('ministry')?.reset();
          // this.formSubmit.get('scheme')?.reset();
          // this.formSubmit.get('state')?.reset();
          // this.formSubmit.get('district')?.reset();
          // this.formSubmit.get('zone')?.reset();
          // this.generateCaptchaImage();
          // console.log("RES",res)
          this.loaderService.hideLoader();
          if (res.data) {
            const jsonArray = this.customEncryptionService.decrypt(res.data)
            const data = JSON.parse(jsonArray)
            this.ministryWiseNodalDetails = data
            this.showTable = true
            this.hideTableBtn = true
            // console.log("Finalk",this.ministryWiseNodalDetails)
          } else if (res.data === null && res.status === false) {
            this.showTable = false
            this._alert.swalPopError(res.msg)
            this.generateCaptchaImage();
          }
        },
        error: (error) => {
          console.log(error)
        },
      });
  }







  // external work 



  getRadioBtnVal(event: any) {
    this.radioVal = event.target.value
    if (this.radioVal == 'M') {
      this.ministry = true
      this.scheme = false
      this.state = false
      this.district = false
      this.zone = false
    } else if (this.radioVal == 'S') {
      this.ministry = true
      this.scheme = true
      this.state = true
      this.district = false
      this.zone = false
    } else if (this.radioVal == 'D') {
      this.ministry = true
      this.scheme = true
      this.state = true
      this.district = true
      this.zone = false
    } else if (this.radioVal == 'Z') {
      this.ministry = false
      this.scheme = false
      this.state = false
      this.district = false
      this.zone = true
    }
  }


  hideTable() {
    this.showTable = false
  }



}
