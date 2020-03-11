import {Component, Input, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'mw-form-slot',
  template: '',
})
export class FormSlotComponent {

  @Input()
  public mwFieldName: string;

  constructor(public readonly viewRef: ViewContainerRef,
  ) {
  }
}
