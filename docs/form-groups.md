## Creating form groups
Form Groups are a great way for creating a set of form fields which are used often together.
For example a address section in a form is always rendered the same way.

```typescript
export interface IAddressFormFieldOptions {
}

export class AddressFormField extends AbstractGroupType<IAddressFormFieldOptions & IGroupTypeOptions> {
  readonly component: Constructor = AddressFormFieldComponent;
  readonly validators: ValidatorFn[];

  constructor(options?: IAddressFormFieldOptions) {
    super(Object.assign({
      readonly: false,
      model: {
        name: new TextFormType({
          label: 'Name',
          required: true,
        }),
        street: new TextFormType({
          label: 'Street',
          required: true,
        }),
        houseNumber: new TextFormType({
          label: 'no.',
          required: true,
        }),
        zipCode: new TextFormType({
          label: 'Zip code',
          required: true,
        }),
        city: new TextFormType({
          label: 'City',
          required: true,
        }),
      }
    } as IAddressFormFieldOptions & IGroupTypeOptions, options));
  }

}

@Component({
  selector: 'app-address-form-field',
  template: `
    <ng-container [formGroup]="mwElement">
      <ng-container mwFormSlot mwFieldName="name"></ng-container>
      <ng-container mwFormSlot mwFieldName="street"></ng-container>
      <ng-container mwFormSlot mwFieldName="houseNumber"></ng-container>
      <ng-container mwFormSlot mwFieldName="zipCode"></ng-container>
      <ng-container mwFormSlot mwFieldName="city"></ng-container>
    </ng-container>`,
})
export class AddressFormFieldComponent extends AbstractFormGroupComponent<AddressFormField> {
}
```
