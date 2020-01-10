import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType} from '../form-type/abstract-group-type';

export abstract class AbstractGroupFormField<FormType extends AbstractGroupType<any>> extends AbstractFormFieldComponent<FormType> {
}
