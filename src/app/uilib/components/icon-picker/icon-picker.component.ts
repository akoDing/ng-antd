import {Component,forwardRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


export const EXE_ICON_PICKER_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IconPickerComponent),
  multi: true
};


@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.less'],
  providers: [EXE_ICON_PICKER_ACCESSOR]
})
export class IconPickerComponent implements ControlValueAccessor {

  selectedIcon: string = 'appstore';

  disabled: boolean = false;

  visible: boolean = false;

  popContentStyle = {
    width: '600px',
    height: '200px',
    overflowY: 'scroll'
  };

  gridStyle = {
    width: '10%',
    textAlign: 'center'
  };

  icons: string[] = [
    'lock',
    'unlock',
    'area-chart',
    'pie-chart',
    'bar-chart',
    'dot-chart',
    'bars',
    'book',
    'calendar',
    'cloud',
    'cloud-download',
    'code',
    'copy',
    'credit-card',
    'delete',
    'desktop',
    'download',
    'edit',
    'ellipsis',
    'file',
    'file-text',
    'file-unknown',
    'file-pdf',
    'file-word',
    'file-excel',
    'file-jpg',
    'file-ppt',
    'file-markdown',
    'file-add',
    'folder',
    'folder-open',
    'folder-add',
    'hdd',
    'frown',
    'meh',
    'smile',
    'inbox',
    'laptop',
    'appstore',
    'line-chart',
    'link',
    'mail',
    'mobile',
    'notification',
    'paper-clip',
    'picture',
    'poweroff',
    'reload',
    'search',
    'setting',
    'share-alt',
    'shopping-cart',
    'tablet',
    'tag',
    'tags',
    'to-top',
    'upload',
    'user',
    'video-camera',
    'home',
    'loading',
    'loading-3-quarters',
    'cloud-upload',
    'star',
    'heart',
    'environment',
    'eye',
    'camera',
    'save',
    'team',
    'solution',
    'phone',
    'filter',
    'exception',
    'export',
    'customer-service',
    'qrcode',
    'scan',
    'like',
    'dislike',
    'message',
    'pay-circle',
    'calculator',
    'pushpin',
    'bulb',
    'select',
    'switcher',
    'rocket',
    'bell',
    'disconnect',
    'database',
    'compass',
    'barcode',
    'hourglass',
    'key',
    'flag',
    'layout',
    'printer',
    'sound',
    'usb',
    'skin',
    'tool',
    'sync',
    'wifi',
    'car',
    'schedule',
    'user-add',
    'user-delete',
    'usergroup-add',
    'usergroup-delete',
    'man',
    'woman',
    'shop',
    'gift',
    'idcard',
    'medicine-box',
    'red-envelope',
    'coffee',
    'copyright',
    'trademark',
    'safety',
    'wallet',
    'bank',
    'trophy',
    'contacts',
    'global',
    'shake',
    'api',
    'fork',
    'dashboard',
    'form',
    'table',
    'profile',
  ];

  constructor() {
  }

  onChange = (_: any) => {

  };

  selectIcon(icon: string) {
    this.selectedIcon = icon;
    this.onChange(icon);
    this.visible = false;
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.selectedIcon = obj;
  }

}
