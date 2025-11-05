export const httpRequester = {
	get: (endpoint) => request("GET", endpoint),
	post: (endpoint, body) => request("POST", endpoint, body),
	patch: (endpoint, body) => request("PATCH", endpoint, body),
	delete: (endpoint) => request("DELETE", endpoint),
};

async function request(method, endpoint, body) {
	// const accessToken = localStorage.getItem("token");
	const headers = {};
	let requestBody;

	if (body) {
		headers["Content-Type"] = "application/json";
		requestBody = JSON.stringify(body);
	} else {
		requestBody = undefined;
	}
	// if (accessToken) {
	// 	headers["Authorization"] = `Bearer ${accessToken}`;
	// }

	const response = await fetch(
		`${import.meta.env.VITE_API_PUBLIC_URL}${endpoint}`,
		{
			method,
			headers,
			body: requestBody,
		}
	);

	console.log(
		"[httpRequester] Fetch response status:",
		response.status,
		response.statusText
	);

	if (!response.ok) {
		console.error("[httpRequester] response pas ok:", response);
		throw new Error(
			`Erreur dans le fetch ${method} ${
				import.meta.env.VITE_API_PUBLIC_URL
			} ${endpoint} : ${response.statusText}`
		);
	}

	const contentType = response.headers.get("Content-Type");

	if (!contentType || !contentType.includes("application/json")) {
		console.log(
			"[httpRequester] response no-json, contentType:",
			contentType
		);
		return null;
	}

	const json = await response.json();
	console.log("[httpRequester] response json:", json);
	console.log(json.token);
	return json;
}
