import {NgModule} from '@angular/core';
import {FormBuilderComponent} from './form-builder/form-builder.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFieldComponent} from './form-field/form-field.component';
import {CommonModule} from '@angular/common';
import {FormSlotComponent} from './form-slot/form-slot.component';

@NgModule({
  declarations: [
    FormBuilderComponent,
    FormFieldComponent,
    FormSlotComponent,
  ],
  entryComponents: [
    FormFieldComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    FormBuilderComponent,
    FormFieldComponent,
    FormSlotComponent,
  ],
})
export class FormBuilderModule {
}
