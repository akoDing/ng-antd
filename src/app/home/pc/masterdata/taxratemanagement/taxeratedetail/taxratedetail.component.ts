import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ApiService} from '../../../../../uilib/services';
import {log, NzMessageService} from 'ng-zorro-antd';
import {MasterdataTaxRate} from '../../../../domain/taxrate';
import {differenceInCalendarDays} from 'date-fns';

@Component({
  selector: 'app-taxratedetail',
  templateUrl: './taxratedetail.component.html',
  styleUrls: ['./taxratedetail.component.less']
})
export class TaxratedetailComponent implements OnInit {

  validateForm: FormGroup;

  @Input()
  taxrate: MasterdataTaxRate;

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
      taxRate: [{value: this.taxrate.taxRate, disabled: this.readonly}, [Validators.required]],
      endTime: [{value: this.taxrate.endTime, disabled: this.readonly}, [Validators.required]],
      // active: [{value: this.taxrate.active, disabled: this.readonly}],
      updateuser: [{value: this.taxrate.updateUser, disabled: this.readonly}],
      startTime: [{value: this.taxrate.startTime , disabled: this.readonly}, [Validators.required]]
    });
    if (!this.taxrate.id) {
      return;
    }
  }

  submitForm = (event: any) => {
    event.preventDefault();
    const rawValue = {
      ...this.validateForm.getRawValue()
    };
    // console.log("222");
    // console.log(rawValue);
    this.apiService.postJSON(`appbiz/masterdataTaxRate/save`, {...this.taxrate, ...rawValue}).subscribe(res => {
      if (res.success) {
        this.msg.success('提交成功！');
        this.afterSave.emit(true);
      } else {
        this.msg.error(res.result);
      }
    }, error => {
      this.msg.error(error);
    });
  }

  closeTabWithoutSave(event) {
    event.preventDefault();
    this.afterSave.emit(this.taxrate);
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.taxrate.startTime) < 0;
  }
}
