import {Component,EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UploadFile} from 'ng-zorro-antd';
import {ApiService, RenameFileService} from '../../services';

export const EXE_FILE_UPLOAD_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileUploadComponent),
  multi: true
};


@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less'],
  providers: [EXE_FILE_UPLOAD_ACCESSOR]
})
export class FileUploadComponent implements ControlValueAccessor, OnInit {

  // 是否允许空
  @Input()
  notNull: boolean = true;

  @Input()
  value: any[] = [];

  @Input()
  formControlName: string;

  @Input()
  fileNameType: string;

  // 限制上传的数量0为不限制
  @Input()
  limit: number = 0;

  // 不可变文件列表
  historyFileList: any[];


  // 引用对象的类
  @Input()
  referenceObjectClass: string;

  // 引用对象的ID
  @Input()
  referenceId: string;

  // 是否禁用
  @Input()
  disabled: boolean = false;

  // 文件上传限制
  @Input()
  fileType: string;

  @Output()
  change = new EventEmitter();


  constructor(private api: ApiService, private renameFile: RenameFileService) {
  }

  constructorFileList(data: any[]): any[] {
    let fileList = [];
    data.forEach(({id, name, size}) => {
      fileList.push({
        uid: id,
        size,
        name,
        filename: name,
        url: `appbiz/file/listUploadFileHistory/download/${id}`,
        status: 'done',
      });
    });
    return fileList;
  }

  ngOnInit(): void {
    if (!this.referenceObjectClass || !this.referenceId) {
      return;
    }
    this.api.get(`appbiz/file/listUploadFileHistory/${this.formControlName}?oid=${this.referenceObjectClass}:${this.referenceId}`)
      .subscribe(
        rest => {
          if (rest.success) {
            const fileList = this.constructorFileList(rest.result);
            console.log(fileList);
            if (this.limit == 0 || this.limit > 1) {
              this.value = fileList;
            } else {
              this.historyFileList = fileList;
            }
          }
        },
        error => {
        }
      );
  }

  removeFile = (file: UploadFile): any => {
    this.onChange(this.value);
    if (!file.url) {
      return true;
    }
    return this.api.delete(`appbiz/file/removeFileHistory/${file.uid}`).pipe();
  };

  beforeUpload = (file: File, fileList: UploadFile[]): boolean => {
    if (this.fileNameType) {
      file = new File([file], this.renameFile.generateFileName(this.fileNameType));
    }
    if(!this.value){
      this.value = [];
    }
    this.value = this.value.concat(file);
    this.onChange(this.value);
    return false;
  };

  onChange = (value: any) => {
    this.change.emit(this.value);
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }


  writeValue(value: UploadFile[]): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  clickButton(event): void {
    if (event) {
      event.preventDefault();
    }
  }


}
