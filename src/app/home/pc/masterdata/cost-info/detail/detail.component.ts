import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../../../uilib/services';
import {CostInfo} from '../../../../domain/cost-info';
import {EnumService} from '../../../../../uilib/services';

@Component({
  selector: 'app-cost-info-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class CostInfoDetailComponent implements OnInit {

  @Input()
  costInfo: CostInfo;


  @Output()
  afterSave = new EventEmitter();

  validateForm: FormGroup;
  entityId: string;

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private apiService: ApiService,
    private enumService: EnumService
  ) { }

  ngOnInit() {
    this.entityId = this.costInfo ? this.costInfo.id : undefined;
    this.validateForm = this.fb.group({
      id: [this.costInfo.id],
      name: [this.costInfo.name, [Validators.required]],
      priceCn: [this.costInfo.priceCn, [Validators.required]],
      unit: [this.costInfo.unit, [Validators.required]],
      // status: [this.costInfo.status],
      active: [this.costInfo.active]
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
      const uri = 'appbiz/masterdataCostInfo/save';
      this.apiService.postJSON(uri, data).subscribe((res) => {
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
