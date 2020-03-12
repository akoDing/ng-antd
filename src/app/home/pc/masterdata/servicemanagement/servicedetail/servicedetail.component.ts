import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../uilib/services';
import {log, NzMessageService} from 'ng-zorro-antd';
import {MasterdataServiceClass} from '../../../../domain/service';

@Component({
  selector: 'app-servicedetail',
  templateUrl: './servicedetail.component.html',
  styleUrls: ['./servicedetail.component.less']
})
export class ServicedetailComponent implements OnInit {

  validateForm: FormGroup;

  @Input()
  service: MasterdataServiceClass;

  @Input()
  readonly: boolean;

  @Output()
  afterSave = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private msg: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      catalog: [{value: this.service.catalog, disabled: this.readonly} , [Validators.required]] ,
      description: [{value: this.service.description, disabled: this.readonly} ,[Validators.required]] ,
      line: [{value: this.service.line, disabled: this.readonly}, [Validators.required]]
    });
    if (!this.service.id) {
      return;
    }
  }

  submitForm = (event: any) => {
    event.preventDefault();
    const rawValue = {
      ...this.validateForm.getRawValue()
    };
    this.apiService.postJSON(`appbiz/masterdataServiceClass/save`, {...this.service, ...rawValue}).subscribe(res => {
      if (res.success) {
        this.msg.success('提交成功！');
        this.afterSave.emit(true);
      } else {
        this.msg.error(res.result);
      }
    }, error => {
      this.msg.error(error);
    });
  };

  closeTabWithoutSave(event) {
    event.preventDefault();
    this.afterSave.emit(this.service);
  }

}
