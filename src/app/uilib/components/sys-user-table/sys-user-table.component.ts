import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sys-user-table',
  templateUrl: './sys-user-table.component.html',
  styleUrls: ['./sys-user-table.component.less']
})
export class SysUserTableComponent implements OnInit {

  @Input() type: string;

  dataList: any[] = [];
  _operatingFlag: boolean = false;

  searchForm: FormGroup;
  controlNameList = ['keyword'];

  pageIndex = 1;
  pageSize = 15;
  total = 1;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private msg: NzMessageService) { }

  ngOnInit() {
    for (let item of this.controlNameList) {
      this.searchForm.addControl(item, new FormControl())
    }
    this.loadTable();
  }

  loadTable() {
    const uri = 'appbiz/masterdataCrmMaintenance/pageQueryByParameter';
    const param = {
      'advQuery': {
        'keyword': this.searchForm.controls['keyword'].value || undefined,
      },
      'pageSize': this.pageSize,
      'pageIndex': this.pageIndex
    };
    this.apiService.callApi(this.apiService.postJSON(uri, param),
      (res: any) => {
        console.log(res);
        if (res && res.success) {
          console.log('success');
          if (res.result.total == 0 && this.pageIndex !== 1) {
            this.pageIndex = 1;
            this.loadTable();
            return;
          }
          this.dataList = [...res.result.list];
          this.total = res.result.total || 0;

        } else {
          console.log(res);
        }

      }, (res: any) => {
        this._operatingFlag = false;
      }
    );

  }

}
