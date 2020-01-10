import {NgModule} from '@angular/core';
import {FormBuilderComponent} from './form-builder/form-builder.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFieldComponent} from './form-field/form-field.component';
import {CommonModule} from '@angular/common';
import {FormSlotComponent} from './form-slot/form-slot.component';
import {FormGroupComponent} from './form-group/form-group.component';

@NgModule({
  declarations: [
    FormBuilderComponent,
    FormGroupComponent,
    FormFieldComponent,
    FormSlotComponent,
  ],
  entryComponents: [
    FormFieldComponent,
    FormGroupComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    FormBuilderComponent,
    FormGroupComponent,
    FormFieldComponent,
    FormSlotComponent,
  ],
})
export class FormBuilderModule {
}
