import { Component, OnInit, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';
import { FullscreenGuideComponent } from '../fullscreen-guide/fullscreen-guide.component';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.less']
})
export class FullscreenComponent implements OnInit {
  status = false;
  private get sf(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
  }
  constructor(
    private modalService: NzModalService
  ) { }

  ngOnInit() {
  }


  @HostListener('window:resize')
  _resize() {
    this.status = this.sf.isFullscreen;
  }

  @HostListener('click')
  _click() {
    this.status = !this.status;
    if (this.sf.enabled) {
      this.sf.toggle();
    } else {
      this.viewGuide();
    }
  }

  viewGuide() {
    this.modalService.create({
      nzTitle: 'IOS Safari Fullscreen Guide',
      nzContent: FullscreenGuideComponent,
      nzWidth: '100%',
      nzClosable: true,
      nzFooter: null
    });
  }

}
