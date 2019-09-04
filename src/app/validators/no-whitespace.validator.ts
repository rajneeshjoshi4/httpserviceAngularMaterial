import { AbstractControl, Validator } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl):{ [key: string]: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
