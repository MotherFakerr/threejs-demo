import qs from 'qs';
import { IAppStore } from './app_store';
import { setupDebuggerUtil } from '../debugger_util';

export const store = {} as KV;

export function initStore(): void {
    const { isDebug } = qs.parse(window.location.search.replace('?', ''));

    const { setIsDebug } = store.appStore as IAppStore;
    const debug = isDebug === 'true';
    setIsDebug(debug);
    if (debug) {
        setupDebuggerUtil();
    }
}

export function registerStore(name: string) {
    return (Clazz: Class): void => (store[name] = new Clazz());
}
