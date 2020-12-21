import { browser } from "webextension-polyfill-ts";

import { LinkedInProfile } from '../Profile'
import {
    GOOGLE_SHEET_SPREADSHEET_ID_STORAGE,
    GSheetFieldMappingStorage
} from '@src/options'

import { ApiService } from './apiHelper'

const GOOGLE_SHEET_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets/"

interface GSheetValuesJson {
    range: string
    majorDimension: string
    values: Array<string[]>
}


class GoogleSheetBridge {
    readonly apiHelper: ApiService
    accessToken?: string

    spreadsheetId?: string
    destinationColumnIndexes: {[key: string]: number} = {} // {'Name': 0, 'Image': 2}

    constructor() {
        this.initClient()

        browser.storage.onChanged.addListener(() => {
            this.initClient()
        });

        this.apiHelper = new ApiService();
    }

    async initClient() {
        const LinkedInUrlMapping = GSheetFieldMappingStorage('LinkedInUrl');
        const ImageMapping = GSheetFieldMappingStorage('Image');
        const TitleMapping = GSheetFieldMappingStorage('Title');
        const NameMapping = GSheetFieldMappingStorage('Name');

        const result = await browser.storage.local.get([
            GOOGLE_SHEET_SPREADSHEET_ID_STORAGE,
            LinkedInUrlMapping,
            ImageMapping,
            TitleMapping,
            NameMapping
        ])

        if(
            result[GOOGLE_SHEET_SPREADSHEET_ID_STORAGE]
        ) {
            this.spreadsheetId = result[GOOGLE_SHEET_SPREADSHEET_ID_STORAGE];

            this.destinationColumnIndexes = {
                'LinkedInUrl': result[LinkedInUrlMapping],
                'Image': result[ImageMapping],
                'Title': result[TitleMapping],
                'Name': result[NameMapping]
            }
        }
    }

    generateAuthUrl(): string {
        let AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';

        // let client_id = "755133851391-ad7iabsnljv2qggg2sj2adognmva7sjf.apps.googleusercontent.com"; // Use for Chrome

        // A Auth2.0 Client in Web App mode to allow classic auth flow
        let client_id = "755133851391-fm2pdaokepr1keamvmo8eos62cdfn8nk.apps.googleusercontent.com"

        // of the form https://<extension-id>.chromiumapp.org/
        let redirect_uri = browser.identity.getRedirectURL();

        let scope = "https://www.googleapis.com/auth/spreadsheets"
        let auth_params: {[key: string]: string} = {
            client_id,
            redirect_uri,
            response_type: 'token',
            scope
        };

        const paramsObj = new URLSearchParams(auth_params)
        return `${AUTH_URL}?${paramsObj.toString()}`;
    }

    async authChrome(interactive: boolean): Promise<string>{
        return new Promise( (resolutionFunc, rejectionFunc) => {
            chrome.identity.getAuthToken({
                interactive: interactive
            }, function(token) {
                if(token) {
                    resolutionFunc(token)
                } else {
                    rejectionFunc('Couldnt get token')
                }
            });
        });

    }

    /*
        Will be used for Firefox/Other versions
    */
    async authBrowserGeneric(interactive: boolean): Promise<string> {
        return new Promise( (resolutionFunc, rejectionFunc) => {

            const auth_url = this.generateAuthUrl();

            browser.identity.launchWebAuthFlow({
                url: auth_url,
                interactive: interactive
            }).then( (responseUrl) => {
                const url = new URL(responseUrl);
                const urlParams = new URLSearchParams(url.hash.slice(1));
                const params = Object.fromEntries(urlParams.entries()); // access_token, expires_in

                // access_token: "ya29.Dpl8475Pkk"
                // expires_in: "3598"
                // scope: "https://www.googleapis.com/auth/spreadsheets"
                // token_type: "Bearer"

                resolutionFunc(params['access_token'])
            }).catch( (res) => {
                console.log(res)
                rejectionFunc(res)
            })

        })
    }

    async getAccessToken(
        interactive: boolean = false,
    ): Promise<string> {
        // forceReload: boolean = false
        // if(!this.accessToken || forceReload){
            //     this.accessToken = await this.authChrome(interactive);
            // }

        this.accessToken = await this.authChrome(interactive);
        return this.accessToken;
    }

    async isConfigured(): Promise<boolean> {
        try {
            await this.getAccessToken(false);
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async fetchColumns(spreadsheetId: string): Promise<string[]> {
        const accessToken = await this.getAccessToken()

        this.apiHelper.setToken(`Bearer ${accessToken}`)

        const sheetsUrl = `${GOOGLE_SHEET_BASE_URL}${spreadsheetId}/values/A1:K1`;
        const res = await this.apiHelper.apiCall(sheetsUrl);
        const gsheetValues = res.body as GSheetValuesJson;

        return gsheetValues['values'][0];
    }

    getColumnIndex(field: string): number | undefined {
        return this.destinationColumnIndexes[field];
    }

    async createProfiles(profiles: LinkedInProfile[]) {
        if(!this.spreadsheetId) {
            return;
        }

        const accessToken = await this.getAccessToken()
        this.apiHelper.setToken(`Bearer ${accessToken}`)

        const linkedInUrlPosition = this.getColumnIndex('LinkedInUrl');
        const imagePosition = this.getColumnIndex('Image');
        const titlePosition = this.getColumnIndex('Title');
        const namePosition = this.getColumnIndex('Name');

        const rows:Array<string[]> = [];

        profiles.forEach(profile => {
            const row: string[] = new Array(50); // Init an empty array of 50

            if( (namePosition != null) && profile.name){
                row[namePosition] = profile.name;
            }

            if( (linkedInUrlPosition != null) && profile.link){
                row[linkedInUrlPosition] = profile.link;
            }

            if( (imagePosition != null) && profile.imageSrc){
                row[imagePosition] = profile.imageSrc;
            }

            if( (titlePosition != null) && profile.title){
                row[titlePosition] = profile.title;
            }

            rows.push(row)
        })

        const toSend = {
            values: rows
        }

        const sheetsUrl = `${GOOGLE_SHEET_BASE_URL}${this.spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`

        return await this.apiHelper.apiCall(
            sheetsUrl,
            'POST',
            toSend
        );
    }

}

export default new GoogleSheetBridge();
