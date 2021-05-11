import React, { useState, useEffect, FunctionComponent } from "react";
import { browser } from "webextension-polyfill-ts";

import { Title } from '@src/components/title'
import { BridgeSelect } from '@src/components/bridgeSelect'
import { AirtableConf } from '@src/components/airtable_options'
import { GoogleSheetConf } from '@src/components/sheet_options'
import { DatablistConf } from '@src/components/datablist_options'

import { AIRTABLE, SHEET, DATABLIST, BRIDGE_CHOICE_STORAGE } from '@src/options'

import "./styles.scss";

export const Popup: FunctionComponent = () => {
    const [bridge, setBridge] = useState('');

    useEffect(() => {
        browser.storage.local.get([
            BRIDGE_CHOICE_STORAGE
        ]).then(function(result) {
            if(result[BRIDGE_CHOICE_STORAGE]){
                setBridge(result[BRIDGE_CHOICE_STORAGE])
            } else {
                setBridge(AIRTABLE)
            }
        });

    }, [])

    function handleSelect(bridgeValue: string){
        setBridge(bridgeValue);
        browser.storage.local.set({
            [BRIDGE_CHOICE_STORAGE]: bridgeValue
        })
    }

    let optionsComponent: React.ReactNode;
    if (bridge === AIRTABLE){
        optionsComponent = <AirtableConf />
    } else if (bridge === SHEET){
        optionsComponent = <GoogleSheetConf />
    } else if (bridge === DATABLIST){
        optionsComponent = <DatablistConf />
    } else {
        optionsComponent = (
            <div>.</div>
        )
    }

    return (
        <div className="popup-container">
            <div className="container mt-3 ">
                <Title />
                <BridgeSelect
                    onSelect={handleSelect}
                    value={bridge}
                />

                <div className="mx-2 my-3">
                    {optionsComponent}
                </div>
            </div>
        </div>
    );
};
