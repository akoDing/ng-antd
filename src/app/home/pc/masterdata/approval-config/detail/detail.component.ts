import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ApiService, EnumService } from '../../../../../uilib/services';
import { ApprovalConfig, EnumEntity } from '../../../../domain';

@Component({
  selector: 'app-approval-config-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class ApprovalConfigDetailComponent implements OnInit {

  @Input()
  approvalConfig: ApprovalConfig;

  @Output()
  afterSave = new EventEmitter();

  validateForm: FormGroup;

  approvalTypeList: EnumEntity[] = [];
  needUploadList: EnumEntity[] = [];

  

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private apiService: ApiService,
    private enumService: EnumService
  ) { }

  ngOnInit() {
    //初始化审批类型select
    this.approvalTypeList = this.enumService.filterByParentName('approval_type');
    this.approvalTypeList.forEach(item => {
      if(item.name.indexOf('standard') > -1) {
        item['disabled'] = true;
      }
    });

    //初始化是否上传支持文件selet
    this.needUploadList = this.enumService.filterByParentName('need_file_upload');

    this.validateForm = this.fb.group({
      id: [this.approvalConfig.id],
      approvalName: [this.approvalConfig.approvalName, [Validators.required]],
      approvalType: [this.approvalConfig.approvalType, [Validators.required]],
      needUpload: [this.approvalConfig.needUpload, [Validators.required]],
      active: [this.approvalConfig.active || false]
    });
  }

  submitForm(event: any, value: any): void { //TODO
    event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      let data = { ...value };
      data['active'] = value.active ? true : false;
      data['deleted'] = value.deleted || false;
      console.log(data);

      const uri = 'appbiz/masterdataApprovalConfig/save';
      // const param = {rows:[data]}; 
      this.apiService.postJSON(uri, data).subscribe((res) => {
        console.log('masterdataApprovalConfig/save', res);
        if (res && res.success) {
          this.msg.success('Done.');
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
