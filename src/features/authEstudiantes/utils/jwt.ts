export function decodeJwtPayload<T = any>(token: string): T | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;
		const payload = parts[1];
		// Reemplazos para Base64 URL-safe
		const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
		const decoded = atob(base64);
		return JSON.parse(decoded) as T;
	} catch {
		return null;
	}
}