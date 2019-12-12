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
