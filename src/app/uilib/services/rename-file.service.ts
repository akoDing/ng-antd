import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class RenameFileService {


  public fileNameMap = {
    'ceform': '<CRM_ID>_Customer Evaluation Form_v<yyyymmddhhmmss>'
  };

  generateFileName(type: string, param?: any): string {
    let result;
    const current = new Date();
    if('ceform' === type) {
      result = this.fileNameMap.ceform.replace('<yyyymmddhhmmss>', this.dateAsYYYYMMDDHHMMSS(current));
      if(param && param['crmid']) {
        result = result.replace('<CRM_ID>', param['crmid']);
      }
    }

    return result;
  }

  dateAsYYYYMMDDHHMMSS(date): string {
    return date.getFullYear()
      + this.leftpad(date.getMonth() + 1, 2)
      + this.leftpad(date.getDate(), 2)
      + this.leftpad(date.getHours(), 2)
      + this.leftpad(date.getMinutes(), 2)
      + this.leftpad(date.getSeconds(), 2);
  }

  private leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
      + String(val)).slice(String(val).length);
  }


}