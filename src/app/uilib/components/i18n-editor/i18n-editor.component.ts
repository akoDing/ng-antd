import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {GlobalEntity} from './globalEntity';

export const EXE_I18N_EDITOR_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => I18nEditorComponent),
  multi: true
};


@Component({
  selector: 'i18n-editor',
  templateUrl: './i18n-editor.component.html',
  styleUrls: ['./i18n-editor.component.less'],
  providers: [EXE_I18N_EDITOR_ACCESSOR]
})
export class I18nEditorComponent implements ControlValueAccessor {

  @Input()
  notNull: boolean = true;

  @Input()
  supportLocations: string[] = ['zh', 'en'];

  value: GlobalEntity = {};

  disabled: boolean = false;

  isModalVisible: boolean = false;

  tmpForm: FormGroup;


  constructor(private fb: FormBuilder) {

  }

  onChange = (_: any) => {

  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  changeInputValue(event): void {
    console.log(event.target.value);
    this.value.code = event.target.value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    console.log('i18n value', value);
    this.value = value;
  }

  openModal(event) {
    event.preventDefault();
    let formData = {};
    this.supportLocations.forEach(_locale => {
      const i18nEntity = this.value.i18nList.find(({locale}) => {
        return _locale == locale;
      });
      const localeValue = !!i18nEntity ? i18nEntity.value : '';
      formData[_locale] = !this.notNull ? [localeValue] : [localeValue, [Validators.required]];
    });

    this.tmpForm = this.fb.group(formData);
    this.isModalVisible = true;
  }

  handleOk() {
    for (const key in this.tmpForm.controls) {
      this.tmpForm.controls[key].markAsDirty();
      this.tmpForm.controls[key].updateValueAndValidity();
    }
    if (this.tmpForm.valid) {
      const formValue = this.tmpForm.value;
      this.value.i18nList =
        this.supportLocations.map(_locale => {
          return {
            locale: _locale,
            value: formValue[_locale]
          };
        });
    }
    this.onChange(this.value);
    this.isModalVisible = false;
    console.log(this.value);
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }


}
