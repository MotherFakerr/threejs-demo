import React from 'react';
import './view.less';
import { Layout } from 'antd';
import { ISysView, SysApp } from '@threejs-demo/core';
import { PrespectiveCameraView } from './view/prespective_camera';

const { Header, Content } = Layout;

enum EN_TEST_VIEW_TYPE {
    PRESPECTIVE_CAMERA,
}

interface IState {
    viewType: EN_TEST_VIEW_TYPE;
    view?: ISysView;
}

export class View extends React.Component<Partial<ANY>, IState> {
    private _appContainer: HTMLElement;

    constructor(props: ANY) {
        super(props);
        this.state = {
            viewType: EN_TEST_VIEW_TYPE.PRESPECTIVE_CAMERA,
        };
    }

    public componentDidMount(): void {
        if (this._appContainer) {
            const app = SysApp;
            app.initApp();
            const view = app.createView('test_view', this._appContainer);
            this.setState({ view });
            view.updateView();
        }
    }

    public render(): React.ReactElement {
        const { view, viewType } = this.state;
        return (
            <div className='View'>
                <Layout className='full-height'>
                    <Header tabIndex={-1}>HEADER</Header>
                    <Content className='test-content'>
                        <div
                            id='test-view3d'
                            ref={(e) => {
                                if (e) {
                                    this._appContainer = e;
                                }
                            }}
                        />
                        {view && (
                            <>
                                <div className='test-options'>
                                    {viewType === EN_TEST_VIEW_TYPE.PRESPECTIVE_CAMERA && <PrespectiveCameraView view={view} />}
                                </div>
                            </>
                        )}
                    </Content>
                </Layout>
            </div>
        );
    }
}
