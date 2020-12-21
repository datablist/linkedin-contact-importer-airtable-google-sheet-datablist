import React, { useState, useEffect, FunctionComponent, ChangeEvent } from "react";
import { browser } from "webextension-polyfill-ts";

import { GOOGLE_SHEET_SPREADSHEET_ID_STORAGE } from '@src/options'
import GoogleSheetBridge from '@src/services/googleSheetBridge'

import { ConnectionStatus }  from '@src/components/connectionStatus'

import { Mapping } from './mapping'

export function GoogleSheetConf(){
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('pending');

    useEffect(()=> {
        browser.storage.local.get([
            GOOGLE_SHEET_SPREADSHEET_ID_STORAGE
        ]).then(function(result) {
            if(result[GOOGLE_SHEET_SPREADSHEET_ID_STORAGE]){
                setSpreadsheetId(result[GOOGLE_SHEET_SPREADSHEET_ID_STORAGE]);
            }
        });

        (async () => {
            const isConfigured = await GoogleSheetBridge.isConfigured();

            if(isConfigured){
                setConnectionStatus('ok')
            } else {
                setConnectionStatus('disconnected')
            }
        })()

    }, [])

    async function handleAuthGoogle(){
        try {
            await GoogleSheetBridge.authChrome(true);
            setConnectionStatus('ok')
        } catch(err) {
            setConnectionStatus('disconnected')
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
                            <input
                                type="text"
                                className="form-control"
                                id="google_sheet_id"
                                placeholder="XXXXXXX"
                                onChange={handleSpreadsheetIdChange}
                                value={spreadsheetId}
                            />
                            <div
                                className="form-text"
                            >
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
            </div>
        )
    } else {
        return (
            <div>

                <button
                    className="btn btn-primary"
                    onClick={handleAuthGoogle}
                >
                    Sign-in with Google
                </button>
            </div>
        )
    }
}
