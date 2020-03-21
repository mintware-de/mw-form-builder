import {Component, ComponentFactoryResolver, OnChanges, SimpleChange, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType} from '../form-type/abstract-group-type';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'mw-form-field',
  template: '<ng-container #ref></ng-container>',
})
export class FormFieldComponent extends AbstractFormFieldComponent<any> implements OnChanges {

  @ViewChild('ref', {read: ViewContainerRef})
  public readonly viewRef: ViewContainerRef;

  constructor(public readonly cfr: ComponentFactoryResolver,
  ) {
    super();
  }

  // noinspection JSUnusedLocalSymbols
  public ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  public render(): void {
    if (this.mwFieldType == null || this.viewRef == null) {
      return;
    }

    this.viewRef.clear();

    const factory = this.cfr.resolveComponentFactory<AbstractFormFieldComponent<any>>(this.mwFieldType.component);
    const component = this.viewRef.createComponent(factory);

    const isGroup = this.mwFieldType instanceof AbstractGroupType;
    const changes = {
      mwFormGroup: new SimpleChange(null, isGroup ? this.mwElement as FormGroup : this.mwFormGroup, true),
      mwElement: new SimpleChange(null, this.mwElement, true),
      mwFieldType: new SimpleChange(null, this.mwFieldType, true),
      mwSlots: new SimpleChange(null, this.mwSlots, true),
      mwPath: new SimpleChange(null, this.mwPath, true),
      mwIndex: new SimpleChange(null, this.mwIndex, true),
    };

    component.instance.mwFormGroup = changes.mwFormGroup.currentValue;
    component.instance.mwElement = changes.mwElement.currentValue;
    component.instance.mwFieldType = changes.mwFieldType.currentValue;
    component.instance.mwSlots = changes.mwSlots.currentValue;
    component.instance.mwPath = changes.mwPath.currentValue;
    component.instance.mwIndex = changes.mwIndex.currentValue;

    if ('ngOnChanges' in component.instance) {
      (component.instance as OnChanges).ngOnChanges(changes);
    }

    component.changeDetectorRef.detectChanges();
  }
}
