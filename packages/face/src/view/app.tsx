import React from 'react';
import { inject, observer } from 'mobx-react';
import './app.less';
import { Layout } from 'antd';
import { ISysView } from '@threejs-demo/core';
import { Debugger } from '@threejs-demo/debug';
import { IAppStore } from '../store/app_store';

const { Header, Content } = Layout;

interface IProps {
    appStore: IAppStore;
}

interface IState {
    mainView?: ISysView;
}

@inject('appStore')
@observer
export class App extends React.Component<Partial<IProps>, IState> {
    private _appContainer: HTMLElement;

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount(): void {
        if (this._appContainer) {
            const { initApp, getMainView } = this.props.appStore!;
            initApp(this._appContainer);
            this.setState({ mainView: getMainView() });
        }
    }

    public render(): React.ReactElement {
        const { mainViewId, noViewId } = this.props.appStore!;
        const { mainView } = this.state;
        return (
            <div className='App'>
                <Layout className='full-height'>
                    <Header tabIndex={-1}>HEADER</Header>
                    <Content className='App-content'>
                        <div
                            id={mainViewId}
                            ref={(e) => {
                                if (e) {
                                    this._appContainer = e;
                                }
                            }}
                        />
                        <div id={noViewId}>{}</div>
                        {mainView && <Debugger view={mainView} />}
                    </Content>
                </Layout>
            </div>
        );
    }
}
