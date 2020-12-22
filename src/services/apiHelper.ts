
interface Response {
    status: number
    body: object
    ok: boolean
}

export class ApiService {
    token?: string;

    constructor(token?: string) {
        if(token){
            this.token = token;
        }
    }

    setToken(token: string): void {
        this.token = token;
    }

    /**
     * Build  http headers object
     */
    buildHeaders(): Headers {
        let headers = new Headers();

        headers.append('Content-type', 'application/json');

        if (this.token) {
            headers.append('Authorization', this.token);
        }

        return headers;
    }

    /**
     * Throw common error on not successful status
     * @param {object} response
     * @param {bool} auth - check for unauth error or not
     */
    handleCommonError(response: Response) {
        if (response.status < 200 || response.status >= 400) {
            throw new Error(`Receive error code ${response.status}`)
        }
        return;
    }

    /**
     * Service function to avoid repetition of fetch everywhere
     * @param {string} url - url to fetch
     * @param {string} method - method get or post
     * @param {object} params - params payload
     */
    async apiCall(
        url: string,
        method = 'GET',
        params?: object
    ): Promise<Response> {
        let payload: RequestInit = {
            method,
            mode: 'cors',
            headers: this.buildHeaders(),
        }
        if (params) {
            payload.body = JSON.stringify(params);
        }
        const res = await fetch(url, payload);
        const status = res.status;
        const ok = res.ok;

        let body = null;
        const responseContent = await res.text();
        if(ok && responseContent){
            body = JSON.parse(responseContent);
        }

        const resp = { status, body, ok };
        this.handleCommonError(resp)
        return resp
    }
}
