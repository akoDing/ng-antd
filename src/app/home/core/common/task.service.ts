import { Injectable } from "@angular/core";
import { ApiService } from "src/app/uilib/services/api.service";
import { NzModalService } from "ng-zorro-antd";
import { WorkflowLogComponent } from "src/app/uilib/components/workflow-log/workflow-log.component";
import { Observable } from "rxjs";

@Injectable()
export class TaskService {

    constructor(
        private apiService: ApiService,
        private modalService: NzModalService
    ) {

    }
    getTasks(params: any): Observable<any> {
        return this.apiService.pipeApi(this.apiService.get('appbiz/reimbursement/tasks', params));
    }

    getHistoryTasks(params: any): Observable<any> {
        return this.apiService.pipeApi(this.apiService.get('appbiz/reimbursement/history', params));
    }

    getLogs(id: any) {
        this.modalService.create({
            nzTitle: 'View history',
            nzContent: WorkflowLogComponent,
            nzFooter: null,
            nzComponentParams: {
                apiPath: `appbiz/reimbursement/${id}/log`
            }
        });
    }

}
