import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../../../../../uilib/services";
import { EnumService } from "../../../../../uilib/services";
import { SetmealService } from "../../../../domain/setmeal-service";
import { TableInfo } from "../../../../../uilib/components/list-table/list-table";

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: "app-setmeal-management-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.less"]
})
export class SetmealDetailComponent implements OnInit {
  @Input()
  setmealService: SetmealService;

  @Output()
  afterSave = new EventEmitter();

  @Output()
  onDelete = new EventEmitter();

  validateForm: FormGroup;
  entityId: string;

  isVisible = false;
  isConfirmLoading = false;

  modalityTableInfo: TableInfo = {
    showPaging: false,
    frontPaging: false,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: "name",
        label: "frontend.setmeal.modality"
      }
    ],
    buttonColumn: {
      label: "frontend.thAction",
      buttons: [
        {
          label: "frontend.delete",
          confirm: true,
          confirmTitle: "frontend.confirmDelete",
          event: data => {
            this.onDelete.emit(data);
          },
          icon: "delete",
          isVisible: () => {
            return true;
          }
        }
      ]
    }
  };

  serviceTableInfo: TableInfo = {
    showPaging: false,
    frontPaging: false,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: "name",
        label: "frontend.funnel.serviceName"
      },
      {
        key: "content",
        label: "frontend.funnel.serviceContent"
      },
      {
        key: "priceCn",
        label: "frontend.setmeal.priceCn"
      },
      {
        key: "price_notax",
        label: "frontend.funnel.price_notax"
      },
      {
        key: "price_aftertax",
        label: "frontend.funnel.price_aftertax"
      },
      {
        key: "priceUs",
        label: "frontend.setmeal.priceUs"
      },
      {
        key: "grossProfitrate",
        label: "frontend.setmeal.grossProfitrate"
      },
      {
        key: "beginTime",
        label: "frontend.setmeal.beginTime"
      },
      {
        key: "endTime",
        label: "frontend.setmeal.endTime"
      }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private apiService: ApiService,
    private enumService: EnumService
  ) {}

  ngOnInit() {
    this.modalityTableInfo.data = [
      {
        name: "CT科研高级套餐"
      }
    ];
    // model数据初始化
    for (let i = 0; i < 100; i++) {
      this.listOfAllData.push({
        id: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }

  submitForm(event: any, value: any): void {
    event.preventDefault();
  }

  closeTabWithoutSave(event) {
    event.preventDefault();
    this.afterSave.emit(false);
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: ItemData[] = [];
  listOfAllData: ItemData[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};

  currentPageDataChange($event: ItemData[]): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(
      item => this.mapOfCheckedId[item.id]
    );
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(
      item => (this.mapOfCheckedId[item.id] = value)
    );
    this.refreshStatus();
  }
}
