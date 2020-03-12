import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../../uilib/services';
import { EnumEntity, I18n } from '../../../domain';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-enum-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class EnumDetailComponent implements OnInit {

  @Input()
  enumEntity: EnumEntity;

  @Input()
  parentName: string;

  @Input()
  i18nList: I18n[];

  @Output()
  afterSave = new EventEmitter();

  validateForm: FormGroup;
  entityId: string
  namePrefix: string;

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private apiService: ApiService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    console.log('item', this.enumEntity);
    console.log('parent', this.parentName);


    if(this.parentName && '' !== this.parentName) {
      this.namePrefix = this.parentName + '::';
    }

    let i18nChinese = undefined;
    let i18nEnglish = undefined;
    if (this.i18nList && this.i18nList.length > 0) {
      for (const item of this.i18nList) {
        if ('zh' === item.locale) {
          i18nChinese = item.value;
        } else if ('en' === item.locale) {
          i18nEnglish = item.value;
        }
      }
    }
    this.entityId = this.enumEntity ? this.enumEntity.id : undefined;
    let nameSuffix = this.getNameSuffix(this.enumEntity.name);
    if(!this.namePrefix && this.entityId) {
      this.namePrefix = this.getNamePrefix(this.enumEntity.name);
    }
    this.validateForm = this.fb.group({
      id: [this.enumEntity.id],
      namePrefix: [{value:this.namePrefix, disabled:true}],
      nameSuffix: [nameSuffix, [Validators.required]],
      i18nChinese: [i18nChinese, [Validators.required]],
      i18nEnglish: [i18nEnglish, [Validators.required]],
      indexof: [this.enumEntity.indexof],
      display: [this.enumEntity.display],
    });

  }

  submitForm(event: any, value: any): void {
    event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      let data = { ...value };
      // data['active'] = value.active ? true : false;
      // data['deleted'] = value.deleted || false;
      data['indexof'] = (value.indexof || value.indexof === 0) ? value.indexof : 999;
      let name = value.nameSuffix;
      if(this.namePrefix) {
        name = this.namePrefix + name.replace(this.namePrefix, '');
      }
      data['name'] = name;

      if (this.enumEntity && this.enumEntity.parentKey) {
        data['parent'] = {
          id: this.enumEntity.parentKey
        }
      }
      
      data['display'] = data['display'] ? data['display'] : '';

      const uri = 'appbiz/i18n/save/' + 'net.mopos.admin.entity.EnumEntity';
      let i18nChinese: I18n = {};
      i18nChinese.value = value.i18nChinese;
      i18nChinese.locale = 'zh';

      let i18nEnglish: I18n = {};
      i18nEnglish.value = value.i18nEnglish;
      i18nEnglish.locale = 'en';

      let i18nList: any[] = [];
      i18nList.push(i18nChinese);
      i18nList.push(i18nEnglish);

      const param = {
        entity: data,
        i18nList: i18nList
      };

      console.log(param);
      // return;

      this.apiService.postJSON(uri, param).subscribe((res) => {
        if (res && res.success) {
          this.msg.success('Done.');
          this.translateService.reloadLang(this.translateService.currentLang || 'zh');
          setTimeout(() => {
            this.afterSave.emit(true);
          }, 500);
        } else {
          this.msg.error(res.result);
        }
      }, (err) => {
        this.msg.error('action failed.');
      });
    }
  }

  getNamePrefix(item: string) {
    let result = undefined;
    if(item) {
      const slicePos = item.lastIndexOf('::');
      if(slicePos > -1) {
        result = item.slice(0,slicePos + 2);
      }
    }
    console.log('getNamePrefix', result);
    return result;
  }

  getNameSuffix(item: string) {
    let result = item;
    if (result) {
      const slicePos = result.lastIndexOf('::');
      if (slicePos > -1) {
        result = result.slice(slicePos + 2);
      }
    }
    console.log('getNameSuffix', result);
    return result;
  }

  closeTabWithoutSave(event) {
    event.preventDefault();
    this.afterSave.emit(false);
  }

}
