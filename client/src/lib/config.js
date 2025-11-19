// URL pour les requêtes serveur (SSR) - réseau Docker
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// URL pour les requêtes client (navigateur) - accessible depuis l'extérieur
export const API_PUBLIC_URL = import.meta.env.VITE_API_PUBLIC_URL;

// Fonction helper pour obtenir la bonne URL selon le contexte
export function getApiUrl(url) {
    // En mode SSR (serveur), utiliser l'URL Docker interne
    // En mode client (navigateur), utiliser l'URL publique
    if (typeof window === 'undefined') {
        // Côté serveur
        return `${API_BASE_URL}${url}`;
    } else {
        // Côté client
        return `${API_PUBLIC_URL}${url}`;
    }
}
