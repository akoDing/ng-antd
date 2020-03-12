import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ControlValueAccessor} from '@angular/forms';
import {ApiService} from '../../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-funnel-service-list',
  templateUrl: './funnel-service-list.component.html',
  styleUrls: ['./funnel-service-list.component.less']
})
export class FunnelServiceListComponent implements OnInit, ControlValueAccessor {


  @Input()
  value: any[] = [];

  @Input()
  formControlName: string;

  @Input()
  readonly: boolean;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private msg: NzMessageService,
  ) {
  }

  ngOnInit(): void {

  }



  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
  }

}
