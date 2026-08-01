export const isTauri = (): boolean => typeof (window) !== 'undefined' && (window.hasOwnProperty('__TAURI_INTERNALS__') || window.hasOwnProperty('__TAURI__'));
export default isTauri;
