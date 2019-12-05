import {Component, Input, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'mw-form-slot',
  template: '',
})
export class FormSlotComponent {

  @Input()
  public fieldName: string;

  constructor(public readonly viewRef: ViewContainerRef,
  ) {
  }
}
