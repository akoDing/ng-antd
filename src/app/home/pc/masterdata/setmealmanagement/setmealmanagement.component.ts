import { Component, OnInit, ViewChild } from "@angular/core";
import { TabRouter } from "../../../../uilib/components/tab-router/model/tabRouter";
import { Subject } from "rxjs";
import { ApiService } from "../../../../uilib/services";
import { NzMessageService } from "ng-zorro-antd";
import { SetmealTableComponent } from "./table/table.component";
import { SetmealDetailComponent } from "./detail/detail.component";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-setmeal-management",
  templateUrl: "./setmealmanagement.component.html",
  styleUrls: ["./setmealmanagement.component.less"]
})
export class SetmealComponent implements OnInit {
  @ViewChild("table", { static: true }) table: SetmealTableComponent;
  @ViewChild("detail", { static: true }) detail: SetmealDetailComponent;

  tabs: TabRouter[];
  index: number = 0;
  reload: Subject<boolean> = new Subject();

  constructor(private apiService: ApiService, private msg: NzMessageService) {}

  ngOnInit() {
    this.tabs = [
      {
        title: "套餐管理维护列表",
        closeable: false,
        template: this.table
      }
    ];
  }

  create() {
    this.tabs.push({
      title: `frontend.create`,
      closeable: true,
      template: this.detail,
      attribute: { setmeal: {}, i18nList: [] },
      icon: "plus"
    });
    this.index = this.tabs.length - 1;
  }

  edit(event) {
    this.tabs.push({
      title: `frontend.edit`,
      closeable: true,
      template: this.detail,
      attribute: { setmealService: event },
      icon: "edit"
    });
    this.index = this.tabs.length - 1;
  }

  save(event) {
    const uri = "appbiz/masterdataSetMealService/save";
    let data = {
      ...event
      // active: !event.active
    };
    this.apiService.postJSON(uri, data).subscribe(
      res => {
        if (res && res.success) {
          this.msg.success("Done.");
          this.reload.next(true);
        } else {
          this.msg.error("action failed.");
        }
      },
      err => {
        this.msg.error("action failed.");
        console.log(err);
      }
    );
  }

  remove(event) {
    const uri = `appbiz/masterdata12ncCode/remove/${event.id}`;
    this.apiService.delete(uri).subscribe(
      res => {
        if (res && res.success) {
          this.msg.success("Done.");
          this.reload.next(true);
        } else {
          this.msg.error("action failed.");
        }
      },
      err => {
        this.msg.error("action failed.");
      }
    );
  }

  closeTab(idx) {
    this.tabs.splice(idx, 1);
    this.index = 0;
  }

  closeTabAndReload(idx, event) {
    this.closeTab(idx);
    if (event) {
      this.reload.next(true);
    }
  }
}
