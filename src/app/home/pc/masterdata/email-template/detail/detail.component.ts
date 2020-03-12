import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../../../uilib/services/api.service';
import { EmailTemplate } from '../../../../domain';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);



@Component({
  selector: 'app-email-template-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class EmailTemplateDetailComponent implements OnInit {

  modules = {};

  @Input()
  emailTemplate: EmailTemplate;

  @Output()
  afterSave = new EventEmitter();

  validateForm: FormGroup;

  afterInit = false;

  contentStr: string = '';

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private apiService: ApiService
  ) {
    this.modules = {
      imageResize: {},
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], 
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image']
      ]
    };
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [this.emailTemplate.id],
      title: [this.emailTemplate.title, [Validators.required]],
      // content: [''],
      content: [this.emailTemplate.content],
      active: [this.emailTemplate.active || false]
    });
  }

  submitForm(event: any, value: any): void { //TODO
    event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      let data = { ...value };
      data['active'] = value.active ? true : false;
      data['deleted'] = value.deleted || false;
      console.log(data);
      // return;

      const uri = 'appbiz/masterdataEmailTemplate/saveDetail';
      // const param = {rows:[data]}; 
      this.apiService.postJSON(uri, data).subscribe((res) => {
        console.log('masterdataEmailTemplate/save', res);
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

  ngAfterViewInit() {
    setTimeout(()=>{
      this.afterInit = true;
    }, 50);
  }


}
