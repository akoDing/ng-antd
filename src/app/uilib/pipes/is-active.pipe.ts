import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isActive'
})
// never used
export class IsActivePipe implements PipeTransform {
    transform(value: boolean): any {
        return !!value ? 'yes' : 'no';
    }

}
