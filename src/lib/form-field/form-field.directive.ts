import {ComponentFactoryResolver, Directive, ElementRef, OnChanges, SimpleChanges, ViewContainerRef} from '@angular/core';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType} from '../form-type/abstract-group-type';
import {FormGroup} from '@angular/forms';
import {FieldInstanceHelper} from '../field-instance-helper';

@Directive({
  selector: '[mwFormField]',
})
export class FormFieldDirective extends AbstractFormFieldComponent<any> implements OnChanges {

  constructor(public readonly viewRef: ViewContainerRef,
              public readonly cfr: ComponentFactoryResolver,
              protected readonly elRef: ElementRef,
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
    FieldInstanceHelper.setupFieldInstance(component.instance, {
      mwFormGroup: isGroup ? this.mwElement as FormGroup : this.mwFormGroup,
      mwElement: this.mwElement,
      mwFieldType: this.mwFieldType,
      mwSlots: this.mwSlots,
      mwPath: this.mwPath,
      mwIndex: this.mwIndex,
    });

    const host: any = this.elRef.nativeElement;
    if (host instanceof HTMLElement && !host.contains(component.location.nativeElement)) {
      host.appendChild(component.location.nativeElement);
    }

    component.changeDetectorRef.detectChanges();
  }
}
