# Changelog

## 1.1.0-beta3
- Fixed FormGroup, FormControl and FormArray initialization when the form was rebuild
- Added a `control` field to the AbstractType which holds the form control 

## 1.1.0-beta2
Fixed wrong bool check in FormControl abstractions

## 1.1.0-beta1
Improved performance
- Created own FormArray, FormGroup and FormControl which extends from the default Angular classes.
- This abstractions blocks the `updateValueAndValidity` calls until the form rendering has finished
- Checking in the `FormGroupComponent.ngAfterViewInit` hook, if the form was already rendered and block unnecessary rebuilding.

Other changes:
- Replaced `x.hasOwnProperty('y')` by `'y' in x` and replaced `if (x != null)` by `if (x)` to improve the readability.
- Added `asyncValidators` and `updateOn` to the AbstractType and made `validators` non abstract

## 1.0.0
Thanks to [@billbeeio](https://github.com/billbeeio) for many improvements ([PR#1](https://github.com/mintware-de/mw-form-builder/pull/1))

Overall:
- Docs updated
- Abstract components added
- Abstract field types added
- Added FormArray type and FormGroup type. This allows to build complex and reusable form models.
- added the `getErrors` method to the form builder. It returns all validation errors as a nested object

## 0.0.2
Initial Release
