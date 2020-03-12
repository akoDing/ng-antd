import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ApiService, AuthService} from '../../../uilib/services';


@Injectable()
export class MenuService {

  menuData: any[] = [];
  menuDataAvailableSubject: Subject<boolean>;

  constructor(private apiService: ApiService, private authService: AuthService) {
    this.menuDataAvailableSubject = new Subject<boolean>();
  }

  refreshMenuData() {
    this.apiService.callApi(this.apiService.get('appbiz/action/loadActions'),
      (res: any) => {
        const {menu, button} = res.result;
        this.authService.setMenus(menu);
        this.authService.setButtons(button);
        this.fetchMenuData(false);
      }
    );
  }


  fetchMenuData(isMobile: boolean) {
    // let menuUrl = 'appbiz/getMenus';
    // if (isMobile) {
    //     menuUrl = 'appbiz/getMenus/mobile';
    // }

    // debugger;
    console.log('fetchMenuData.menuData RAW ->', this.menuData);
    let tmpMenuData = this.authService.getMenus();
    if (tmpMenuData && tmpMenuData.length > 0) {
      this.cleanArrChildren(tmpMenuData);
    }
    this.menuData = tmpMenuData;
    this.menuDataAvailableSubject.next(true);

    // this.apiService.callApi(this.apiService.get(menuUrl),
    //     (res: any) => {
    //         this.menuData = res.data;
    //         this.menuDataAvailableSubject.next(true);
    //     }
    // );
  }

  getMenuData() {
    return this.menuData;
  }

  cleanArrChildren(arr) {
    //step 1 -> sort by orderIndex
    arr = arr.sort((a, b) => a.indexof < b.indexof ? -1 : a.indexof > b.indexof ? 1 : 0);
    //step 2 -> if children's length is zero then delete it
    arr.forEach(el => {
      if (el['children'] && el['children'].length < 1) {
        el['children'] = undefined;
      } else if (el['children'].length > 0) {
        this.cleanArrChildren(el['children']);
      }
    });
  }

}

