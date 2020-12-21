import { browser } from "webextension-polyfill-ts";

import AirtableBridge from '@src/services/airtableBridge'
import GoogleSheetBridge from '@src/services/googleSheetBridge'

import { BRIDGE_CHOICE_STORAGE, AIRTABLE, SHEET, DATABLIST } from '@src/options'


export async function isBridgeConfigured() {
    return new Promise( (resolutionFunc) => {

        browser.storage.local.get([
            BRIDGE_CHOICE_STORAGE
        ]).then(async function(result) {
            const bridge = result[BRIDGE_CHOICE_STORAGE];
            if(!bridge) return;

            if(bridge === AIRTABLE) {
                const response = await AirtableBridge.isConfigured()
                resolutionFunc(response)

            }else if(bridge === SHEET) {
                const response = await GoogleSheetBridge.isConfigured()
                resolutionFunc(response)

            }else if(bridge === DATABLIST){
                resolutionFunc(false)
            }

        });

    })
}
