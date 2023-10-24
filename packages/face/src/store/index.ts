import qs from 'qs';
import { IAppStore } from './app_store';

export const store = {} as KV;

export function initStore(): void {
    const { isDebug } = qs.parse(window.location.search.replace('?', ''));

    const { setIsDebug } = store.appStore as IAppStore;
    setIsDebug(isDebug === 'true');
}

export function registerStore(name: string) {
    return (Clazz: Class): void => (store[name] = new Clazz());
}
