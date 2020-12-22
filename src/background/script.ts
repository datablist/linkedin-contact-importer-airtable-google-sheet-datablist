import { browser, Runtime } from "webextension-polyfill-ts";

import { LinkedInProfile } from '@src/Profile'

import {saveProfiles} from './handleSave'
import {isBridgeConfigured} from './handleConfigured'


interface IMessage {
    action: string
    payload: object
}

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener(async (
    message: IMessage,
    sender: Runtime.MessageSender
) => {
    const { tab } = sender;

    if(message.action == "checkIfConfigured"){
        return await isBridgeConfigured()
    }else if(message.action == "saveProfiles"){
        return await saveProfiles(tab, message.payload as LinkedInProfile[])
    }

    console.log(message);
});
