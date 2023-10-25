import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import { Provider as MobxProvider } from 'mobx-react';
import { store as debuggerStore } from '@threejs-demo/ui-debug';
import { App } from './view/app';
import { initStore, store } from './store';
import './store/import';
import '@threejs-demo/assets';

const allStores = { ...store, ...debuggerStore };
function start(): void {
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    initStore();
    root.render(
        <MobxProvider {...allStores}>
            <App />
        </MobxProvider>,
    );
}
start();
