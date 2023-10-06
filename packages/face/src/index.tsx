import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import { Provider as MobxProvider } from 'mobx-react';
import { App } from './view/app';
import { initStore, store } from './store';
import './store/import';

function start(): void {
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    initStore();
    root.render(
        <MobxProvider {...store}>
            <App />
        </MobxProvider>,
    );
}
start();
