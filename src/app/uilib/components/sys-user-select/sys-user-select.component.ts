import {Component, OnInit, Input, forwardRef, Output, EventEmitter} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {ApiService} from '../../services';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'sys-user-select',
  templateUrl: './sys-user-select.component.html',
  styleUrls: ['./sys-user-select.component.less'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SysUserSelectComponent), multi: true},
  ]
})
export class SysUserSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled: boolean;

  @Input()
  key: string = 'id';

  @Output()
  selectUser = new EventEmitter();

  @Input()
  _value: number;

  @Input()
  placeholder: string = 'frontend.pleasechoose';

  @Input()
  autoEmit: boolean = false;
  loading: boolean = false;
  searchChange$ = new BehaviorSubject('');
  userList: any[] = [];
  defaultSize: number = 10;
  initFlag: boolean = false;

  constructor(
    private apiService: ApiService
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

  writeValue(value: any) {// userid is number
    if ('string' === typeof value) {
      value = Number(value) || undefined;
    }
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
    const uri = 'appbiz/user/findAll';
    this.initFlag = true;
    const getSysUserList = (keyword: string) =>
      this.apiService
        .postJSON(uri, {
          keyword: keyword,
          pageIndex: 1,
          pageSize: this.defaultSize
        })
        .pipe(map((res: any) => res.result.list));

    const optionList$: Observable<string[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getSysUserList));
    optionList$.subscribe(data => {
      this.userList = data || [];
      this.loading = false;

      if (this.autoEmit && this._value) {
        this.modelChange(this._value);
      }
    });
  }

  onSearch(value: string): void {
    this.loading = true;
    this.searchChange$.next(value);
  }

  modelChange(event) {
    if (!event) {
      this.selectUser.emit(event);
      return;
    }

    for (const o of this.userList) {
      if (o[this.key] === event) {
        this.selectUser.emit(o);
        break;
      }
    }
  }

}
