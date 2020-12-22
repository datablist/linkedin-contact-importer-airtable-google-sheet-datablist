import { browser } from "webextension-polyfill-ts";

import AirtableBridge from '@src/services/airtableBridge'
import GoogleSheetBridge from '@src/services/googleSheetBridge'

import { BRIDGE_CHOICE_STORAGE, AIRTABLE, SHEET, DATABLIST } from '@src/options'


export async function isBridgeConfigured() {
    const result = await browser.storage.local.get([
        BRIDGE_CHOICE_STORAGE
    ]);

    const bridge = result[BRIDGE_CHOICE_STORAGE];
    if(!bridge) return false;

    if(bridge === AIRTABLE) {
        return await AirtableBridge.isConfigured()
    }else if(bridge === SHEET) {
        return await GoogleSheetBridge.isConfigured()
    }else if(bridge === DATABLIST){
        return false;
    }
}
