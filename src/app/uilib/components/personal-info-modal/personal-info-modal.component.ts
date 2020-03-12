import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ApiService, AuthService } from '../../../uilib/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-personal-info-modal',
  templateUrl: './personal-info-modal.component.html',
  styleUrls: ['./personal-info-modal.component.less']
})
export class PersonalInfoModalComponent implements OnInit {

  isModalVisible: boolean = false;

  simplePersonalInfoForm: FormGroup;

  trigger: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.trigger = this.authService.firstLoginSubject.subscribe(res=> {
      if(res && '1' === this.authService.getFirstLogin()) {
        this.openModal();
      }

    });

  }

  ngOnInit() {
    this.simplePersonalInfoForm = this.fb.group({
    });

    if('1' === this.authService.getFirstLogin()) {
      setTimeout(() => {
        this.openModal();
      }, 2000);
    }

  }

  openModal(event?) {

    this.simplePersonalInfoForm = this.fb.group({
      code: 'codecode',
      zh_id: '111111',
      en_id: '222222',
      zh_display: ['ddd111', [Validators.required]],
      en_display: ['ddd222', [Validators.required]]
    });
    this.isModalVisible = true;


  }

  handleCancel(): void {
    this.authService.setFirstLogin('0');
    this.isModalVisible = false;
  }

  ngOnDestroy(): void {
    this.trigger.unsubscribe();
  }

}
