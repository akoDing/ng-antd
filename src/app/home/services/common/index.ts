import {NgModule} from '@angular/core';
import {FileService} from './file.service';
import {MenuService} from './menu.service';
import {MockService} from './mock.service';

export {
  FileService,
  MenuService,
  MockService
}

@NgModule()
export class CommonServicesModule {
  static forRoot() {
    return {
      ngModule: CommonServicesModule,
      providers: [
        MockService,
        FileService,
        MenuService
      ]
    };
  }
}
