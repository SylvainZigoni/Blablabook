import { httpRequester } from "./httpRequester.js";

export const api = {
	login,
};

async function login(loginData) {
	return await httpRequester.post(`/auth/login`, loginData);
}
