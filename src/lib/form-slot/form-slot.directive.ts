import {Directive, ElementRef, Input, ViewContainerRef} from '@angular/core';
import {AfterViewInit} from '@angular/core';

@Directive({
  selector: '[mwFormSlot]',
  exportAs: 'mwFormSlot',
})
export class FormSlotDirective implements AfterViewInit {

  @Input()
  public mwFieldName: string;

  private renderFn: (viewRef: ViewContainerRef, elRef: ElementRef) => void;

  constructor(public viewRef: ViewContainerRef,
              public elRef: ElementRef,
  ) {
  }

  public ngAfterViewInit(): void {
    if (this.renderFn) {
      this.renderFn(this.viewRef, this.elRef);
    }
  }

  public setup(renderFunction: (viewRef: ViewContainerRef, elRef: ElementRef) => void): void {
    this.renderFn = renderFunction;
    if (this.viewRef) {
      this.ngAfterViewInit();
    }
  }
}
