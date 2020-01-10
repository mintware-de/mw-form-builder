# Getting started with the mw-form-builder

## Installation
You can install this package using NPM:
```bash
$ npm i -d mw-form-builder
```

To use the form builder, you need to import the FormBuilderModule and the default Angular ReactiveFormsModule:

```typescript
import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {FormBuilderModule} from "mw-form-builder";

@NgModule({
  imports: [
    FormBuilderModule,
    ReactiveFormsModule
  ],
})
export class AppModule {
}
```

## Creating form elements
The form builder is designed for reusability.
Every field of a form consists of three parts:
- a custom Angular Component which contains the code for displaying the field,
- a form field type, which is a subtype of `AbstractType` and is used in the model,
- an configuration object.

Additionally to this, the form builder knows three types of form fields:
- simple form fields, for example a text field or a password field,
- collection fields which represents a collection of any field type,
- group fields, which are just nested form fields.

Check out the specific guides:
- [Creating simple form fields](./simple-form-fields.md)
- [Creating collection form fields](./collection-form-fields.md)
- [Creating form groups](./form-groups.md)


## Rendering Forms
See [Rendering Forms](./render-forms.md)
