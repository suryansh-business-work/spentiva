/** Build-time settings (see portal/.env.example) */
const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) throw new Error('VITE_API_URL is not set — copy portal/.env.example to portal/.env');

export const API_URL = apiUrl;
export const APP_VERSION = __APP_VERSION__;
export const TOKEN_KEY = 'spentiva.portal.token';
export const PAGE_SIZES = [10, 25, 50, 100];
