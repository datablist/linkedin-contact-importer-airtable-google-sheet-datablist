import React, { useState, useEffect, ChangeEvent, FunctionComponent } from "react";
import { browser } from "webextension-polyfill-ts";

import {
    AIRTABLE_APIKEY_STORAGE,
    AIRTABLE_BASEID_STORAGE,
    AIRTABLE_TABLEID_STORAGE
} from '@src/options'

import { Mapping } from './mapping'


export const  AirtableConf: FunctionComponent = () => {
    const [apiKey, setApiKey] = useState('')
    const [hideApiKey, setHideApiKey] = useState(true)
    const [baseId, setBaseId] = useState('')
    const [tableId, setTableId] = useState('')

    useEffect(()=> {
        browser.storage.local.get([
            AIRTABLE_APIKEY_STORAGE,
            AIRTABLE_BASEID_STORAGE,
            AIRTABLE_TABLEID_STORAGE
        ]).then(function(result) {
            if(result[AIRTABLE_APIKEY_STORAGE]){
                setApiKey(result[AIRTABLE_APIKEY_STORAGE]);
            }
            if(result[AIRTABLE_BASEID_STORAGE]){
                setBaseId(result[AIRTABLE_BASEID_STORAGE]);
            }
            if(result[AIRTABLE_TABLEID_STORAGE]){
                setTableId(result[AIRTABLE_TABLEID_STORAGE]);
            }
        });
    }, [])

    function handleApiKeyChange(e: ChangeEvent<HTMLInputElement>){
        setApiKey(e.target.value);
        browser.storage.local.set({
            [AIRTABLE_APIKEY_STORAGE]: e.target.value
        })
    }

    function handleBaseIdChange(e: ChangeEvent<HTMLInputElement>){
        setBaseId(e.target.value);
        browser.storage.local.set({
            [AIRTABLE_BASEID_STORAGE]: e.target.value
        })
    }

    function handleTableIdChange(e: ChangeEvent<HTMLInputElement>){
        setTableId(e.target.value);
        browser.storage.local.set({
            [AIRTABLE_TABLEID_STORAGE]: e.target.value
        })
    }

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
    }

    function toggleVisibilityApiKey(){
        setHideApiKey(!hideApiKey)
    }

    // Check an arbitrary value lengths
    const validConfiguration = (
        apiKey.length > 10 &&
        baseId.length > 10 &&
        tableId.length > 1
    )

    return (
        <div>
            <form
                onSubmit={handleFormSubmit}
            >
                <div className="mb-2">
                    <label
                        htmlFor="airtable_api_key"
                        className="form-label"
                    >
                        Airtable API Key
                    </label>
                    <div className="input-group mb-2">
                        <input
                            type={hideApiKey ? "password" : "text"}
                            className="form-control"
                            id="airtable_api_key"
                            placeholder="keyXXXXXXX"
                            onChange={handleApiKeyChange}
                            value={apiKey}
                        />
                        <span
                            className="input-group-text"
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={toggleVisibilityApiKey}
                        >
                            <img
                                width={16}
                                height={16}
                                src={browser.runtime.getURL("images/eye.svg")}
                            />
                        </span>
                    </div>
                </div>
                <div className="mb-2">
                    <label
                        htmlFor="airtable_base_id"
                        className="form-label"
                    >
                        Airtable Base Id
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="airtable_base_id"
                        placeholder="appXXXXXXX"
                        onChange={handleBaseIdChange}
                        value={baseId}
                    />
                </div>
                <div className="mb-2">
                    <label
                        htmlFor="airtable_table_id"
                        className="form-label"
                    >
                        Airtable Table Id
                    </label>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="airtable_table_id"
                            placeholder="tblXXXXXXX"
                            onChange={handleTableIdChange}
                            value={tableId}
                        />
                        {tableId.length > 10 && (
                            <a
                                className="input-group-text"
                                href={`https://airtable.com/${tableId}/`}
                                target="_blank"
                            >
                                <img
                                width={16}
                                height={16}
                                src={browser.runtime.getURL("images/external-link.svg")}
                                />
                            </a>
                        )}
                    </div>
                    <div className="form-text">
                        https://airtable.com/<strong>AirtableTableId</strong>/xxxxxx
                    </div>
                </div>
            </form>

            {validConfiguration ? (
                <Mapping
                    apiKey={apiKey}
                    baseId={baseId}
                    tableId={tableId}
                />
            ) : (
                <p>
                    <a
                        target="_blank"
                        href="https://datablist.github.io/linkedin-contact-importer-airtable-google-sheet-datablist/#airtable_conf">
                        Read the documentation.
                    </a>
                </p>
            )}
        </div>
    )
}
