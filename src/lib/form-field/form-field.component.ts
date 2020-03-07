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

  // noinspection JSUnusedLocalSymbols
  public ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  public render(): void {
    if (this.fieldType == null) {
      return;
    }

    this.viewRef.clear();

    const factory = this.cfr.resolveComponentFactory<AbstractFormFieldComponent<any>>(this.fieldType.component);
    const component = this.viewRef.createComponent(factory);

    const isGroup = this.fieldType instanceof AbstractGroupType;
    component.instance.formGroup = isGroup ? this.element as FormGroup : this.formGroup;
    component.instance.element = this.element;
    component.instance.fieldType = this.fieldType;
    component.instance.slots = this.slots;
    component.instance.path = this.path;
    component.instance.index = this.index;
    component.changeDetectorRef.detectChanges();
  }
}
