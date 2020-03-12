import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ApiService} from '../../../../../uilib/services';
import {log, NzMessageService} from 'ng-zorro-antd';
import {MasterdataExchangeRate} from '../../../../domain/exchangerate';
import {differenceInCalendarDays} from 'date-fns';

@Component({
  selector: 'app-exchangeratedetail',
  templateUrl: './exchangeratedetail.component.html',
  styleUrls: ['./exchangeratedetail.component.less']
})
export class ExchangeratedetailComponent implements OnInit {

  validateForm: FormGroup;

  @Input()
  exchangerate: MasterdataExchangeRate;

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
      currency: [{value: this.exchangerate.currency, disabled: this.readonly}, [Validators.required]],
      exchangeRate: [{value: this.exchangerate.exchangeRate, disabled: this.readonly}, [Validators.required]],
      endTime: [{value: this.exchangerate.endTime, disabled: this.readonly}, [Validators.required]],
      active: [{value: this.exchangerate.active, disabled: this.readonly}],
      startTime: [{value: this.exchangerate.startTime , disabled: this.readonly}, [Validators.required]]
    });
    if (!this.exchangerate.id) {
      return;
    }
  }

  submitForm = (event: any) => {
    event.preventDefault();
    const rawValue = {
      ...this.validateForm.getRawValue()
    };
    console.log("保存数据");
    console.log(rawValue);
    this.apiService.postJSON(`appbiz/masterdataExchangeRate/save`, {...this.exchangerate, ...rawValue}).subscribe(res => {
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
    this.afterSave.emit(this.exchangerate);
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.exchangerate.startTime) <0;
  };
}
