import { action, makeObservable, observable } from 'mobx';
import { registerStore } from '.';
import { AbstractStore } from './abstract_store';

export enum EN_DEBUG_MODE {
    PRESPECTIVE_CAMERA,
}

export interface IDebuggerStore {
    isDebug: boolean;
    debugMode: EN_DEBUG_MODE;
    setIsDebug(v: boolean): void;
    setDebugMode(v: EN_DEBUG_MODE): void;
}

@registerStore('debuggerStore')
export class DebuggerStore extends AbstractStore implements IDebuggerStore {
    isDebug = true;

    debugMode = EN_DEBUG_MODE.PRESPECTIVE_CAMERA;

    constructor() {
        super();
        makeObservable(this, {
            isDebug: observable,
            debugMode: observable,
            setIsDebug: action.bound,
            setDebugMode: action.bound,
        });
    }

    setIsDebug(v: boolean): void {
        this.isDebug = v;
    }

    setDebugMode(v: EN_DEBUG_MODE): void {
        this.debugMode = v;
    }
}
