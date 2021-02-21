import React, { useState, useEffect, FunctionComponent } from "react";

import Airtable from 'airtable';

import { PROFILE_FIELDS } from '@src/options'

import {FieldsMapping} from './fields'

interface IMappingProps {
    apiKey: string,
    baseId: string,
    tableId: string
}

export const Mapping: FunctionComponent<IMappingProps> = ({
    apiKey,
    baseId,
    tableId
}) => {
    const [fields, setFields] = useState<string[]>([])
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(()=>{
        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey: apiKey,
            apiVersion: '0.1.0',
            noRetryIfRateLimited: false
        });
        var base = Airtable.base(baseId);

        // Airtable doesnt allow to fetch table schema.. LOL! Ok boomer..
        // Load one record to get fields from it
        base(tableId).select({
            maxRecords: 10
        }).firstPage((error, records) => {
            if(error){
                console.log(error);
                if(error.message){
                    setErrorMessage(error.message)
                }
            } else if(records && records.length>0){
                // Find a record with fields
                const niceRecord = records.find((record) => {
                    return Object.keys(record.fields).length > 1
                })

                if(!niceRecord) {
                    setErrorMessage("To fetch the fields from your table, all the cells from the first row must have values.")
                } else {
                    const fields = Object.keys(niceRecord.fields);
                    setErrorMessage("")
                    setFields(fields)
                }
            } else {
                setErrorMessage("Your Airtable table must have at least one row.")
            }
        });
    }, [
        apiKey,
        baseId,
        tableId
    ])

    return (
        <div className="mt-3">
            {errorMessage ? (
                <div className="mb-3">
                    <span className="status-indicator status-error"></span>
                    <span className="status-text">Connection is not established</span>
                </div>
            ) : (
                <div className="mb-3">
                    <span className="status-indicator status-success"></span>
                    <span className="status-text">Connection is ok</span>
                </div>
            )}

            <div className="mb-3">
                <strong>Mapping Airtable Fields</strong>
            </div>
            {errorMessage ? (
                <div className="alert alert-warning">
                    {errorMessage}
                    <p>
                        <a
                            target="_blank"
                            href="https://datablist.github.io/linkedin-contact-importer-airtable-google-sheet-datablist/#airtable_conf">
                            Please visit documentation to learn more
                        </a>.
                    </p>
                </div>
            ) : (
                <div>
                    {fields.length>0 ? (
                        <div>
                            <FieldsMapping
                                fields={fields}
                                mappings={PROFILE_FIELDS}
                            />
                            <p className="mt-3">
                                <strong>
                                    Notes: To be visible, all the cells from the first row must have values (including the attachment/file/image field).
                                </strong>
                            </p>
                        </div>
                    ) : (
                        <div>Loading..</div>
                    )}
                </div>
            )}
        </div>
    )
}
