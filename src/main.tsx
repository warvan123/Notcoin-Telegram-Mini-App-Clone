import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// ئەڤە فایلی سەرەکی یێ پڕۆژەی یە
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* لێرە لینکی مانێفێستێکی فەرمی دادەنێین بۆ ئەوەی وەلێت بێ کێشە ببەسترێتەوە.
      ئەمە کێشەی "Invalid Manifest" چارەسەر دەکات کە لە وێنەکەدا دیار بوو.
    */}
    <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
)
