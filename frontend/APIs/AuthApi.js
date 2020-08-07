import * as e from '../EndPoints';

export const login = async (body) => {
    return fetch(e.LOGIN, {
        method: 'POST',
        headers: e.HeadersWithoutToken(),
        body: JSON.stringify(body)
    }).then(res => res.json())
        .then(data => data);
}

export const register = async (body) =>
    fetch(e.REGISTER, {
        method: 'POST',
        headers: e.HeadersWithoutToken(),
        body: JSON.stringify(body)
    }).then(res => res.json())
        .then(data => data);

export const AuthUser = async () => {
    const HEADERS = await e.HeadersWithToken();

    return fetch(e.AUTH_USER, { method: 'GET', headers: HEADERS })
        .then(res => res.json())
        .then(data => data);
}