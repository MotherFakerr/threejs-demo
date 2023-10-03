import React from 'react';
import { inject, observer } from 'mobx-react';
import './app.less';
import { Layout } from 'antd';
import { IAppStore } from '../store/app_store';

const { Header, Content } = Layout;

interface IProps {
    appStore: IAppStore;
}

@inject('appStore')
@observer
export class App extends React.Component<Partial<IProps>> {
    private _appContainer: HTMLElement;

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount(): void {
        if (this._appContainer) {
            const { initApp } = this.props.appStore!;
            initApp(this._appContainer);
        }
    }

    public render(): React.ReactElement {
        const { mainViewId, noViewId } = this.props.appStore!;

        return (
            <div className='App'>
                <Layout className='full-height'>
                    <Header tabIndex={-1}>HEADER</Header>
                    <Content>
                        <div
                            id={mainViewId}
                            ref={(e) => {
                                if (e) {
                                    this._appContainer = e;
                                }
                            }}
                        />
                        <div id={noViewId}>{}</div>
                    </Content>
                </Layout>
            </div>
        );
    }
}
