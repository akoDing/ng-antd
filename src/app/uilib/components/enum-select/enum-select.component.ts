import {Component, OnInit, Input, forwardRef, Output, EventEmitter} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {EnumService} from '../../services';
@Component({
  selector: 'enum-select',
  templateUrl: './enum-select.component.html',
  styleUrls: ['./enum-select.component.less'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EnumSelectComponent), multi: true},
  ]
})
export class EnumSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled: boolean;

  @Input()
  parentName: string;

  @Input()
  selectMode: string;

  @Output()
  selectEnum = new EventEmitter();

  @Input()
  _value: any;

  @Input()
  placeholder: string = 'frontend.pleasechoose';

  @Input()
  autoEmit: boolean = false;

  loading: boolean = false;
  selectList: any[] = [];

  constructor(
    private enumService: EnumService
  ) {
  }

  get selectedOption(): any {
    return this._value;
  }

  @Input()
  set selectedOption(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
    }
  }

  onChange = (value: any) => {
  };

  onTouched = (value: any) => {
  };

  writeValue(value: any) {
    this._value = value;
  }

  updateChanges() {
    this.onChange(this._value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {
    this.loading = true;
    this.selectList = this.enumService.filterByParentName(this.parentName);
    this.loading = false;
    if (this.autoEmit && this._value) {
      this.modelChange(this._value);
    }
  }

  modelChange(event) {
    if (event) {
      this.selectEnum.emit(event);
      return;
    }
  }

}
