import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { ApiService } from '../../services';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators'

@Component({
  selector: 'sys-user-select-multi',
  templateUrl: './sys-user-select-multi.component.html',
  styleUrls: ['./sys-user-select-multi.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SysUserSelectMultiComponent), multi: true },
  ]
})
export class SysUserSelectMultiComponent implements OnInit, ControlValueAccessor {

  @Input()
  key: string = 'id';

  @Input()
  disabled: boolean;

  @Output()
  selectUser = new EventEmitter();
  
  @Input()
  _value: any;

  @Input()
  set selectedOption(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
    }
  }
  get selectedOption(): any {
    return this._value;
  }

  onChange = (value: any) => {};
  onTouched = (value: any) => {};

  loading: boolean = false;
  searchChange$ = new BehaviorSubject('');
  userList: any[] = [];
  selectedUsers: any[] = [];
  defaultSize:number = 10;
  initFlag: boolean = false;

  constructor(
    private apiService: ApiService
  ) {}

  writeValue(value: any){ // 
    let result;
    if(value) {
      result = [];
      const arr = value.split(',');
      arr.forEach(el => {
        result.push(el || undefined);
      });
    }
    this._value = result;
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
          pageSize: this.getTotalSize()
        })
        .pipe(map((res: any) => res.result.list));

    const optionList$: Observable<string[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getSysUserList));
    optionList$.subscribe(data => {
      this.userList = data || [];
      if (this.selectedUsers && this.selectedOption && this.selectedUsers.length != this.selectedOption.length) {
        this.getSelectedUsers(this.selectedOption);
      }
      this.mergeUsers(this.userList);
      this.loading = false;
    });
  }

  onSearch(value: string): void {
    this.loading = true;
    this.searchChange$.next(value);
  }

  modelChange(event){
    this.getSelectedUsers(event);

    this.selectUser.emit(this.selectedUsers);
  }

  getSelectedUsers(event) {
    this.selectedUsers = [];
    for (const i of event) {
      for (const o of this.userList) {
        if (o[this.key] === i) {
          this.selectedUsers.push(o)
          break;
        }
      }
    }
  }

  getTotalSize(): number {
    let result: number = this.defaultSize;
    if(this.selectedOption && this.selectedOption.length > 0) {
      result = result + this.selectedOption.length;
    }
    return result;
  }

  mergeUsers(data: any[]) {
    if(data) {
      this.selectedUsers.forEach(user => {
        let included: boolean = false;
        for(const item of data) {
          if(user[this.key] == item[this.key]) {
            included = true;
            break;
          }
        }
        if(!included) {
          data.push(user);
        }
      });
    }
  }

}
