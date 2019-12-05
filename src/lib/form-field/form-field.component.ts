import {Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';

@Component({
  selector: 'mw-form-field',
  template: '',
})
export class FormFieldComponent implements OnInit, OnChanges {

  @Input()
  public formGroup: FormGroup;

  @Input()
  public fieldName: string;

  @Input()
  public fieldType: AbstractType<any>;

  @Input()
  public renderedThroughBuilder: boolean = false;

  constructor(public readonly viewRef: ViewContainerRef,
              public readonly cfr: ComponentFactoryResolver,
  ) {
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
    (component.instance as any).formGroup = this.formGroup;
    (component.instance as any).fieldName = this.fieldName;
    (component.instance as any).fieldType = this.fieldType;
  }
}
