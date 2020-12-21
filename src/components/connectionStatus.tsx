import React, { FunctionComponent } from "react";


interface IConnactionStatusProps {
    status: 'success' | 'error',
    text: string
}


export const ConnectionStatus:FunctionComponent<IConnactionStatusProps> = ({
    status,
    text
}) => {
    return (
        <div className="mb-3">
            <span
                className={`status-indicator status-${status}`}
            ></span>
            <span className="status-text">
                {text}
            </span>
        </div>
    )
}
