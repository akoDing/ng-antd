import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../../../uilib/services/api.service';
import { CommentTemplate, I18n } from '../../../../domain';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comment-template-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class CommentTemplateDetailComponent implements OnInit {

  @Input()
  commentTemplate: CommentTemplate;

  @Input()
  i18nList: I18n[];

  @Output()
  afterSave = new EventEmitter();

  validateForm: FormGroup;
  entityId: string;

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private apiService: ApiService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    console.log('comment template', this.commentTemplate);
    console.log('i18nList', this.i18nList);
    let i18nChinese = undefined;
    let i18nEnglish = undefined;
    if(this.i18nList && this.i18nList.length >0) {
      for (const item of this.i18nList) {
        if ('zh' === item.locale) {
          i18nChinese = item.value;
        } else if ('en' === item.locale) {
          i18nEnglish = item.value;
        }
      }
    }
    this.entityId = this.commentTemplate ? this.commentTemplate.id : undefined;
    this.validateForm = this.fb.group({
      id: [this.commentTemplate.id],
      name: [this.commentTemplate.name, [Validators.required]],
      i18nChinese: [i18nChinese, [Validators.required]],
      i18nEnglish: [i18nEnglish, [Validators.required]],
      orderIndex: [this.commentTemplate.orderIndex],
      active: [this.commentTemplate.active]
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
      data['active'] = value.active ? true : false;
      data['deleted'] = value.deleted || false;
      data['orderIndex'] = value.orderIndex ? value.orderIndex : 99;

      const uri = 'appbiz/i18n/save/' + 'com.philips.ps.entity.MasterdataCommentTemplate';
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

  closeTabWithoutSave(event) {
    event.preventDefault();
    this.afterSave.emit(false);
  }

}
