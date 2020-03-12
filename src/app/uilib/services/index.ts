import {NgModule} from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { HandlerService } from './handler.service';
import { SettingService } from './setting.service';
import { EnumService } from './enum.service';
import { RenameFileService } from './rename-file.service';

export {
  ApiService,
  AuthService,
  HandlerService,
  EnumService,
  SettingService,
  RenameFileService
}

@NgModule()
export class BaseServicesModule {
  static forRoot() {
    return {
      ngModule: BaseServicesModule,
      providers: [
        ApiService,
        AuthService,
        EnumService,
        HandlerService,
        SettingService,
        RenameFileService
      ]
    };
  }
}
