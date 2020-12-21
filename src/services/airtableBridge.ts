import { browser } from "webextension-polyfill-ts";
import Airtable from 'airtable'

import { LinkedInProfile } from '../Profile'

import {
    AIRTABLE_APIKEY_STORAGE,
    AIRTABLE_BASEID_STORAGE,
    AIRTABLE_TABLEID_STORAGE,
    AirtableFieldMappingStorage
} from '@src/options'

class AirtableBridge {
    base?: any
    tableId?: string
    mapping: {[key: string]: string} = {}

    constructor() {
        this.initClient()

        browser.storage.onChanged.addListener(() => {
            this.initClient()
        });
    }

    async initClient() {
        const LinkedInUrlMapping = AirtableFieldMappingStorage('LinkedInUrl');
        const ImageMapping = AirtableFieldMappingStorage('Image');
        const TitleMapping = AirtableFieldMappingStorage('Title');
        const NameMapping = AirtableFieldMappingStorage('Name');

        const result = await browser.storage.local.get([
            AIRTABLE_APIKEY_STORAGE,
            AIRTABLE_BASEID_STORAGE,
            AIRTABLE_TABLEID_STORAGE,
            LinkedInUrlMapping,
            ImageMapping,
            TitleMapping,
            NameMapping
        ])

        if(
            result[AIRTABLE_APIKEY_STORAGE] &&
            result[AIRTABLE_BASEID_STORAGE] &&
            result[AIRTABLE_TABLEID_STORAGE]
        ) {            
            Airtable.configure({
                endpointUrl: 'https://api.airtable.com',
                apiKey: result[AIRTABLE_APIKEY_STORAGE],
                apiVersion: '0.1.0',
                noRetryIfRateLimited: false
            });

            this.base = Airtable.base(result[AIRTABLE_BASEID_STORAGE]);
            this.tableId = result[AIRTABLE_TABLEID_STORAGE];

            this.mapping = {
                'LinkedInUrl': result[LinkedInUrlMapping],
                'Image': result[ImageMapping],
                'Title': result[TitleMapping],
                'Name': result[NameMapping]
            }
        }
    }

    async isConfigured(): Promise<boolean> {
        const LinkedInUrlMapping = AirtableFieldMappingStorage('LinkedInUrl');
        const ImageMapping = AirtableFieldMappingStorage('Image');
        const TitleMapping = AirtableFieldMappingStorage('Title');
        const NameMapping = AirtableFieldMappingStorage('Name');

        const result = await browser.storage.local.get([
            AIRTABLE_APIKEY_STORAGE,
            AIRTABLE_BASEID_STORAGE,
            AIRTABLE_TABLEID_STORAGE,
            LinkedInUrlMapping,
            ImageMapping,
            TitleMapping,
            NameMapping
        ]);

        if(!result[AIRTABLE_APIKEY_STORAGE]) return false;
        if(!result[AIRTABLE_BASEID_STORAGE]) return false;
        if(!result[AIRTABLE_TABLEID_STORAGE]) return false;
        if(!result[LinkedInUrlMapping]) return false;

        return true;
    }

    getMapping(field: string): string | null {
        return this.mapping[field] || null;
    }

    async createProfiles(profiles: LinkedInProfile[]) {
        const linkedInUrlField = this.getMapping('LinkedInUrl');
        const imageField = this.getMapping('Image');
        const titleField = this.getMapping('Title');
        const nameField = this.getMapping('Name');

        const records:object[] = [];
        profiles.forEach(profile => {
            const fields: {[key: string]: any} = {}

            if(linkedInUrlField){
                fields[linkedInUrlField] = profile.link
            }

            if(imageField){
                fields[imageField] = profile.imageSrc ? [{
                    url: profile.imageSrc
                }] : null
            }

            if(titleField){
                fields[titleField] = profile.title
            }

            if(nameField){
                fields[nameField] = profile.name
            }

            records.push({
                "fields": fields
            })
        })

        const res = await this.base(this.tableId).create(records)
        return res;
    }
}

export default new AirtableBridge()
