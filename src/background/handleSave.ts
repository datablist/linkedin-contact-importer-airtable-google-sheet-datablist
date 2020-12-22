import { browser, Tabs } from "webextension-polyfill-ts";

import { LinkedInProfile } from '@src/Profile'

import AirtableBridge from '@src/services/airtableBridge'
import GoogleSheetBridge from '@src/services/googleSheetBridge'

import { BRIDGE_CHOICE_STORAGE, AIRTABLE, SHEET, DATABLIST } from '@src/options'


export async function saveProfiles(
    tab: Tabs.Tab | undefined,
    profiles: LinkedInProfile[]
) {

    const result = await browser.storage.local.get([
        BRIDGE_CHOICE_STORAGE
    ])

    const bridge = result[BRIDGE_CHOICE_STORAGE];
    if(!bridge) {
        throw new Error("No bridge configured");
    };

    if(bridge === AIRTABLE) {
        return await AirtableBridge.createProfiles(profiles)
    }else if(bridge === SHEET) {
        return await GoogleSheetBridge.createProfiles(profiles)
    }else if(bridge === DATABLIST){
        throw new Error("Datablist is not yet available");
    }


    // if (!tab) {
    //     return;
    // }
    // const { id: tabId } = tab
    // if (response) {
    //     browser.tabs.sendMessage(tabId, {
    //         action: "GOOD"
    //     })
    // }
}
