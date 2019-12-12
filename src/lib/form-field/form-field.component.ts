import {Component, ComponentFactoryResolver, OnChanges, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';

@Component({
  selector: 'mw-form-field',
  template: '',
})
export class FormFieldComponent extends AbstractFormFieldComponent<any> implements OnInit, OnChanges {

  constructor(public readonly viewRef: ViewContainerRef,
              public readonly cfr: ComponentFactoryResolver,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.render();
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
    (component.instance as AbstractFormFieldComponent<any>).formGroup = this.formGroup;
    (component.instance as AbstractFormFieldComponent<any>).fieldName = this.fieldName;
    (component.instance as AbstractFormFieldComponent<any>).fieldType = this.fieldType;
    (component.instance as AbstractFormFieldComponent<any>).arrayName = this.arrayName;
  }
}
