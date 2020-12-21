import React, { useState, ChangeEvent, FunctionComponent, useEffect } from "react";
import { browser } from "webextension-polyfill-ts";

import { AirtableFieldMappingStorage } from '@src/options'

interface IFieldMappingProps {
    mapping: string,
    fields: string[]
}

const FieldMapping: FunctionComponent<IFieldMappingProps> = ({
    mapping,
    fields
}) => {
    const [field, setField] = useState('');
    const storageKey = AirtableFieldMappingStorage(mapping);

    useEffect(()=>{
        browser.storage.local.get([
            storageKey
        ]).then(function(result) {
            setField(result[storageKey]);
        });
    }, [])

    function onSelectChange(e: ChangeEvent<HTMLSelectElement>){
        setField(e.target.value);
        if(e.target.value === "-"){
            browser.storage.local.remove(storageKey)
        } else {
            browser.storage.local.set({
                [storageKey]: e.target.value
            })
        }
    }

    return (
        <div
            className="row mb-1 d-flex align-items-center"
        >
            <div className="col-4">

                <label
                    htmlFor={`field_mapping_${mapping}`}
                    className="form-label"
                >
                    {mapping}
                </label>
            </div>
            <div className="col-8">
                <select
                    className="form-select"
                    id={`field_mapping_${mapping}`}
                    onChange={onSelectChange}
                    value={field}
                >
                    <option value="-">Select Airtable Field</option>
                    {fields.map( (field) => (
                        <option
                            key={field}
                            value={field}
                        >
                            {field}
                        </option>
                    ))}
                </select>

            </div>
        </div>
    )

}

interface IFieldsMappingProps {
    fields: string[],
    mappings: string[]
}

export const FieldsMapping: FunctionComponent<IFieldsMappingProps> = ({
    fields,
    mappings
}) => {
    return (
        <div className="">
            {mappings.map((fieldMapping) => (
                <FieldMapping
                    key={fieldMapping}
                    mapping={fieldMapping}
                    fields={fields}
                />
            ))}
        </div>
    )
}
