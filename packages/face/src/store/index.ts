import qs from 'qs';
import { IDebuggerStore } from './debugger_store';

export const store = {} as KV;

export function initStore(): void {
    const { isDebug } = qs.parse(window.location.search.replace('?', ''));

    const { setIsDebug } = store.debuggerStore as IDebuggerStore;
    setIsDebug(isDebug === 'true');
}

export function registerStore(name: string) {
    return (Clazz: Class): void => (store[name] = new Clazz());
}
