import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, valueFunctionProp} from 'ng-zorro-antd';
import {ApiService, RenameFileService} from '../../uilib/services';

@Component({
  selector: 'app-index',
  templateUrl: 'index.component.html',
  styleUrls: ['./index.component.less']
})

export class IndexComponent implements OnInit {

  validateForm: FormGroup;

  referenceId = 'dc987d19-4b13-4da9-94d7-270b2c2f7582';

  constructor(private fb: FormBuilder, private msg: NzMessageService, private apiService: ApiService, private renameFile: RenameFileService) {
  }


  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const formData = new FormData();
    const {financemail, ceform, ...rest} = this.validateForm.value;
    const data = {
      ...rest,
      id: this.referenceId,
    }


    const formJson = JSON.stringify(data);
    formData.append('form', formJson);
    financemail.forEach(item => {
      formData.append('financemail', item);
    });

    ceform.forEach(item => {
      let newItem = new File([item], this.renameFile.generateFileName('ceform', { crmid: this.validateForm.value.code}));
      formData.append('ceform', newItem);
    });

    this.apiService.postForm('appbiz/project/saveFormData', formData, true).subscribe(
      (res) => {

      },
      error => {
      });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      code: [null, [Validators.email, Validators.required]],
      name: [null, [Validators.required]],
      financemail: [[]],
      ceform: [[]]
    });
  }

}
