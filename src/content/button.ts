

export const createBtn = async ({
    btnIdentifier,
    className,
    text
} : {
    btnIdentifier: string,
    className?: string,
    text?: string
}) => {
    const btn = document.createElement('button');
    const btnText = text ? text : "Save Profile";
    btn.innerHTML = `<span>📌</span> ${btnText}`;
    btn.id = btnIdentifier;
    btn.className = className ? className : 'artdeco-button artdeco-button--secondary';

    btn.style.marginTop = '5px';
    btn.style.display = 'inline-block';
    btn.style.flexShrink = '0';

    return btn;
};

/*
    To avoid a second click, function to disable the btn
*/
export function disableButton(btn: HTMLButtonElement, text: string): void{
    btn.className += " artdeco-button--disabled";
    btn.setAttribute('disabled', "")
    btn.innerText = text;

    // Clone button to remove all event handler
    btn.replaceWith(btn.cloneNode(true))
}

export const hasElement = (btnIdentifier: string, node: Element | Document): boolean => {
    return !!node.querySelector('#' + btnIdentifier);
}
