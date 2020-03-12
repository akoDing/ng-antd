import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'workflow-log',
    templateUrl: 'workflow-log.component.html'
})

export class WorkflowLogComponent implements OnInit {
    @Input() apiPath;
    @Input() workFlowInfo = [];

    constructor(
        private apiService: ApiService
    ) { }

    ngOnInit() {
        this.initHistoryList();
    }

    initHistoryList() {
        if (this.workFlowInfo.length < 1) {
            this.apiService.callApi(this.apiService.get(this.apiPath),
                (res) => {
                    this.workFlowInfo = res.data;
                }, null);
        }
    }

    returnText(item: any): string {
        if (item.action === 'Pending') {
            return `on ${item.actor}`;
        } else {
            return `by ${item.actor}, on ${item.assignedTime} ` + (item.comments || '');
        }
    }
}
