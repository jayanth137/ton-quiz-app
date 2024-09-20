import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import RootLayout from './layout/RootLayout';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import { TonConnectUI, TonConnectUIProvider } from '@tonconnect/ui-react';
import TonConnect from '@tonconnect/sdk';

import { Question, NotFound, SingleQuestion, Success } from './pages';

import process from 'process';
window.process = process;

const manifestUrl = 'https://api.jsonsilo.com/public/f7e096e2-bbf6-46c7-a599-2a885fe59b2d';

const connector = new TonConnect({
    manifestUrl: manifestUrl,
});
connector.restoreConnection();

const unsubscribe = connector.onStatusChange((walletInfo) => {
    // update state/reactive variables to show updates in the ui
});

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<NotFound />}>
            <Route index element={<App />} />
            <Route path="question" element={<Question />} />
            <Route path="question/:id" element={<SingleQuestion />} />
            <Route path="finish" element={<Success />} />
            {/* <Route path="my-nft" element={<UserNFTs />} /> */}
        </Route>,
    ),
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <TonConnectUIProvider manifestUrl={manifestUrl}>
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </TonConnectUIProvider>,
);
