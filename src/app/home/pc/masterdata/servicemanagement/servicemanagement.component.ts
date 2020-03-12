import {Component, OnInit, ViewChild} from '@angular/core';
import {TabRouter} from '../../../../uilib/components/tab-router/model/tabRouter';
import {Subject} from 'rxjs';
import {ServicelistComponent} from './servicelist/servicelist.component';
import {ApiService} from '../../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';
import {ServicedetailComponent} from './servicedetail/servicedetail.component';

@Component({
  selector: 'app-servicemanagement',
  templateUrl: './servicemanagement.component.html',
  styleUrls: ['./servicemanagement.component.less']
})
export class ServicemanagementComponent implements OnInit {

  @ViewChild('serviceList', {static: true}) serviceList: ServicelistComponent;
  @ViewChild('serviceDetail', {static: true}) serviceDetail: ServicedetailComponent;

  tabs: TabRouter[];

  index: number = 0;

  reload: Subject<any> = new Subject();

  constructor(private apiService: ApiService, private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.tabs = [
      {
        title: '服务类列表',
        closeable: false,
        template: this.serviceList
      }
    ];
  }

  disable($event) {
     console.log($event.id);
    this.apiService.delete(`appbiz/masterdataServiceClass/remove/${$event.id}`).subscribe(res => {
      if (res.success) {
        this.msg.success('提交成功！');
        this.reload.next(true);
      } else {
        this.msg.error(res.result);
      }
    }, error => {
      this.msg.error(error);
    });
  }

  view($event) {
    this.tabs.push({
      title: `frontend.view`,
      closeable: true,
      template: this.serviceDetail,
      attribute: {service: $event, readonly: true},
      icon: 'eye'
    });
    this.index = this.tabs.length - 1;
  }

  edit($event) {
    this.tabs.push({
      title: `frontend.edit`,
      closeable: true,
      template: this.serviceDetail,
      attribute: {service: $event, readonly: false},
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
  }

  create() {
    this.tabs.push({
      title: `frontend.create`,
      closeable: true,
      template: this.serviceDetail,
      attribute: {service: {}},
      icon: 'plus'
    });
    this.index = this.tabs.length - 1;
  }

  closeTab(index) {
    this.tabs.splice(index, 1);
    this.index = 0;
  }

  closeTabAndReload(index, event) {
    this.closeTab(index);
    console.log('closeTabAndReload', event);
    if (event) {
      this.reload.next(event);
    }
  }
}
