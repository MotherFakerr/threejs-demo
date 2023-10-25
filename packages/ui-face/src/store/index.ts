import qs from 'qs';
import { IAppStore } from './app_store';
import { setupDebuggerUtil } from '../debugger_util';

export const store = {} as KV;

export function initStore(): void {
    const { debug } = qs.parse(window.location.search.replace('?', ''));

    const { setIsDebug } = store.appStore as IAppStore;
    const isDebug = debug === 'true';
    setIsDebug(isDebug);
    if (isDebug) {
        setupDebuggerUtil();
    }
}

export function registerStore(name: string) {
    return (Clazz: Class): void => (store[name] = new Clazz());
}
