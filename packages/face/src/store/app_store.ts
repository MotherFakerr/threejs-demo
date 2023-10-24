import { ISysApp, ISysView, ISysViewOptions, SysApp } from '@threejs-demo/core';
import { action, makeObservable, observable } from 'mobx';
import { registerStore, store } from '.';
import { AbstractStore } from './abstract_store';
import { AmbientLightElement } from '../../../elements/src';

export interface IAppStore {
    isDebug: boolean;
    mainViewId: string;
    noViewId: string;
    initApp(container: HTMLElement): void;
    getMainView(): ISysView;
    createView(id: string, container: HTMLElement): ISysView;
    delViewById(id: string): void;
    setIsDebug(v: boolean): void;
}

@registerStore('appStore')
export class AppStore extends AbstractStore implements IAppStore {
    isDebug = false;

    mainViewId = 'view3d';

    noViewId = 'noView3d';

    private _mainView: ISysView;

    private _mainApp: ISysApp;

    constructor() {
        super();
        makeObservable(this, {
            isDebug: observable,
            mainViewId: observable,
            noViewId: observable,
            initApp: action.bound,
            getMainView: action.bound,
            createView: action.bound,
            delViewById: action.bound,
            setIsDebug: action.bound,
        });
    }

    initApp(container: HTMLElement): void {
        this._mainApp = SysApp;
        this._mainApp.initApp();
        this._mainView = this.createView(this.mainViewId, container, {
            autoResize: true,
            isDebug: this.isDebug,
            isAnimate: true,
        });
        this._mainView.getDocument().getOrCreateUniqueElement(AmbientLightElement).create({ color: 0xffffff, intensity: 1 });
        this._mainView.updateView();
    }

    getMainView(): ISysView {
        if (!this._mainView) {
            throw new Error('main view is not created');
        }

        return this._mainView;
    }

    createView(id: string, container: HTMLElement, options?: ISysViewOptions): ISysView {
        return this._mainApp.createView(id, container, options);
    }

    delViewById(id: string): void {
        this._mainApp.delViewById(id);
    }

    setIsDebug(v: boolean): void {
        this.isDebug = v;
    }
}
