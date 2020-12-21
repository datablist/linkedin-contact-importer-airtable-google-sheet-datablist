import React, { useState, ChangeEvent, FunctionComponent, useEffect } from "react";
import { browser } from "webextension-polyfill-ts";

import { GSheetFieldMappingStorage } from '@src/options'

interface IFieldMappingProps {
    mapping: string,
    fields: string[]
}

const FieldMapping: FunctionComponent<IFieldMappingProps> = ({
    mapping,
    fields
}) => {
    const [field, setField] = useState('');
    const storageKey = GSheetFieldMappingStorage(mapping);

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
                [storageKey]: parseInt(e.target.value, 10)
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
                    <option value="-">Select G. Sheet Field</option>
                    {fields.map( (fieldItem, index) => (
                        <option
                            key={fieldItem}
                            value={index}
                        >
                            {fieldItem}
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
