export const BRIDGE_CHOICE_STORAGE = "BridgeSelectStorage";

export const AIRTABLE = "airtable";
export const SHEET = "sheet";
export const DATABLIST = "datablist";

export const AIRTABLE_APIKEY_STORAGE = "AirtableApiKey";
export const AIRTABLE_BASEID_STORAGE = "AirtableBaseId";
export const AIRTABLE_TABLEID_STORAGE = "AirtableTableId";
export const PROFILE_FIELDS = [
    "LinkedInUrl",
    "Image",
    "Title",
    "Company",
    "Name"
]
export const AirtableFieldMappingStorage = (field: string): string => {
    return `AirtableField-${field}`
}


export const DATABLIST_APIKEY_STORAGE = "DatablistApiKey";
export const DATABLIST_COLLECTIONID_STORAGE = "DatablistCollectionId";


export const GOOGLE_SHEET_SPREADSHEET_ID_STORAGE = "GSheetSpreadSheetId";
export const GSheetFieldMappingStorage = (field: string): string => {
    return `SheetField-${field}`
}
