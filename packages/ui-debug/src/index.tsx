import { observer, inject } from 'mobx-react';
import React from 'react';
import { ISysView } from '@threejs-demo/core';
import { IDebuggerStore } from './store/debugger_store';
import './store/import';

export * from './store';

interface IProps {
    view: ISysView;
    debuggerStore: IDebuggerStore;
}

@inject('debuggerStore')
@observer
export class Debugger extends React.Component<Partial<IProps>> {
    private _debuggerContainer: HTMLElement;

    public componentDidMount(): void {
        if (this._debuggerContainer) {
            const { init } = this.props.debuggerStore!;
            const view = this.props.view!;
            init(this._debuggerContainer, view);
        }
    }

    public render(): React.ReactElement {
        return (
            <div
                id='view-debugger'
                ref={(e) => {
                    if (e) {
                        this._debuggerContainer = e;
                    }
                }}
            />
        );
    }
}
