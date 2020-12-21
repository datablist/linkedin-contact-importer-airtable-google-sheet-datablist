import React, { FunctionComponent } from "react";
import { browser } from "webextension-polyfill-ts";

export const Title:FunctionComponent = () => {
    return (
        <div className="d-flex align-items-center mb-3">
            <div className="">
                <img
                    width={32}
                    height={32}
                    src={browser.runtime.getURL("images/logo.png")}
                />
            </div>
            <div className="ps-3">
                <h3 className="m-0 p-0">LinkedIn Contact Importer</h3>
            </div>
        </div>
    )
}
