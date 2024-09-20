import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();

  showLoader() {
    this.isLoadingSubject.next(true);
  }

  hideLoader() {
    this.isLoadingSubject.next(false);
  }


}
