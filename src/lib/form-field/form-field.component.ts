import {Component, ComponentFactoryResolver, OnChanges, SimpleChange, SimpleChanges, ViewContainerRef} from '@angular/core';
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
    const changes = {
      formGroup: new SimpleChange(null, isGroup ? this.element as FormGroup : this.formGroup, true),
      element: new SimpleChange(null, this.element, true),
      fieldType: new SimpleChange(null, this.fieldType, true),
      slots: new SimpleChange(null, this.slots, true),
      path: new SimpleChange(null, this.path, true),
      index: new SimpleChange(null, this.index, true),
    };

    component.instance.formGroup = changes.formGroup.currentValue;
    component.instance.element = changes.element.currentValue;
    component.instance.fieldType = changes.fieldType.currentValue;
    component.instance.slots = changes.slots.currentValue;
    component.instance.path = changes.path.currentValue;
    component.instance.index = changes.index.currentValue;

    if ('ngOnChanges' in component.instance) {
      (component.instance as OnChanges).ngOnChanges(changes);
    }

    component.changeDetectorRef.detectChanges();
  }
}
