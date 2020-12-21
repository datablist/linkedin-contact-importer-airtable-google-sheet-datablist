import { browser, Tabs } from "webextension-polyfill-ts";

import { LinkedInProfile } from '@src/Profile'

import AirtableBridge from '@src/services/airtableBridge'
import GoogleSheetBridge from '@src/services/googleSheetBridge'

import { BRIDGE_CHOICE_STORAGE, AIRTABLE, SHEET, DATABLIST } from '@src/options'


export async function saveProfiles(tab: Tabs.Tab | undefined, profiles: LinkedInProfile[]) {

    browser.storage.local.get([
        BRIDGE_CHOICE_STORAGE
    ]).then(async function(result) {
        const bridge = result[BRIDGE_CHOICE_STORAGE];
        if(!bridge) return;

        if(bridge === AIRTABLE) {
            const response = await AirtableBridge.createProfiles(profiles)
        }else if(bridge === SHEET) {
            const response = await GoogleSheetBridge.createProfiles(profiles)
        }else if(bridge === DATABLIST){

        }

    });


    if (!tab) {
        return;
    }
    const { id: tabId } = tab
    // if (response) {
    //     browser.tabs.sendMessage(tabId, {
    //         action: "GOOD"
    //     })
    // }
}
