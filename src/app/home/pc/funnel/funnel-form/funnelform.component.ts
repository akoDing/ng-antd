import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-funnelform',
  templateUrl: './funnelform.component.html',
  styleUrls: ['./funnelform.component.less']
})
export class FunnelFormComponent implements OnInit {

  validateForm: FormGroup;

  @Input()
  funnelInfo: any = {};

  serviceInfo: any = {};

  @Input()
  basicReadOnly: boolean = true;

  @Input()
  priceReadOnly: boolean = true;

  @Output()
  afterSave = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private msg: NzMessageService,
  ) {
  }

  ngOnInit(): void {

    let formControllerSet: any = {
      opportunityNo: [{value: this.funnelInfo.opportunityNo, disabled: this.basicReadOnly}],
      solution: [{value: this.funnelInfo.solution, disabled: this.basicReadOnly}],
      customerName: [{value: this.funnelInfo.customerName, disabled: this.basicReadOnly}],
      owner: [{value: this.funnelInfo.owner, disabled: this.basicReadOnly}],
      _12nc: [{value: this.funnelInfo._12nc, disabled: this.basicReadOnly}],
      requirement: [{value: this.funnelInfo.requirement, disabled: this.basicReadOnly}]
    };

    if (
      this.funnelInfo.status && this.funnelInfo.status != 'ONWORKING') {
      // this.apiService.getJson(`appbiz/funnel/queryService/${this.funnelInfo.id}`).subscribe(
      //   res => {
      //     this.msg.success('提交成功！');
      //     this.serviceInfo = res.result;
      //   }, error => {
      //     this.msg.error(error.result);
      //   });
      formControllerSet = {
        serviceType: [{value: null, disabled: this.priceReadOnly}],
        serviceLine: [{value: null, disabled: this.priceReadOnly}],
        servicePackage: [{value: null, disabled: this.priceReadOnly}],
        serviceName: [{value: null, disabled: this.priceReadOnly}],
        price_cny: [{value: null, disabled: this.priceReadOnly}],
        price_notax: [{value: null, disabled: this.priceReadOnly}],
        price_aftertax: [{value: null, disabled: this.priceReadOnly}],
        price_usd: [{value: null, disabled: this.priceReadOnly}],
        ...formControllerSet
      };
    }
    this.validateForm = this.fb.group(formControllerSet);
  }

  submitForm = (event: any) => {
    event.preventDefault();
    const rawValue = {
      ...this.funnelInfo,
      ...this.validateForm.getRawValue()
    };
    this.apiService.postJSON(`appbiz/funnel/save`, rawValue).subscribe(res => {
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
    this.afterSave.emit(this.funnelInfo);
  }

}
