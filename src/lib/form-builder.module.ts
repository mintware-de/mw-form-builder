import {NgModule} from '@angular/core';
import {FormBuilderComponent} from './form-builder/form-builder.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFieldDirective} from './form-field/form-field.directive';
import {CommonModule} from '@angular/common';
import {FormGroupComponent} from './form-group/form-group.component';
import {DummyFieldComponent} from './dummy-field/dummy-field.component';

@NgModule({
  declarations: [
    FormBuilderComponent,
    FormGroupComponent,
    FormFieldDirective,
    DummyFieldComponent,
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
  ],
})
export class FormBuilderModule {
}
