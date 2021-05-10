# Chrome Extension - LinkedIn Contact Importer Airtable - Google Sheets - Datablist

[Download the extension on the Chrome Store.](https://chrome.google.com/webstore/detail/linkedin-contact-importer/ldhidjmfmddalaldeppecmcnbiggopdd?hl=en)

This Chrome Extension allows you to import quickly LinkedIn profiles to spreadsheets. It is compatible with Airtable, Google Sheets and Datablist.

Once you have configured your Airtable api key, or sign in with your Google account, a "Save Profile" button will be visible on contact profiles and on listing results.

This is the fastest way to build a list of LinkedIn contacts to do data enrichment, list building for lead generation, competitors employees tracking.

No signup is required other that an Airtable, Google or Datablist account.


The extension is built with the https://github.com/aeksco/react-typescript-web-extension-starter starter kit.

![Import Contacts Listing](images/ImportListingDone.png "Import Contacts Listing")


## How to build it locally

If you want to add features or fix bugs, you can built it locally:

```shell
yarn install
yarn dev
```

`yarn dev` will compile the code in the `dist` directory and watch for file change to keep the `dist` directory up to date.
In [Google Chrome](https://www.google.com/chrome/), open up `chrome://extensions` in a new tab. Make sure the `Developer Mode` checkbox in the upper-right corner is turned on. Click `Load unpacked` and select the `dist` directory from this repository - your extension should now be loaded.

**If you don't want to build it. You can download the zip file in the repo releases https://github.com/datablist/linkedin-contact-importer-airtable-google-sheet-datablist/releases , unzip it and load the folder in Chrome.**


## How to use it

1. Configure a spreadsheet (Airtable, or Google Sheets, or Datablist).

![Chrome](images/Chrome.png "Chrome Configuration")

2. If the configuration is ok, a "Save Profile" button will be added to the listing and profile pages.

![Import Contacts Listing](images/ImportListing.png "Import Contacts Listing")

## Debug Notes

To remove your Google token, go to https://myaccount.google.com/permissions and delete the access. Then to clear the cached token, open the Dev Console on the extension popup and run:

```
chrome.storage.local.clear()
chrome.identity.clearAllCachedAuthTokens(() => {console.log('Token removed')})
```


## Author

Florian Poullin - [Datablist](https://www.datablist.com/)
