import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { ApiService } from '../../services';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators'
import { NzTreeHigherOrderServiceToken } from 'ng-zorro-antd';

@Component({
  selector: 'masterdata-select',
  templateUrl: './masterdata-select.component.html',
  styleUrls: ['./masterdata-select.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MasterdataSelectComponent), multi: true },
  ]
})
export class MasterdataSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled: boolean;

  @Input()
  masterDataName: string;

  @Input()
  valueName: string = 'id';

  @Input()
  labelName: string[] = ['id'];

  @Input()
  autoEmit: boolean = false;

  @Output()
  selectObj = new EventEmitter();
  
  @Input()
  _value: string;

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
  masterdataList: any[] = [];

  constructor(
    private apiService: ApiService
  ) {}

  writeValue(value: any) {
      if(!value) {
        this._value = undefined;
      } else if('object' === typeof value) {
        this._value = value['value'];
      } else {
        this._value = value;
      }
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


    let uri;
    if('cost-center' === this.masterDataName) {
      uri = 'appbiz/masterdataCostCenterMaintenance/pageQueryByParameter';
    } else if ('crm' === this.masterDataName) {
      uri = 'appbiz/masterdataCrmMaintenance/pageQueryByParameter';
    }

    // const uri = 'appbiz/user/findAll';

    if(!uri) {
      return;
    }

    const getMasterdataList = (keyword: string) =>
      this.apiService
        .postJSON(uri, {
          keyword: keyword ? keyword : this._value,
          pageIndex: 1,
          pageSize: 10
        })
        .pipe(map((res: any) => res.result.list));

    const optionList$: Observable<string[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getMasterdataList));
    optionList$.subscribe(data => {
      console.log('masterdata ->', data);
      this.processList(data);
      this.masterdataList =  data || [];
      this.loading = false;
      // console.log('selectedOption', this.selectedOption);
      // console.log('_value', this._value);
      if(this.autoEmit && this._value) {
        this.modelChange(this._value);
      }
    });
  }

  onSearch(value: string): void {
    this.loading = true;
    this.searchChange$.next(value);
  }

  modelChange(event){
    for(const o of this.masterdataList) {
      if(o[this.valueName] === event) {
        this.selectObj.emit(o);
        break;
      }
    }
  }

  processList(raws: any[]) {
    if(!raws) {
      return;
    }
    raws.forEach(item => {
      item['labelStr'] =  '';
      // for(const item of this.labelName) {
        // item[this.labelName]
      // }
      this.labelName.forEach((o, index) => {
        if(0 == index) {
          item['labelStr'] += item[o];
        } else {
          item['labelStr'] += (' ' + item[o]);
        }
      });
      item['valueStr'] =  item[this.valueName];
    });
  }

}
