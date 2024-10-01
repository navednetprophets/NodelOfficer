import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EncryptionDecryptionService } from './encrytion-decryption.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient, public _encService: EncryptionDecryptionService) { }

  getStateList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getMstStatesList`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getDistrictload(stateCode: any): Observable<any> {
    const requestBody = { filterCondition: { state_id: stateCode } };
    const encryptedRequestBody = this._encService.encrypt(requestBody);
    return this.http.post<any>(`${environment.nspApiUrl}getDistrictList`, { data: encryptedRequestBody });
  }

  getGenderList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getGender`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getScholarshipCategoryList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getScholarshipCategory`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getReligionList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getReligionLists`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getMaritalList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getMaritalStatusList`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getCompetitiveExamList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getCompetitiveExamList`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getParentProfessionList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getParentOccupationList`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getModeOfStudyList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}mst_course_type`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getPreBoardUniversityList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getUniversityList`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getCommunityList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getCategoryList`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getParentsAliveList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}parentsAliveList`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getSchemeList(): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getSchemeList`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getSchemeCriteria(payload: any): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}nsp/checkSchemeCriteria`, { data: payload })
  }

  nonEligiblityCheck(payload: any): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}nsp/nonEligiblityCheck`, { data: payload })
  }
  instituteName(data: any): Observable<any> {
    return this.http.post(`${environment.nspApiUrl}getInstituteNameList`, { data: data });
  }
  searchAisheCode(data: any, pre: any): Observable<any> {
    let payload = {
      state: '',
      district: '',
      aisheCode: data,
      page: '1',
      size: '100',
      prePostMatricValue: pre,
    };
    const stringpayload = payload;
    const encryptedRequestBody = this._encService.encrypt(stringpayload);
    return this.http.post(`${environment.nspApiUrl}getInstituteNameList`, { data: encryptedRequestBody });
  }

  searchudiseCode(data: any, pre: any): Observable<any> {
    let payload = {
      state: '',
      district: '',
      aisheCode: +data.value.udiseCode ? data.value.udiseCode : '',
      page: '1',
      size: '100',
      prePostMatricValue: pre,
    };
    const stringpayload = payload;
    const encryptedRequestBody = this._encService.encrypt(stringpayload);
    return this.http.post(`${environment.nspApiUrl}getInstituteNameList`, { data: encryptedRequestBody });
  }

  getCourseList(data: any) {
    return this.http.post(`${environment.nspApiUrl}getCourseList`, {
      // data: 'okYW+L+Y+lxwSPJd7veDrw==',
      data: data,
    });

    // {instituteId: '35030333469'}
  }
  getCoursePreList() {
    return this.http.post(`${environment.nspApiUrl}getCourseList`, {
      data: 'lcBNwpKzp8MW8642BtG0sA==',
      // data: data,
    });

    // {instituteId: '35030333469'}
  }

  getCourseLevelList() {
    return this.http.post(`${environment.nspApiUrl}getCourseLevelList`, {
      data: 'lcBNwpKzp8MW8642BtG0sA==',
      // data: data,
    });

    // {instituteId: '35030333469'}
  }
  GetCaptchaImage() {
    return this.http.get(`${environment.nspApiUrl}login/imageCaptcha`);
  }
  validateCaptcha(data: any): Observable<HttpResponse<any>> {
    return this.http.post(`${environment.nspApiUrl}login/verifyCaptcha`, data, { observe: 'response' });
    // return this.http.post('https://scholarships.gov.in/NspApiFresh/login/verifyCaptcha', data, { observe: 'response' })
  }

  getMinistry(data: any): Observable<any> {
    return this.http.post(`${environment.nspApiUrlFresh}nsp/getMinistryForScheme`, { data: data })
  }

  schemeWiseDocList(data: any) {
    return this.http.post(`${environment.nspApiUrlFresh}nsp/schemwisedoclist`, { data: data })
  }






  // Home Page Api's





  districtWiseNodalOfficerList(data: any) {
    return this.http.post(`${environment.nspHomePageApiUrl}getDistrictNodelOfficerDetailsList`, {
      data: data
    })
  }
  getMinistryList() {
    return this.http.post(`${environment.nspHomePageApiUrl}getMinistry`, { data: 'lcBNwpKzp8MW8642BtG0sA==' })
  }

  getMinistryWiseSchemeList(data: any) {
    return this.http.post(`${environment.nspHomePageApiUrl}getMinistryWiseScheme`, { data: data })
  }

  getSchemeWiseNodelOfficer(data: any) {
    return this.http.post(`${environment.nspHomePageApiUrl}getNodalOfficerDetails`, { data: data })
  }
}
