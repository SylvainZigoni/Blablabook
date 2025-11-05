import { writable, derived } from "svelte/store";
import { jwtDecode } from "jwt-decode";

// Initial state from localStorage
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

export const auth = writable({
	token: storedToken,
	user: storedUser ? JSON.parse(storedUser) : null,
});

// Helper to manage store
export function setToken(token) {
	console.log("[auth.store] setToken:", token);
	auth.update((state) => {
		if (token) {
			localStorage.setItem("token", token);
		} else {
			localStorage.removeItem("token");
		}
		return { ...state, token };
	});
}

export function setUser(user) {
	console.log("[auth.store] setUser:", user);
	auth.update((state) => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
		return { ...state, user };
	});
}

export function logout() {
	setToken(null);
	setUser(null);
}

// Derived store : isAuthed
export const isAuthed = derived(auth, ($auth) => {
	if (!$auth.token) return false;

	const { exp } = jwtDecode($auth.token);
	if (exp * 1000 < Date.now()) {
		logout();
		return;
	}

	return true;
});

// Derived store : isAdmin
export const isAdmin = derived(auth, ($auth) => {
	return $auth.user?.isAdmin === true;
});
