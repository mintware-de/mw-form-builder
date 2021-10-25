## Creating collection form fields

Collection fields contains a list of simple form fields. 

Starting with the configuration object, which extends the `ICollectionTypeOptions<TE>`

```typescript
export interface ICollectionFormTypeConfiguration<TE> extends ICollectionTypeOptions<TE> {
  label: string;
}
```

In the form type it's important to extend from the AbstractCollectionType instead of the Abstract type.
Everything else is similar to simple form fields 

```typescript
export class CollectionFormType<TConfig> extends AbstractCollectionType<TConfig, ICollectionFormTypeConfiguration<TConfig>> {
  public readonly component: Constructor = CollectionFormFieldComponent;

  public get validators(): ValidatorFn[] {
    return [];
  }
}
```

In the Angular Component you've to extend the AbstractCollectionFormFieldComponent and use the 
`mwFormField` directive in the template

```typescript
@Component({
  selector: 'app-collection-form-field',
  template: `
    <div>
      <strong>{{mwFieldType.options.label}}:</strong><br>
      <div *ngFor="let child of mwElement.controls; let i=index">
        <ng-container mwFormField [mwFormGroup]="mwFormGroup"
                                  [mwElement]="child"
                                  [mwFieldType]="mwFieldType.fieldInstance"
                                  [mwPath]="mwPath + '_'+ i"
                                  [mwIndex]="i"></ng-container>
        <button (click)="removeEntry(i)">-</button>
      </div>
      <button type="button" (click)="addEntry()">+</button>
    </div>  `
})
export class CollectionFormFieldComponent extends AbstractCollectionComponent {
  constructor(private readonly cdr: ChangeDetectorRef,
  ) {
    super();
  }

  removeEntry(index: number): void {
    super.removeEntry(index);
    this.cdr.detectChanges();
  }

  addEntry(): void {
    super.addEntry();
    this.cdr.detectChanges();
  }
}
```
