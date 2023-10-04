import React from 'react';
import { inject, observer } from 'mobx-react';
import { ISysView } from '@threejs-demo/core';
import { EN_DEBUG_MODE, IDebuggerStore } from '../../store/debugger_store';
import { PrespectiveCameraView } from './prespective_camera';
import { IAppStore } from '../../store/app_store';
import './debugger.less';
import './debugger_util';

interface IProps {
    view: ISysView;
    debuggerStore: IDebuggerStore;
    appStore: IAppStore;
}

@inject('debuggerStore')
@observer
export class Debugger extends React.Component<Partial<IProps>> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactElement {
        const { isDebug, debugMode } = this.props.debuggerStore!;
        const { view } = this.props;

        if (isDebug) {
            import('./debugger_util').then((module) => {
                module.setupDebuggerUtil();
            });
        }
        return (
            <div className='debugger'>
                {view && isDebug && (
                    <>
                        <div className='test-options'>
                            {debugMode === EN_DEBUG_MODE.PRESPECTIVE_CAMERA && <PrespectiveCameraView view={view} />}
                        </div>
                    </>
                )}
            </div>
        );
    }
}
