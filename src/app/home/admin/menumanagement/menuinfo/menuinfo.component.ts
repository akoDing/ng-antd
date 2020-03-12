import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SysMenu} from '../../../domain';
import {ApiService, AuthService} from '../../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';
import {MenuService} from '../../../services/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-menuinfo',
  templateUrl: './menuinfo.component.html',
  styleUrls: ['./menuinfo.component.less']
})
export class MenuinfoComponent implements OnInit {

  validateForm: FormGroup;

  @Input()
  menu: SysMenu;

  @Output()
  afterSave = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private msg: NzMessageService,
    private menuService: MenuService,
    private translateService: TranslateService
  ) {
    this.validateForm = this.fb.group({
      global: [{code: undefined, i18nList: []}, [Validators.required]],
      icon: [''],
      path: [''],
      sourceUrl: [''],
      button: [{value: false, disabled: false}],
      indexof: ['']
    });
  }

  ngOnInit(): void {
    this.apiService.postJSON('appbiz/i18n/listByCode', {
      code: this.menu.name,
      oid: `net.mopos.admin.entity.Action:${this.menu.id}`
    }).subscribe((res) => {
      if (res && res.success) {
        console.log(res);
        this.validateForm = this.fb.group({
          id: [this.menu.id],
          global: [{
            code: this.menu.name,
            i18nList: res.result
          }, [Validators.required]],
          icon: [this.menu.icon],
          path: [this.menu.path, [Validators.required]],
          sourceUrl: [this.menu.sourceUrl],
          button: [{value: this.menu.button, disabled: !this.menu.parent}],
          indexof: [this.menu.indexof],
        });
      } else {
        this.msg.error(res.data);
      }
    }, (err) => {
      this.msg.error('action failed.');
    });
  }

  submitForm = (event: any, value: any) => {
    event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const {global, ...rest} = value;
      const {code: name, i18nList} = global;
      let i18nData = {
        entity: !!this.menu.parentId ? {...rest, parent: {id: this.menu.parentId}, name} : {...rest, name},
        i18nList: i18nList
      };
      console.log('menu/save', i18nData);
      this.apiService.postJSON('appbiz/i18n/save/net.mopos.admin.entity.Action', i18nData).subscribe((res) => {
        if (res && res.success) {
          this.msg.success('Done.');
          //刷新国际化
          this.translateService.reloadLang(this.translateService.currentLang || 'zh');
          //刷新菜单
          this.menuService.refreshMenuData();
          setTimeout(() => {
            this.afterSave.emit(this.menu);
          }, 500);
        } else {
          this.msg.error(res.data);
        }
      }, (err) => {
        this.msg.error('action failed.');
      });
    }
  };

  closeTabWithoutSave(event) {
    event.preventDefault();
    this.afterSave.emit(this.menu);
  }

}
