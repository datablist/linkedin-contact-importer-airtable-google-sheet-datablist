import React, { useState, useEffect, FunctionComponent, ChangeEvent } from "react";
import { browser } from "webextension-polyfill-ts";

import {
    DATABLIST_APIKEY_STORAGE
} from '@src/options'


/*

    ToDo

*/


export const DatablistConf: FunctionComponent = () => {
    const [apiKey, setApiKey] = useState('')

    useEffect(()=> {
        browser.storage.local.get([
            DATABLIST_APIKEY_STORAGE
        ]).then(function(result) {
            if(result[DATABLIST_APIKEY_STORAGE]){
                setApiKey(result[DATABLIST_APIKEY_STORAGE]);
            }
        });
    }, [])

    function handleApiKeyChange(e: ChangeEvent<HTMLInputElement>){
        setApiKey(e.target.value);
        browser.storage.local.set({
            [DATABLIST_APIKEY_STORAGE]: e.target.value
        })
    }

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
    }

    // Check an arbitrary value lengths
    const validConfiguration = (
        apiKey.length > 10
    )

    return (
        <div>
            <form
                onSubmit={handleFormSubmit}
            >
                <div className="mb-2">
                    <label
                        htmlFor="datablist_api_key"
                        className="form-label"
                    >
                        Datablist API Key
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="datablist_api_key"
                        placeholder="XXXXXXX"
                        onChange={handleApiKeyChange}
                        value={apiKey}
                    />
                </div>
            </form>

            <div>
                <a href="https://www.datablist.com" target="_blank">
                    Visit Datablist to get your API Key.
                </a>
            </div>

        </div>
    )
}
