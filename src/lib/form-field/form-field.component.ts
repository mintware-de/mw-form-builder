import {Component, ComponentFactoryResolver, OnChanges, SimpleChanges, ViewContainerRef} from '@angular/core';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType} from '../form-type/abstract-group-type';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'mw-form-field',
  template: '',
})
export class FormFieldComponent extends AbstractFormFieldComponent<any> implements OnChanges {

  constructor(public readonly viewRef: ViewContainerRef,
              public readonly cfr: ComponentFactoryResolver,
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  private render(): void {
    if (this.fieldType == null) {
      return;
    }

    this.viewRef.clear();

    const factory = this.cfr.resolveComponentFactory(this.fieldType.component);
    const component = this.viewRef.createComponent(factory);

    const isGroup = this.fieldType instanceof AbstractGroupType;
    (component.instance as AbstractFormFieldComponent<any>).formGroup = isGroup ? this.element as FormGroup : this.formGroup;
    (component.instance as AbstractFormFieldComponent<any>).element = this.element;
    (component.instance as AbstractFormFieldComponent<any>).fieldType = this.fieldType;
    (component.instance as AbstractFormFieldComponent<any>).slots = this.slots;
    (component.instance as AbstractFormFieldComponent<any>).path = this.path;
  }
}
