import React, { useState, useEffect, FunctionComponent } from "react";

import { PROFILE_FIELDS } from '@src/options'
import GoogleSheetBridge from '@src/services/googleSheetBridge'

import {FieldsMapping} from './fields'

interface IMappingProps {
    spreadsheetId: string
}

export const Mapping: FunctionComponent<IMappingProps> = ({
    spreadsheetId
}) => {
    const [fields, setFields] = useState<string[]>([])
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const columns = await GoogleSheetBridge.fetchColumns(spreadsheetId)
                setErrorMessage("")
                setFields(columns)
            } catch(err) {
                setErrorMessage('Couldnt fetch spreadsheet')
            }
        })()
    }, [spreadsheetId])

    return (
        <div className="mt-3">
            <div className="mb-3">
                <strong>Mapping Google Sheet Fields</strong>

                <div className="mt-3">
                {errorMessage ? (
                    <div className="alert alert-warning">
                        {errorMessage}
                        <p>
                            <a
                                target="_blank"
                                href="https://datablist.github.io/linkedin-contact-importer-airtable-google-sheet-datablist/#google_sheet_conf">
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
                                    Notes: The columns are fetched from the first row.
                                </strong>
                            </p>
                        </div>
                    ) : (
                        <div>Loading fields</div>
                    )}
                    </div>
                )}
                </div>

            </div>

        </div>
    )
}
