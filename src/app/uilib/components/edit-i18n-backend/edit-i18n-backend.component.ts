import { Component, OnInit, Input, Output } from '@angular/core';
import { MockService } from '../../../home/services/common';
import { ApiService, AuthService } from '../../../uilib/services';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { I18n } from '../../../home/domain'; 
import { I18NHtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-edit-i18n-backend',
  templateUrl: './edit-i18n-backend.component.html',
  styleUrls: ['./edit-i18n-backend.component.less']
})
export class EditI18nBackendComponent implements OnInit {

  @Input()
  dictKey: string;

  @Input()
  className: string;

  @Input()
  entityId: string;

  isModalVisible: boolean = false;

  tmpForm: FormGroup;

  constructor(
    private mockService: MockService,
    private apiService: ApiService,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.tmpForm = this.fb.group({
    });

  }

  async openModal(event) {
    event.preventDefault();
    console.log('dictKey',this.dictKey);
    console.log('entityId: ', this.entityId);
    console.log('className: ', this.className);

    let englishI18n: I18n = {};
    let chineseI18n: I18n = {};
    
    if(this.entityId) {
      let res  = await this.getI18nList();
      console.log(res);

      if(res && res.success && res.result && res.result.length > 0) {
        for(const item of res.result) {
          if('zh' === item.locale) {
            chineseI18n = item;
          } else if ('en' === item.locale){
            englishI18n = item;
          }
        }
      }
    }

    this.tmpForm = this.fb.group({
      code: this.dictKey,
      chinese: [chineseI18n.value, [Validators.required]],
      chineseId: [chineseI18n.id],
      english: [englishI18n.value, [Validators.required]],
      englishId: [englishI18n.id]
    });

    this.isModalVisible = true;
  }

  async getI18nList() {

    const uri = 'appbiz/i18n/listByCode';
    const oid = this.entityId ? (this.className + ':' + this.entityId) : '';
    const param = {
      code: this.dictKey,
      oid: oid
    };

    return await this.apiService.postJSON(uri, param).toPromise();
  }

  handleOk() {
    console.log(this.tmpForm);
    for (const key in this.tmpForm.controls) {
      this.tmpForm.controls[key].markAsDirty();
      this.tmpForm.controls[key].updateValueAndValidity();
    }
    
    if(this.tmpForm.valid) {
      console.log(this.tmpForm.value);

      const formValue = this.tmpForm.value;

      let entity: any = {};
      entity['id'] = this.entityId;
      entity['name'] = this.dictKey;
      
      let i18nChinese: I18n = {};
      // i18nChinese.id = formValue.chineseId;
      i18nChinese.value = formValue.chinese;
      i18nChinese.locale = 'zh';
      // i18nChinese.identify = this.className + ':' + this.entityId;

      let i18nEnglish: I18n = {};
      // i18nEnglish.id = formValue.englishId;
      i18nEnglish.value = formValue.english;
      i18nEnglish.locale = 'en';
      // i18nEnglish.identify = this.className + ':' + this.entityId;

      let i18nList: any[] = [];
      i18nList.push(i18nChinese);
      i18nList.push(i18nEnglish);

      const param = {
        entity: entity,
        i18nList: i18nList
      };

      const uri = 'appbiz/i18n/save/' + this.className;
      console.log('uri', uri);
      console.log('param', param);

      this.apiService.callApi(this.apiService.postJSON(uri, param), res=> {

        console.log('res ->', res);
        if(res && res.success) {
          this.isModalVisible = false;
        }

      }, err => {
        console.log('error ->', err);
      });

    }
    return;

  }
  handleCancel(): void {
    this.isModalVisible = false;
  }

}
