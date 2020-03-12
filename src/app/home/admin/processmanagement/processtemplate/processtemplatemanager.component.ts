import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';
import {TableInfo} from '../../../../uilib/components/list-table/list-table';
import {NzI18nService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-processtemplatelist',
  templateUrl: './processtemplatemanager.component.html',
  styleUrls: ['./processtemplatemanager.component.scss']
})
export class ProcesstemplatemanagerComponent implements OnInit {

  uploadForm: FormGroup;

  controlNameList: string[] = [
    'files',
  ];

  constructor(private api: ApiService,
              private message: NzMessageService,
              private nzI18nService: NzI18nService,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.refreshTable();
    this.uploadForm = this.fb.group({});
    for (let item of this.controlNameList) {
      this.uploadForm.addControl(item, new FormControl());
    }
  }

  submitForm(event, value) {
    event.preventDefault();
    this.processtemplateTableInfo.loading = true;
    const formData = new FormData();
    if (!value) {
      this.message.error('上传文件不能为空！');
      this.processtemplateTableInfo.loading = false;
      return;
    }
    const {files} = value;
    if (!files || files.length == 0) {
      this.message.error('上传文件不能为空！');
      this.processtemplateTableInfo.loading = false;
      return;
    }
    formData.append('files', files[0]);
    this.api.postForm('appbiz/model/importBPMN/candidate', formData, true).subscribe(
      (res) => {
        if (res.success) {
          this.message.success('上传成功');
          this.refreshTable();
          this.uploadForm.reset();
        } else {
          this.message.error('上传失败');
        }
        this.processtemplateTableInfo.loading = false;
      },
      error => {
        this.message.error('上传失败');
        this.processtemplateTableInfo.loading = false;
      });
  }

  removeLastVersion = (row) => {
    this.api.delete(`appbiz/model/remove/${row.id}`).subscribe(rest => {
      if (rest.success) {
        this.message.success('删除成功');
        this.refreshTable();
      } else {
        this.message.error(rest.result);
      }
    });
  };

  processtemplateTableInfo: TableInfo = {

    showPaging: false,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: 'key',
        label: 'frontend.processtemplate.key'
      }, {
        key: 'name',
        label: 'frontend.processtemplate.name'
      }, {
        key: 'lastUpdateDate',
        label: 'frontend.processtemplate.lastUpdateDate',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd HH:mm:ss');
        }
      }, {
        key: 'version',
        label: 'frontend.processtemplate.version'
      }
    ],
    buttonColumn: {
      label: 'frontend.thAction',
      buttons: [
        {
          label: 'frontend.processtemplate.removeLastVersion',
          confirm: true,
          confirmTitle: 'frontend.confirmDelete',
          event: (data) => {
            this.removeLastVersion(data);
          },
          icon: 'delete',
          isVisible: () => {
            return true;
          }
        }
      ]
    }
  };

  private refreshTable = () => {
    this.api.getJson(`appbiz/model/listAll`).subscribe(rest => {
      if (rest.success) {
        console.log(rest.result);
        this.processtemplateTableInfo.data = [...rest.result];
      }
    });
  };


}
