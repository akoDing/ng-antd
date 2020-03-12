import {Component, OnInit, ViewChild} from '@angular/core';
import {TabRouter} from '../../../../uilib/components/tab-router/model/tabRouter';
import {Subject} from 'rxjs';
import {ProductlistComponent} from './prodcutlist/productlist.component';
import {ApiService} from '../../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';
import {ProductdetailComponent} from './productdetail/productdetail.component';

@Component({
  selector: 'app-productemanagement',
  templateUrl: './productmanagement.component.html',
  styleUrls: ['./productmanagement.component.less']
})
export class ProductmanagementComponent implements OnInit {

  @ViewChild('productList', {static: true}) productList: ProductlistComponent;
  @ViewChild('productDetail', {static: true}) productDetail: ProductdetailComponent;

  tabs: TabRouter[];

  index: number = 0;

  reload: Subject<any> = new Subject();

  constructor(private apiService: ApiService, private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.tabs = [
      {
        title: '产品类型列表',
        closeable: false,
        template: this.productList
      }
    ];
  }

  disable($event) {
     console.log($event.id);
    this.apiService.delete(`appbiz/masterdataProductType/remove/${$event.id}`).subscribe(res => {
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
      template: this.productDetail,
      attribute: {producttype: $event, readonly: true},
      icon: 'eye'
    });
    this.index = this.tabs.length - 1;
  }

  edit($event) {
    this.tabs.push({
      title: `frontend.edit`,
      closeable: true,
      template: this.productDetail,
      attribute: {producttype: $event, readonly: false},
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
  }

  create() {
    this.tabs.push({
      title: `frontend.create`,
      closeable: true,
      template: this.productDetail,
      attribute: {producttype: {}},
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
