import { AbstractControl } from '@angular/forms';

export function fileUploadRequired(control: AbstractControl): { [s: string]: boolean } {
  if (!control.value || control.value.length == 0) {
    return { required: true };
  } else {
    let allRemoved = true;
    for (const i of control.value) {
      if (!i.status || i.status !== 'removed') {
        allRemoved = false;
        break;
      }
    }
    return allRemoved ? { required: true } : null;
  }
}
