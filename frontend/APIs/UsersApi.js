import * as e from '../EndPoints';

export const RegisteredUsers = async () => {
    const HEADERS = await e.HeadersWithToken();

    return fetch(e.USERS, { method: 'GET', headers: HEADERS })
        .then(res => res.json())
        .then(data => data);
}