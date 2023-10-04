import { store } from '../../store';

export function setupDebuggerUtil(): void {
    Reflect.defineProperty(window, 'mainView', {
        get: () => {
            return store.appStore.getMainView();
        },
    });
}
