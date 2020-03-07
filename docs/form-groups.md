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
    <mw-form-group [path]="path"
                   [element]="element"
                   [formGroup]="element"
                   [model]="fieldType.options.model"
                   [slots]="slots">
      <mw-form-slot fieldName="name"></mw-form-slot>
      <mw-form-slot fieldName="street"></mw-form-slot>
      <mw-form-slot fieldName="houseNumber"></mw-form-slot>
      <mw-form-slot fieldName="zipCode"></mw-form-slot>
      <mw-form-slot fieldName="city"></mw-form-slot>
    </mw-form-group>`,
})
export class AddressFormFieldComponent extends AbstractGroupFormField<AddressFormField> {
}
```
