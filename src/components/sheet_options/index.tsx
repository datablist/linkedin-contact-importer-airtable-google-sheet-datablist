import React, { useState, useEffect, FunctionComponent, ChangeEvent } from "react";
import { browser } from "webextension-polyfill-ts";

import { GOOGLE_SHEET_SPREADSHEET_ID_STORAGE } from '@src/options'
import GoogleSheetBridge from '@src/services/googleSheetBridge'

import { ConnectionStatus }  from '@src/components/connectionStatus'

import { Mapping } from './mapping'

export const GoogleSheetConf: FunctionComponent = () => {
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('pending');
    const [googleSignInLoading, setGoogleSignInLoading] = useState(false);

    useEffect(()=> {
        browser.storage.local.get([
            GOOGLE_SHEET_SPREADSHEET_ID_STORAGE
        ]).then(function(result) {
            if(result[GOOGLE_SHEET_SPREADSHEET_ID_STORAGE]){
                setSpreadsheetId(result[GOOGLE_SHEET_SPREADSHEET_ID_STORAGE]);
            }
        });

        (async () => {
            const isLoggedIn = await GoogleSheetBridge.isLoggedIn();

            if(isLoggedIn){
                setConnectionStatus('ok')
            } else {
                setConnectionStatus('disconnected')
            }
        })()

    }, [])

    async function handleAuthGoogle(){
        setGoogleSignInLoading(true);

        try {
            await GoogleSheetBridge.authChrome(true);
            setConnectionStatus('ok')
        } catch(err) {
            setConnectionStatus('disconnected')
            setGoogleSignInLoading(false);
        }
    }

    function handleSpreadsheetIdChange(e: ChangeEvent<HTMLInputElement>){
        setSpreadsheetId(e.target.value);
        browser.storage.local.set({
            [GOOGLE_SHEET_SPREADSHEET_ID_STORAGE]: e.target.value
        })
    }

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
    }

    if( connectionStatus == 'pending') {
        return (
            <div>
                Checking Google auth.
            </div>
        )
    } else if( connectionStatus === 'ok') {
        // Check an arbitrary value lengths
        const validConfiguration = (
            spreadsheetId.length > 10
        )

        return (
            <div>
                <div>
                    <ConnectionStatus
                        status="success"
                        text="Connection Established"
                    />
                </div>
                <div>
                    <form
                        onSubmit={handleFormSubmit}
                    >
                        <div className="mb-2">
                            <label
                                htmlFor="google_sheet_id"
                                className="form-label"
                            >
                                Google Sheet Id
                            </label>
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="google_sheet_id"
                                    placeholder="XXXXXXX"
                                    onChange={handleSpreadsheetIdChange}
                                    value={spreadsheetId}
                                />
                                {spreadsheetId.length > 10 && (
                                    <a
                                        className="input-group-text"
                                        href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/`}
                                        target="_blank"
                                    >
                                        <img
                                        width={16}
                                        height={16}
                                        src={browser.runtime.getURL("images/external-link.svg")}
                                        />
                                    </a>
                                )}

                            </div>
                            <div className="form-text">
                                https://docs.google.com/spreadsheets/d/<strong>GoogleSheetId</strong>/edit
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    {validConfiguration && (
                        <Mapping
                            spreadsheetId={spreadsheetId}
                        />
                    )}
                </div>
                <div className="mt-4">
                    Note: Once configured, reload the linkedin page to see the Import button.<br />
                    <a target="_blank" href="https://datablist.github.io/linkedin-contact-importer-airtable-google-sheet-datablist/#google_sheet_conf">Read the documentation to know more.</a>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="text-center">
                    <button
                        className="btn btn-primary"
                        onClick={handleAuthGoogle}
                        disabled={googleSignInLoading}
                    >
                        {googleSignInLoading ? (
                            <span>Loading..</span>
                        ) : (
                            <span>Sign-in with Google</span>
                        )}
                    </button>
                </div>
                <div className="mt-4">
                    Note: You will be asked to authorize "Datablist - LinkedIn Contact Importer" to access your Google Spreadsheet files.<br />
                    <a target="_blank" href="https://datablist.github.io/linkedin-contact-importer-airtable-google-sheet-datablist/#google_sheet_conf">Read the documentation to know more.</a>
                </div>
            </div>
        )
    }
}
