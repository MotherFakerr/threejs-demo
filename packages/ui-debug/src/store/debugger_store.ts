import { ISysView } from '@threejs-demo/core';
import { action, makeObservable, observable } from 'mobx';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min';
import { AmbientLightElement, PointLightElement } from '@threejs-demo/elements';
import { Vector3 } from '@threejs-demo/math';
import { registerStore } from '.';

export interface IDebuggerStore {
    gui: GUI;
    view: ISysView;
    init(dom: HTMLElement, view: ISysView): void;
    reset(): void;
}

@registerStore('debuggerStore')
export class DebuggerStore implements IDebuggerStore {
    gui = new GUI();

    view: ISysView;

    constructor() {
        makeObservable(this, {
            gui: observable,
            init: action.bound,
            reset: action.bound,
        });
    }

    init(dom: HTMLElement, view: ISysView): void {
        this.gui.domElement = dom;
        this.view = view;
        this.reset();
        this._playgroundDebug();
    }

    reset(): void {
        this._setAmbientDebug();
    }

    private _setAmbientDebug(): void {
        const ambientLight = this.view.getDocument().getOrCreateUniqueElement(AmbientLightElement);
        this.gui.add({ ...ambientLight.db }, 'intensity', 0, 2.0).onChange((v) => {
            ambientLight.updateElement({ intensity: v });
        });
    }

    private _playgroundDebug(): void {
        const pointLight = this.view.getDocument().createElement(PointLightElement, {
            position: new Vector3(10, 10, 10),
            color: 0xff0000,
            intensity: 1.0,
        });
    }
}
