import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-approval-main-container',
  templateUrl: './approval-main-container.component.html',
  styleUrls: ['./approval-main-container.component.less']
})
export class ApprovalMainContainerComponent implements OnInit {

  requestName: string;

  constructor(private aRoute: ActivatedRoute) { 
    console.log('arouter', this.aRoute.snapshot);
    console.log('arouter', this.aRoute.snapshot.data['requestName']);
    this.requestName = this.aRoute.snapshot.data['requestName'];
    this.requestName = this.aRoute.snapshot.data['requestName'];
    // console.log('arouter', this.aRoute.snapshot.url);
    // console.log('arouter', this.aRoute.snapshot.url[0].path);
  }

  ngOnInit() {
  }

}
