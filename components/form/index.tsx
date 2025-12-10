'use client';

import clsx from 'clsx';
import { submitForm } from 'components/form-actions';
import { UmbracoForm, UmbracoFormField } from 'lib/umbraco/types';
import { useEffect, useState, useTransition } from 'react';

export const fieldComponentMap: { [id: string]: any } = {
  'ShortAnswer': UmbTextInputField,
  'LongAnswer': UmbTextAreaField,
  'Dropdown': UmbSelectField,
  'DataConsent': UmbCheckboxField,
  // TODO: 'FileUpload': UmbUploadField,
  // TODO: 'Recaptcha2': UmbRecaptcha2Field,
  // TODO: Others...
}

function UmbForm({
  form,
  ...props
} : { 
  form: UmbracoForm
} & React.ComponentProps<'form'>) {
  
  const [data, setData] = useState<any>({});
  const [submitMessage, setSubmitMessage] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<{ [id: string]: string[] }>();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? (event.target.checked ? 'true' : 'false') : event.target.value;
    setData((v: any) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(undefined);
    setValidationErrors(undefined);
    startTransition(() => {
      submitForm(form.id, data).then(res => {
        if (!res) { // If successful the response will be null
          resetForm()
          setSubmitMessage(form.messageOnSubmit);
        } else {
          setValidationErrors(res.errors);
        }
      });
    });
  };

  const resetForm = () => {
    const initData: any = {};
    form.pages.forEach(p => {
      p.fieldsets.forEach(f => {
        f.columns.forEach(c => {
          c.fields.forEach(fld => {
            initData[fld.alias] = '';
          })
        })
      })
    })
    setData(initData);
  }

  const pascalize = (str: string) : string => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  useEffect(() => {
    const initData: any = {};
    form.pages.forEach(p => {
      p.fieldsets.forEach(f => {
        f.columns.forEach(c => {
          c.fields.forEach(fld => {
            initData[fld.alias] = fld.settings['DefaultValue'] || '';
          })
        })
      })
    })
    setData(initData);
  }, [form]);

  return (
    <form {...props} className={clsx('not-prose', props.className)} onSubmit={handleSubmit}>
      {submitMessage && (
        <div className={clsx('border-green-500 border-2 rounded p-4 bg-green-50 text-green-500 mb-8', props.className)}>{submitMessage}</div>
      )}
      {validationErrors && (<div className='border-red-500 border-2 rounded p-4 bg-red-50 text-red-500 mb-8'>
        <div className='font-bold'>Validation failed. Please resolve the following errors:</div>
        <ul className='m-0 list-disc list-inside'>
          {Object.keys(validationErrors).map(key => (
            <li key={key}>{validationErrors[key]}</li>
          ))}
        </ul>
      </div>)}
      {form.pages.map((page, pageIdx) => (
        <div key={pageIdx} className={clsx('')}>
          {page.caption && (<h2 className='font-bold text-2xl mb-4'>{page.caption}</h2>)}
          {page.fieldsets.map(fieldset => (
            <fieldset key={fieldset.id} className={clsx('grid grid-cols-12')}>
              {fieldset.caption && (<legend>{fieldset.caption}</legend>)}
              {fieldset.columns.map((col, colIdx) => (
                <div key={colIdx} className={clsx(`col-span-${col.width}`)}>
                  {col.fields.map(fld => (
                    <div key={fld.alias} className={clsx('mb-4')}>
                      <label htmlFor={'el-' + fld.id} className='block font-bold mb-1'>{fld.caption} {fld.required ? form.indicator || '*' : ''}</label>
                      {fld.helpText && (<small className='block -mt-1 mb-1'>{fld.helpText}</small>)} 
                      <UmbFormDynamicField type={pascalize(fld.type.name)} field={fld} value={data[fld.alias]} onChange={handleChange} />
                    </div>
                  ))}
                </div> 
              ))}
            </fieldset>
          ))}
      </div>
      ))}
      <button type='submit' className={
        clsx('btn btn-lg w-full font-bold mt-4 bg-umb-blue text-white hover:bg-umb-green disabled:bg-stb-15 disabled:text-black')}
        disabled={isPending}>{form.submitLabel || 'Submit'}</button>
    </form>
  );
}

function UmbFormDynamicField({
  type,
  field,
  value,
  onChange
}: {
  type: string,
  field: UmbracoFormField,
  value: any,
  onChange: (event: any) => void
}) {
  const DynamicComponent = fieldComponentMap[type];
  const dynamicProps: any = { field, value, onChange }
  return <DynamicComponent {...dynamicProps} />
}

function UmbTextInputField({
  field,
  ...props
}: {
  field: UmbracoFormField
} & React.ComponentProps<'input'>) {
  return <input type={field.settings['FieldType'] || 'text'} 
    id={'el-' + field.id}
    name={field.alias} 
    placeholder={field.settings['Placeholder']} 
    maxLength={field.settings['MaximumLength']} 
    required={field.required}
    value={props.value} 
    onChange={props.onChange}
    className='w-full'  />
}

function UmbTextAreaField({
  field,
  ...props
}: {
  field: UmbracoFormField
} & React.ComponentProps<'textarea'>) {
  return <textarea id={'el-' + field.id}
    name={field.alias} 
    placeholder={field.settings['Placeholder']} 
    maxLength={field.settings['MaximumLength']} 
    required={field.required}
    value={props.value} 
    onChange={props.onChange}
    className='w-full' rows={5}></textarea>
}

function UmbSelectField({
  field,
  ...props
}: {
  field: UmbracoFormField
} & React.ComponentProps<'select'>) {
  return <select id={'el-' + field.id}
    name={field.alias} 
    required={field.required}
    value={props.value} 
    onChange={props.onChange}
    className='w-full'>
      {field.settings['SelectPrompt'] && (<option value="">{field.settings['SelectPrompt']}</option>)}
      {field.preValues.map(pv => (
        <option key={pv.value} value={pv.value}>{pv.caption}</option>
      ))}
    </select>
}

function UmbCheckboxField({
  field,
  ...props
}: {
  field: UmbracoFormField
} & React.ComponentProps<'input'>) {
  return <label>
      <input id={'el-' + field.id}
        name={field.alias} 
        type='checkbox'
        required={field.required}
        checked={props.value === 'true'}
        onChange={props.onChange} />
      <span className='ml-2'>{field.settings['AcceptCopy']}</span>
    </label>
}

export default UmbForm;