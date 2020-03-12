import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../uilib/services';
import {log, NzMessageService} from 'ng-zorro-antd';
import {MasterdataProductType} from '../../../../domain/producttype';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.less']
})
export class ProductdetailComponent implements OnInit {

  validateForm: FormGroup;

  @Input()
  producttype: MasterdataProductType;

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
      product: [{value: this.producttype.product, disabled: this.readonly} , [Validators.required]] ,
      description: [{value: this.producttype.description, disabled: this.readonly} , [Validators.required]]
    });
    if (!this.producttype.id) {
      return;
    }
  }

  submitForm = (event: any) => {
    event.preventDefault();
    const rawValue = {
      ...this.validateForm.getRawValue()
    };
    this.apiService.postJSON(`appbiz/masterdataProductType/save`, {...this.producttype, ...rawValue}).subscribe(res => {
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
    this.afterSave.emit(this.producttype);
  }

}
