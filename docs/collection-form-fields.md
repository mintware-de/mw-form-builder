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
  public readonly component: any = CollectionFormFieldComponent;

  public get validators(): ValidatorFn[] {
    return [];
  }
}
```

In the Angular Component you've to extend the AbstractCollectionFormFieldComponent and use the 
`<mw-form-field>` component in the template

```typescript
@Component({
  selector: 'app-collection-form-field',
  template: `
    <div>
      <strong>{{fieldType.options.label}}:</strong><br>
      <div *ngFor="let child of element.controls; let i=index">
        <mw-form-field [formGroup]="formGroup"
                       [element]="child"
                       [fieldType]="fieldType.fieldInstance"
                       [slots]="slots"
                       [path]="path + '_'+ i"
                       [index]="i"></mw-form-field>
        <button (click)="removeEntry(i)">-</button>
      </div>
      <button type="button" (click)="addEntry()">+</button>
    </div>  `
})
export class CollectionFormFieldComponent extends AbstractCollectionFormFieldComponent {
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
