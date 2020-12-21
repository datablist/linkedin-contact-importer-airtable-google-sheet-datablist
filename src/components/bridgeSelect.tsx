import React, { FunctionComponent } from "react";
import { browser } from "webextension-polyfill-ts";

import { AIRTABLE, SHEET, DATABLIST } from '@src/options'

interface IBridgeChoiceProps {
    onSelect: Function
    iconSrc: string
    active: boolean
    identifier: string
    name: string
}

const BridgeChoice:FunctionComponent<IBridgeChoiceProps> = ({
    onSelect,
    iconSrc,
    active,
    identifier,
    name
}) => {
    const classes = [
        "btn",
        "flex-fill",
        "pill-output-choice"
    ]

    if(active){
        classes.push('active')
    }

    return (
        <button
            className={classes.join(' ')}
            onClick={() => onSelect(identifier)}
        >
            <img
                width={16}
                height={16}
                src={iconSrc}
            />
            <span className="ms-2">{name}</span>
        </button>
    )
}


interface IBridgeSelectProps {
    value: string
    onSelect: Function
}

export const BridgeSelect:FunctionComponent<IBridgeSelectProps> = ({
    value,
    onSelect
}) => {

    return (
        <div className="d-flex align-items-center">
            <BridgeChoice
                iconSrc={browser.runtime.getURL("images/airtable-icon.svg")}
                name="Airtable"
                onSelect={onSelect}
                identifier={AIRTABLE}
                active={value == AIRTABLE}
            />
            <BridgeChoice
                iconSrc={browser.runtime.getURL("images/google-sheets-icon.svg")}
                name="G. Sheet"
                onSelect={onSelect}
                identifier={SHEET}
                active={value == SHEET}
            />
            <BridgeChoice
                iconSrc={browser.runtime.getURL("images/datablist-icon.svg")}
                name="Datablist"
                onSelect={onSelect}
                identifier={DATABLIST}
                active={value == DATABLIST}
            />
        </div>
    )
}
