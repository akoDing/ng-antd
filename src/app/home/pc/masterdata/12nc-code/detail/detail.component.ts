import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../../../uilib/services';
import {CostInfo} from '../../../../domain/cost-info';
import {EnumService} from '../../../../../uilib/services';
import {M12ncCode} from '../../../../domain/m12nc-code';

@Component({
  selector: 'app-12nc-code-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class M12ncCodeDetailComponent implements OnInit {

  @Input()
  ncCode: M12ncCode;



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
    this.entityId = this.ncCode ? this.ncCode.id : undefined;
    this.validateForm = this.fb.group({
      id: [this.ncCode.id],
      m12ncCode: [this.ncCode.m12ncCode, [Validators.required]],
      description: [this.ncCode.description, [Validators.required]],
      mag: [this.ncCode.mag, [Validators.required]],
      productHierarchy: [this.ncCode.productHierarchy, [Validators.required]],
      thirdParty: [this.ncCode.thirdParty, [Validators.required]],
      remarks: [this.ncCode.remarks, [Validators.required]]
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
      const uri = 'appbiz/masterdata12ncCode/save';
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
