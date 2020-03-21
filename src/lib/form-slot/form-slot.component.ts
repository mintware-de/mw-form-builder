import {AfterViewInit, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'mw-form-slot',
  template: '<ng-container #ref></ng-container>',
})
export class FormSlotComponent implements AfterViewInit {
  @ViewChild('ref', {read: ViewContainerRef})
  public readonly viewRef: ViewContainerRef;

  @Input()
  public mwFieldName: string;

  private renderFn: (viewRef: ViewContainerRef) => void;

  public ngAfterViewInit(): void {
    if (this.renderFn) {
      this.renderFn(this.viewRef);
    }
  }

  public setup(renderFunction: (viewRef: ViewContainerRef) => void): void {
    this.renderFn = renderFunction;
    if (this.viewRef) {
      this.ngAfterViewInit();
    }
  }
}
