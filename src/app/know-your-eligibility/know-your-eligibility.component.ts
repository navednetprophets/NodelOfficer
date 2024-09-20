import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  ViewportScroller,
} from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonService } from '../services/common.service';
import { EncryptionDecryptionService } from '../services/encrytion-decryption.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  startWith,
  Subject,
} from 'rxjs';
import { GetYourInstituteComponent } from '../get-your-institute/get-your-institute.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertServiceService } from '../services/aleart.service';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from '../services/loader.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { ShowDocumentComponent } from '../show-document/show-document.component';

@Component({
  selector: 'app-know-your-eligibility',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioButton,
    MatRadioGroup,
    MatNativeDateModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './know-your-eligibility.component.html',
  styleUrl: './know-your-eligibility.component.css',
})
export class KnowYourEligibilityComponent implements OnInit {
  universityControl = new FormControl('');
  filteredUniversities!: Observable<any[]>;
  universityControl1 = new FormControl('');
  filteredUniversities1!: Observable<any[]>;
  currentYear: number;
  currentDateTime: string;

  formSubmit: FormGroup;
  myDate: Date = new Date(2024, 0, 1);
  minDate!: Date;
  maxDate!: Date;
  stateList: Array<any> = [];
  genderList: Array<any> = [];
  scholarshipCategoryList: Array<any> = [];
  unSubscribeSubject: Subject<any> = new Subject();
  religionList: Array<any> = [];
  materialList: Array<any> = [];
  competitiveExamList: Array<any> = [];
  parentProfessionList: Array<any> = [];
  modeOfStudyList: Array<any> = [];
  preBoardUniversityList: any = [];
  captchaId: any;
  scheme_id: any;
  schemeFilter: any;
  lastFiveYears: any[] = [];
  c_course_level_id: any;
  getSchemeCriteriaData: any;
  newgetSchemeCriteriaData: Array<any> = [];
  listofSchemesHide: boolean = true;
  imageSource: any;
  communityList: Array<any> = [];
  value: any;
  showDivText: boolean = false;
  parentAliveList: Array<any> = [];
  c_institute_id: any;
  captchaCode: any;
  scholarshipCategoryCheck: any;
  getSchemeName: any;
  errorMessage: any;
  dropdownID: any;
  courselist: Array<any> = [];
  schemeList: Array<any> = [];
  errorannualFamilyIncome: string = '';
  courseLevelList: Array<any> = [];
  instituteId: any;
  noRecordFound: any;
  noRecordFound2: any;
  aishecode: any;
  checkInstructionList: boolean = true;
  checkSchemeCriteriaData: boolean = false;
  yearDropdown: any[] = [];
  courselistActive: boolean = false;
  showDivDropdown: boolean = false;
  id: any;
  isGenderFemale: boolean = false;
  constructor(
    private _dialog: MatDialog,
    private viewportScroller: ViewportScroller,
    private _fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    public commonservice: CommonService,
    public encryptionService: EncryptionDecryptionService,
    private _alert: AlertServiceService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private loaderService: LoaderService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.getPreBoardUniversity();
    this.formSubmit = this.getAllformControlls();
    this.generateCaptchaImage();
    this.lastFiveYears = this.generateLastFiveYears();
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
    this.minDate = new Date(1980, 0, 1);
    this.maxDate = new Date();
    // this.minDate = new Date(1990)
  }
  ngOnInit(): void {
    this.getstate();
    this.getGender();
    this.getScholarshipCategory();
    this.getReligion();
    this.getMarital();
    this.getCompetitiveExam();
    this.getParentProfession();
    this.getModeOfStudy();
    this.getCommunity();
    this.getParentsAlive();
    this.getScheme();
    this.initializeFilteredUniversities();
    this.initializeFilteredUniversities1();
    var data =
      "UABJTmiIqCqNxqS4CN0lzhQfeRNq3WHB4brBBe3fX2LrU/70TY4+1f9pJrJvfrVe";
    data = this.encryptionService.decrypt(data);
    data = JSON.parse(data);
    console.log("decryptedDATA==>", data)

  }

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();
  }

  generateLastFiveYears(): number[] {
    const currentYear3 = new Date().getFullYear();
    const yearsFive: any[] = [];
    for (let i = 0; i < 6; i++) {
      yearsFive.push(currentYear3 - i);
    }
    return yearsFive;
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
  getGender() {
    this.loaderService.showLoader();
    this.commonservice
      .getGenderList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.genderList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getScholarshipCategory() {
    this.loaderService.showLoader();
    this.commonservice
      .getScholarshipCategoryList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.scholarshipCategoryList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getReligion() {
    this.loaderService.showLoader();
    this.commonservice
      .getReligionList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.religionList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getMarital() {
    this.loaderService.showLoader();
    this.commonservice
      .getMaritalList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.materialList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getCompetitiveExam() {
    this.loaderService.showLoader();
    this.commonservice
      .getCompetitiveExamList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.competitiveExamList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getParentProfession() {
    this.loaderService.showLoader();
    this.commonservice
      .getParentProfessionList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.parentProfessionList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getModeOfStudy() {
    this.loaderService.showLoader();
    this.commonservice
      .getModeOfStudyList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.modeOfStudyList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getPreBoardUniversity() {
    this.loaderService.showLoader();
    this.commonservice
      .getPreBoardUniversityList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.preBoardUniversityList = JSON.parse(decryptedData);
            this.initializeFilteredUniversities();
            this.initializeFilteredUniversities1();
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getCommunity() {
    this.loaderService.showLoader();
    this.commonservice
      .getCommunityList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.communityList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getParentsAlive() {
    this.loaderService.showLoader();
    this.commonservice
      .getParentsAliveList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.parentAliveList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }

  getCourseLevelList() {
    this.loaderService.showLoader();
    this.commonservice
      .getCourseLevelList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.courseLevelList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }

  getScheme() {
    this.loaderService.showLoader();
    this.commonservice
      .getSchemeList()
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.schemeList = JSON.parse(decryptedData);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
  getMinistryList(id: any): Observable<any> {
    this.loaderService.showLoader();
    const format = { id: id };
    const parse = this.encryptionService.encrypt(format);

    // Return the observable from the service method
    return this.commonservice.getMinistry(parse).pipe(
      takeUntil(this.unSubscribeSubject),
      map((res: any) => {
        this.loaderService.hideLoader();
        if (res && res.data && res.data.length > 0) {
          const decryptedData = this.encryptionService.decrypt(res.data[0]);
          return JSON.parse(decryptedData);
        }
        return null; // Handle if no data is returned
      })
    );
  }

  commaQuoteValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const specialChars = ['/', '-'];
    let isValid = true;

    specialChars.forEach((char) => {
      const charCount = (value.match(new RegExp(`\\${char}`, 'g')) || [])
        .length;
      if (charCount > 2) {
        isValid = false;
      }
    });

    return isValid ? null : { specialChar: true };
  }

  selectScheme(event: any) {
    this.scheme_id = event.value;
  }

  checkGender(event: any) {
    if (event.value === 'F') {
      this.isGenderFemale = true;
      this.formSubmit.controls['isSingleGirlChild']?.addValidators([
        Validators.required,
      ]);
      this.formSubmit.controls['isSingleGirlChild']?.updateValueAndValidity();
    } else {
      this.formSubmit.controls['isSingleGirlChild']?.clearValidators();
      this.formSubmit.controls['isSingleGirlChild']?.updateValueAndValidity();
      this.isGenderFemale = false;
    }
  }

  checkDisability(event: any) {
    if (event.value === true) {
      this.formSubmit.controls['percentageOfDisabilty']?.addValidators([
        Validators.required,
      ]);
      this.formSubmit.controls[
        'percentageOfDisabilty'
      ]?.updateValueAndValidity();
    } else {
      this.formSubmit.controls['percentageOfDisabilty']?.clearValidators();
      this.formSubmit.controls[
        'percentageOfDisabilty'
      ]?.updateValueAndValidity();
    }
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  getAllformControlls() {
    return this._fb.group({
      d_state_id: ['', [Validators.required]],
      name: ['', [Validators.pattern('^[a-zA-Z]+(?: [a-zA-Z]+)*$')]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      isSingleGirlChild: [''],
      annual_family_income: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[-A-Za-z0-9-/]{1,25}$'),
          Validators.min(1),
        ]),
      ],
      parent_profession: ['', [Validators.required]],
      scheme_type_id: ['', [Validators.required]],
      scholarship_incentive: ['', [Validators.required]],
      c_course_id: ['', [Validators.required]],
      presentClassYr: ['', [Validators.required]],
      prevClassPercentage: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?!100\.)(100|[1-9]\d?)(\.\d{1,2})?$/),
        ],
      ],
      c_institute_id: ['', [Validators.required]],
      prevCourseYear: [''],
      prevBoardUniversity: [''],
      x_roll_no: [
        '',
        Validators.compose([
          Validators.pattern('^[-A-Za-z0-9-/]{1,25}$'),
          Validators.min(1),
          this.commaQuoteValidator,
        ]),
      ],
      xii_roll_no: [
        '',
        Validators.compose([
          Validators.pattern('^[-A-Za-z0-9-/]{1,25}$'),
          Validators.min(1),
          this.commaQuoteValidator,
        ]),
      ],
      xii_Board: [''],
      mode_of_study: ['', [Validators.required]],
      religion: ['', [Validators.required]],
      community: ['', [Validators.required]],
      isDisabled: ['', [Validators.required]],
      percentageOfDisabilty: [
        '',
        [Validators.pattern(/^(?!100\.)(100|[1-9]\d?)(\.\d{1,2})?$/)],
      ],
      maritalStatus: ['', [Validators.required]],
      parentsNotAlive: [''],
      competitiveRollno: [
        '',
        Validators.compose([
          Validators.pattern('^[-A-Za-z0-9-/]{1,25}$'),
          Validators.min(1),
          this.commaQuoteValidator,
        ]),
      ],
      competitiveExam: [''],
      competitiveExamYear: [''],
      stateComp: [''],
      captchaText: ['', Validators.required],
      scheme_name: [''],
      previousBoard: [],
      previousBoard1: [],
      scheme_filter_radio: [''],
    });
  }

  get dob() {
    return this.formSubmit.get('dob');
  }

  get submitformControll() {
    return this.formSubmit.controls;
  }

  submitFormData() {
    this.loaderService.showLoader();
    let payload = {
      d_state_id: +this.formSubmit.value.d_state_id,
      name: this.formSubmit.value.name,
      dob: this.datePipe.transform(
        this.formSubmit.value.dob as Date,
        'YYYY-MM-dd'
      ),
      gender: this.formSubmit.value.gender,
      isSingleGirlChild: this.formSubmit.value.isSingleGirlChild,
      annual_family_income: this.formSubmit.value.annual_family_income,
      parent_profession: +this.formSubmit.value.parent_profession,
      scheme_type_id: +this.formSubmit.value.scheme_type_id,
      scholarship_incentive: this.formSubmit.value.scholarship_incentive,
      c_institute_id: +this.c_institute_id,
      c_course_id: +this.formSubmit.value.c_course_id,
      presentClassYr: +this.formSubmit.value.presentClassYr,
      c_course_level: +this.c_course_level_id,
      prevClassPercentage: +this.formSubmit.value.prevClassPercentage,
      prevCourseYear: +this.formSubmit.value.prevCourseYear,
      prevBoardUniversity: parseInt(
        this.formSubmit.get('previousBoard')?.value
      ),
      x_roll_no: this.formSubmit.value.x_roll_no,
      xii_roll_no: this.formSubmit.value.xii_roll_no,
      xii_Board: parseInt(this.formSubmit.get('previousBoard1')?.value),
      mode_of_study: +this.formSubmit.value.mode_of_study,
      religion: +this.formSubmit.value.religion,
      community: +this.formSubmit.value.community,
      isDisabled: this.formSubmit.value.isDisabled,
      percentageOfDisabilty: +this.formSubmit.value.percentageOfDisabilty,
      maritalStatus: +this.formSubmit.value.maritalStatus,
      parentsNotAlive: +this.formSubmit.value.parentsNotAlive,
      competitiveRollno: this.formSubmit.value.competitiveRollno,
      competitiveExam: +this.formSubmit.value.competitiveExam,
      competitiveExamYear: +this.formSubmit.value.competitiveExamYear,
      stateComp: +this.formSubmit.value.stateComp,
    };
    let encryptpayload = this.encryptionService.encrypt(payload);
    this.commonservice
      .getSchemeCriteria(encryptpayload)
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe(
        (res) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            this.getSchemeCriteriaData = JSON.parse(decryptedData);
            this.newgetSchemeCriteriaData = this.getSchemeCriteriaData;

            if (this.newgetSchemeCriteriaData.length > 0) {
              const sCodesInRes = this.newgetSchemeCriteriaData.map(
                (item: any) => {
                  return item.s_code;
                }
              );
              const requests = sCodesInRes.map((code: number) =>
                this.getMinistryList(code)
              );

              forkJoin(requests).subscribe({
                next: (results: any[]) => {
                  results.forEach((data: any, index: number) => {
                    this.newgetSchemeCriteriaData[index].ministryName = data;
                  });
                },
                error: (error: any) => {
                  console.error('Error:', error);
                },
              });

              this.schemeList = this.schemeList.filter(
                (item) => !sCodesInRes.includes(Number(item.scheme_id))
              );
            }

            this.checkSchemeCriteriaData = true;
            this.checkInstructionList = false;
            this.noRecordFound = false;
            if (this.getSchemeCriteriaData != '') {
              this.listofSchemesHide = true;
              this.scrollToTop();
              // this._alert.swalPopSuccess("Scheme Available")
            } else {
              this.scrollToTop();
              // this._alert.swalPopErrorTimer('No schemes found based on your given criteria')
              this.listofSchemesHide = false;
              this.noRecordFound =
                'No schemes found based on your given criteria.';
            }
          } else if (res.status === 0 || res.data === null) {
            this._alert.swalPopError('No Record Found');
          } else {
          }
        },
        (err) => { }
      );
  }

  validateCaptcha() {
    if (this.formSubmit.invalid) {
      this._alert.swalPopError('Please Fill Required Fields');
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
            this.submitFormData();
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

  getCategoryVal(data: any) {
    this.scholarshipCategoryCheck = data.value;
    sessionStorage.setItem('prePost', data.value);
    if (this.scholarshipCategoryCheck === '2') {
      this.formSubmit.controls['presentClassYr']?.addValidators([
        Validators.required,
      ]);
      this.formSubmit.controls['presentClassYr']?.updateValueAndValidity();
    } else {
      this.formSubmit.controls['presentClassYr']?.clearValidators();
      this.formSubmit.controls['presentClassYr']?.updateValueAndValidity();
    }
  }
  openInstute() {
    const dialogRef = this._dialog.open(GetYourInstituteComponent, {
      width: '1300px',
      height: '700px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.instituteId = localStorage.getItem('item');
        this.instituteId = JSON.parse(this.instituteId);
        this.c_institute_id = this.instituteId?.data?.institutionId;
        const instituteDetails = `${this.instituteId?.data?.instituteName} ${this.instituteId?.data?.address}`;
        this.formSubmit
          .get('c_institute_id')
          ?.patchValue(instituteDetails, { emitModelToViewChange: true });
        this.aishecode = this.instituteId?.data?.aisheCode;

        this.formSubmit
          .get('c_institute_id')
          ?.patchValue(
            this.instituteId?.data?.instituteName +
            this.instituteId?.data?.address +
            '(' +
            this.instituteId?.data?.aisheCode +
            ')'
          );
        const data = {
          instituteId: this.instituteId?.data?.institutionId,
          prePostMatric: sessionStorage.getItem('prePost'),
        };
        this.getCourseList(data);
      }
    });
  }
  getCourseList(enc_data: any) {
    this.loaderService.showLoader();
    this.commonservice
      .getCourseList(this.encryptionService.encrypt(enc_data))
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res.status == 0) {
            this._alert.swalPopErrorTimer(
              'No course added by institute contact to Nodal Officer'
            );
            this.formSubmit.get('c_course_id')?.setValue('');
            this.formSubmit.get('presentClassYr')?.setValue('');
            this.courselist = [];
            this.yearDropdown = [];
          } else {
            if (res && res.data && res.data.length > 0) {
              var decryptedData = this.encryptionService.decrypt(res?.data[0]);
              this.courselist = JSON.parse(decryptedData);
              for (let i = 0; i < this.courselist.length; i++) {
                let courseId = parseInt(this.courselist[i].course_id, 10);
                if (courseId >= 1646 && courseId <= 1657) {
                  this.courselistActive = true;
                  return;
                }
              }
              this.courselistActive = false;

              this.generatedynamicYears();
            } else {
              console.error(
                'Error: Unable to decrypt data. Check if res and res.data are properly defined.'
              );
            }
          }
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }
  generatedynamicYears(): number[] {
    const id = 3;
    const currentYear1 = new Date().getFullYear();
    const years1: number[] = [];
    for (let i = 0; i <= this.id; i++) {
      years1.push(currentYear1 - 1);
    }
    return years1;
  }
  durationYear(data: any) {
    this.yearDropdown.splice(0, this.yearDropdown.length);
    for (let i = 1; i <= data; i++) {
      this.yearDropdown.push(i);
    }

    // Check if yearDropdown is empty
    if (this.yearDropdown.length === 1) {
    }
  }

  // get

  onSelectionChange(data: any) {
    this.dropdownID = data.value;
    const courseYear = this.courselist.filter((course) => {
      this.c_course_level_id = course.course_level_id;
      if (course.course_id == data.value) {
        this.durationYear(course.duration);
      }
    });

    if (parseInt(data.value) === 1646) {
      const previousClassCourseControl = this.formSubmit.get(
        'previousClassCourse1'
      );
      if (previousClassCourseControl) {
        // Reset the value of the control
        previousClassCourseControl.reset();

        // Patch the value to 'N/A'
        previousClassCourseControl.patchValue('N/A');
        this.formSubmit.get('previousClassCourse')?.patchValue(1);
      }
    }
    this.value = data.value;

    const previous = data.value - 1;
    if (
      (data.value >= '1647' && data.value <= '1657') ||
      data.value === '16571' ||
      data.value === '16572' ||
      data.value === '16573'
    ) {
      this.showDivText = true;
      this.showDivDropdown = false;
    } else {
      this.showDivText = false;
      this.showDivDropdown = true;
    }

    //for dropdown

    const mappedData = this.courselist.filter((course) => {
      if (sessionStorage.getItem('prePost') == '1') {
        if (course.course_id == previous) {
          this.formSubmit
            .get('previousClassCourse1')
            ?.patchValue(course.course_name);
          this.formSubmit
            .get('previousClassCourse')
            ?.patchValue(course.course_id);
        }
        if (data.value === '1646' || data.value == '0') {
          this.formSubmit.get('previousClassCourse')?.patchValue('N/A');
        }
        if (
          data.value == '16571' ||
          data.value == '16572' ||
          data.value == '16573'
        ) {
          this.formSubmit.get('previousClassCourse')?.patchValue('XI');
        }
      } else {
        if (data.value == '1647' || data.value <= '1657') {
          if (course.course_id == previous) {
            this.formSubmit
              .get('previousClassCourse1')
              ?.patchValue(course.course_name);
            this.formSubmit
              .get('previousClassCourse')
              ?.patchValue(course.course_id);
          }
          if (data.value == '1646' || data.value == '0') {
            this.formSubmit.get('previousClassCourse')?.patchValue('N/A');
          }
        }
        if (
          data.value == '16571' ||
          data.value == '16572' ||
          data.value == '16573'
        ) {
          this.formSubmit.get('previousClassCourse')?.patchValue('XI');
        }
      }
      // return course;
    });

    // Update form control with previous value
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
          console.error('Error occurred while fetching captcha image:', err);
          if (err && err.name === 'TimeoutError') {
            // Handle timeout error
            // Set an error message to display to the user
            this.errorMessage = 'Connection timed out. Please try again later.';
            this._alert.swalPopErrorTimer(this.errorMessage);
          } else {
            // Handle other errors
            // this.errorMessage = 'An error occurred while fetching captcha image. Please try again later.';
            // this._alert.swalPopErrorTimer(this.errorMessage);
          }
        },
      });
  }

  nonEligibilityCheck(formData: any) {
    if (this.scheme_id) {
      let payload = {
        scheme_id: +this.scheme_id,
        d_state_id: +formData.value.d_state_id,
        name: formData.value.name,
        dob: this.datePipe.transform(formData.value.dob as Date, 'YYYY-MM-dd'),
        gender: formData.value.gender,
        isSingleGirlChild: formData.value.isSingleGirlChild,
        annual_family_income: formData.value.annual_family_income,
        parent_profession: +formData.value.parent_profession,
        scheme_type_id: +formData.value.scheme_type_id,
        c_institute_id: +this.c_institute_id,
        c_course_id: +formData.value.c_course_id,
        presentClassYr: +this.formSubmit.value.presentClassYr,
        c_course_level: +this.c_course_level_id,
        prevClass: +formData.value.prevClass,
        prevClassPercentage: +formData.value.prevClassPercentage,
        prevCourseYear: +formData.value.prevCourseYear,
        prevBoardUniversity: parseInt(
          this.formSubmit.get('previousBoard')?.value
        ),
        x_roll_no: formData.value.x_roll_no,
        xii_roll_no: formData.value.xii_roll_no,
        xii_Board: parseInt(this.formSubmit.get('previousBoard1')?.value),
        mode_of_study: +formData.value.mode_of_study,
        religion: +formData.value.religion,
        community: +formData.value.community,
        isDisabled: formData.value.isDisabled,
        percentageOfDisabilty: +formData.value.percentageOfDisabilty,
        maritalStatus: +formData.value.maritalStatus,
        parentsNotAlive: +formData.value.parentsNotAlive,
        competitiveRollno: formData.value.competitiveRollno,
        competitiveExam: +formData.value.competitiveExam,
        competitiveExamYear: +formData.value.competitiveExamYear,
        stateComp: +formData.value.stateComp,
      };
      let encryptpayload = this.encryptionService.encrypt(payload);
      this.loaderService.showLoader();
      this.commonservice
        .nonEligiblityCheck(encryptpayload)
        .pipe(takeUntil(this.unSubscribeSubject))
        .subscribe({
          next: (res: any) => {
            this.loaderService.hideLoader();
            if (res && res.data && res.data.length > 0) {
              this.loaderService.hideLoader();
              var decryptedData = this.encryptionService.decrypt(res.data[0]);
              this.getSchemeName = JSON.parse(decryptedData);
            } else if (
              res == null ||
              res == '' ||
              res == undefined ||
              this.getSchemeName == ''
            ) {
              // this._alert.swalPopSuccess('you are eligible for this scheme');
              this.noRecordFound2 = 'You are eligible for this scheme';
            }
          },
          error: (error: any) => {
            console.error('Error:', error);
          },
        });
    } else {
      this._alert.swalPopError('Please select scheme type and scheme id');
    }
  }
  showdata(item: any) {
    let universityid = this.preBoardUniversityList?.filter(
      (res: any) => res.university_name === item.source.value
    );

    if (universityid.length > 0) {
      this.formSubmit
        .get('previousBoard')
        ?.patchValue(universityid[0].university_id);
    } else {
      console.warn('University not found');
    }
  }
  initializeFilteredUniversities() {
    this.filteredUniversities = this.universityControl.valueChanges.pipe(
      startWith(''),
      map((value: any) =>
        typeof value === 'string' ? value : value.university_name
      ),
      map((name: any) =>
        name
          ? this._filterUniversities0(name)
          : this.preBoardUniversityList.slice()
      )
    );
  }
  private _filterUniversities0(name: string): any[] {
    const filterValue = name.toLowerCase();
    const UniversityData = this.preBoardUniversityList?.filter(
      (option: any) =>
        option.university_name.toLowerCase().indexOf(filterValue) === 0
    );
    return UniversityData;
  }
  showdata1(item: any) {
    let universityid = this.preBoardUniversityList?.filter(
      (res: any) => res.university_name === item.source.value
    );

    if (universityid.length > 0) {
      this.formSubmit
        .get('previousBoard1')
        ?.patchValue(universityid[0].university_id);
    } else {
      console.warn('University not found');
    }
  }
  initializeFilteredUniversities1() {
    this.filteredUniversities1 = this.universityControl1.valueChanges.pipe(
      startWith(''),
      map((value: any) =>
        typeof value === 'string' ? value : value.university_name
      ),
      map((name: any) =>
        name
          ? this._filterUniversities0(name)
          : this.preBoardUniversityList.slice()
      )
    );
  }

  clearBoard() {
    this.formSubmit.get('prevBoardUniversity')?.reset();
    this.formSubmit.get('previousBoard')?.reset();
    this.universityControl.setValue('');
  }

  clearBoard12() {
    this.formSubmit.get('xii_Board')?.reset();
    this.formSubmit.get('previousBoard1')?.reset();
    this.universityControl1.setValue('');
  }

  schemeFilterRadio(event: any) {
    this.schemeFilter = this.schemeList.filter((item: any) => {
      return item.state_central == event.value;
    });
  }

  openDocumentPopup(id: any) {
    const format = { id: id };
    const parse = this.encryptionService.encrypt(format);
    this.loaderService.showLoader();
    this.commonservice
      .schemeWiseDocList(parse)
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next: (res: any) => {
          this.loaderService.hideLoader();
          if (res && res.data && res.data.length > 0) {
            var decryptedData = this.encryptionService.decrypt(res.data[0]);
            const documentList = (decryptedData = JSON.parse(decryptedData));
            this._dialog.open(ShowDocumentComponent, {
              width: '1300px',
              height: '700px',
              autoFocus: false,
              data: documentList,
            });
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }
}
