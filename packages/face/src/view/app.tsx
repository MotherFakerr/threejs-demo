import React from 'react';
import { inject, observer } from 'mobx-react';
import './app.less';
import { ThreeRenderer } from '@threejs-demo/core';

@inject()
@observer
export class App extends React.Component<ANY, ANY> {
    constructor(props: ANY) {
        super(props);
        this.state = {};
    }

    public componentDidMount(): void {
        const renderer = new ThreeRenderer(document.getElementById('view3d')!);
        renderer.updateView();
    }

    public render(): React.ReactElement {
        return (
            <div className='App'>
                <div id='view3d' />
            </div>
        );
    }
}
