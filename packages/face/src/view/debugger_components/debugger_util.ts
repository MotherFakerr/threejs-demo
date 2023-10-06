import { store } from '../../store';
import { IAppStore } from '../../store/app_store';

export function setupDebuggerUtil(): void {
    Reflect.defineProperty(window, 'mainView', {
        get: () => {
            return (store.appStore as IAppStore).getMainView();
        },
    });

    Reflect.defineProperty(window, 'allGeoElements', {
        get: () => {
            return (store.appStore as IAppStore).getMainView().getRenderer().getAllElements();
        },
    });
}
