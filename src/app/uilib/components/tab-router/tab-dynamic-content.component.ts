import {Component, OnInit, Input} from '@angular/core';
import {TabRouter} from './model/tabRouter';


@Component({
  selector: 'app-tab-dynamic-content',
  template: `
    <div>
      <ng-content></ng-content>
      <ng-container *ngIf="tab.template"
                    [ngTemplateOutlet]="tab.template"
                    [ngTemplateOutletContext]="tab.attribute"
      >
      </ng-container>
    </div>
  `
})
export class TabDynamicContentComponent implements OnInit {
  @Input() tab: TabRouter;

  ngOnInit(): void {
  }

}
