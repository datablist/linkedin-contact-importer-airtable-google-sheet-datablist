

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;
function makeid(length: number): string {
    var result:string  = '';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


const saveResultBtnIdentifier = 'save-result-extension';
export const generateBtnId = (elem: HTMLLIElement) => {
    var elemId: string;
    if(elem.id.length === 0) {
        // We need to have something on the html elem to avoid endless rendering
        if(typeof(elem.dataset.contactImporterId) === "undefined"){
            elemId = makeid(10)
            elem.dataset.contactImporterId = elemId;
        }else{
            elemId = elem.dataset.contactImporterId;
        }
    }else{
        elemId = elem.id;
    }
    return `${saveResultBtnIdentifier}-${elemId}`;
}



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
    btn.className = className ? className : 'ml2 artdeco-button artdeco-button--secondary';

    // btn.style.marginTop = '5px';
    btn.style.display = 'inline-block';
    btn.style.flexShrink = '0';

    return btn;
};

/*
    To avoid a second click, function to disable the btn
*/
export function disableButton(btn: HTMLButtonElement, text: string): HTMLButtonElement{
    btn.className += " artdeco-button--disabled";
    btn.setAttribute('disabled', "")
    btn.innerText = text;

    // Clone button to remove all event handler
    const newBtn = btn.cloneNode(true) as HTMLButtonElement;
    btn.replaceWith(newBtn)
    return newBtn;
}

export const hasElement = (btnIdentifier: string, node: Element | Document): boolean => {
    return !!node.querySelector('#' + btnIdentifier);
}
