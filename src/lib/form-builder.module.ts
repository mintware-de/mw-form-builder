import {NgModule} from '@angular/core';
import {FormBuilderComponent} from './form-builder/form-builder.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFieldDirective} from './form-field/form-field.directive';
import {CommonModule} from '@angular/common';
import {FormSlotDirective} from './form-slot/form-slot.directive';
import {FormGroupComponent} from './form-group/form-group.component';

@NgModule({
  declarations: [
    FormBuilderComponent,
    FormGroupComponent,
    FormFieldDirective,
    FormSlotDirective,
  ],
  entryComponents: [
    FormGroupComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    FormBuilderComponent,
    FormGroupComponent,
    FormFieldDirective,
    FormSlotDirective,
  ],
})
export class FormBuilderModule {
}
