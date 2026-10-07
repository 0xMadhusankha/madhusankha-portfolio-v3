'use client';

import { useEffect, useState } from 'react';

const SECRET_CODE = 'aHR0cHM6Ly93YS5tZS85NDcyNjMwMjM2MA'; // Base64 encoded secret
const TRIGGER_WORD = 'ghost';
const REQUIRED_TAPS = 3;
const TAP_TIMEOUT = 3000;

const EasterEggs = () => {
    const [toast, setToast] = useState<{ message: string; copyable: boolean } | null>(null);

    useEffect(() => {
        console.log('%cSTOP!', 'color: #ff0000; font-size: 60px; font-weight: bold; text-shadow: 3px 3px 0 #000;');
        console.log(
            '%cThis is a browser feature intended for developers.',
            'color: #ffffff; font-size: 18px; font-weight: bold;',
        );
        console.log(
            '%cIf someone told you to copy-paste something here, it is a scam.',
            'color: #ffff00; font-size: 16px;',
        );
        console.log(
            '%c[ANIMUS]: Synchronization sequence initialized...',
            'color:#888;font-family:Consolas,monospace;font-size:11px;',
        );
        console.log(
            '%c[BROTHERHOOD]: Hidden Bureau relay awaiting an initiate...',
            'color:#888;font-family:Consolas,monospace;font-size:11px;',
        );

        let buffer = '';
        let taps = 0;
        let tapTimer: ReturnType<typeof setTimeout>;
        let toastTimer: ReturnType<typeof setTimeout>;

        const show = (message: string, copyable: boolean, ms: number) => {
            clearTimeout(toastTimer);
            setToast({ message, copyable });
            toastTimer = setTimeout(() => setToast(null), ms);
        };

        // Desktop: type the trigger word anywhere on the page
        const onKeyPress = (e: KeyboardEvent) => {
            buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER_WORD.length);
            if (buffer !== TRIGGER_WORD) return;
            buffer = '';
            console.clear();
            console.log(
                '%c' +
                    '┌──────────────────────────────────────────────────────────────┐\n' +
                    '│                    ANIMUS TERMINAL v3.0                      │\n' +
                    '├──────────────────────────────────────────────────────────────┤\n' +
                    '│  MEMORY SYNC     : 100%                                      │\n' +
                    '│  INITIATE        : VERIFIED                                  │\n' +
                    '│  HIDDEN BUREAU   : DISCOVERED                                │\n' +
                    '├──────────────────────────────────────────────────────────────┤\n' +
                    '│  Access Granted.                                             │\n' +
                    '│  The Brotherhood has acknowledged your investigation.        │\n' +
                    '│  Decode the encrypted transmission to continue.              │\n' +
                    '├──────────────────────────────────────────────────────────────┤\n' +
                    '│  ENCODED TRANSMISSION (Base64)                               │\n' +
                    '└──────────────────────────────────────────────────────────────┘',
                'color:#00FF88;font-family:Consolas,monospace;font-size:13px;font-weight:bold;',
            );
            console.log(
                '%c' + SECRET_CODE,
                'color: #FFFF00; font-weight: bold; background: #1a1a1a; padding: 8px; font-family: monospace; font-size: 11px; border: 1px solid #FFFF00;',
            );
            show('⚠️ SYSTEM BREACH. Check Console (F12) for Payload.', false, 5000);
        };

        // Mobile: tap the portrait three times quickly
        const onClick = (e: MouseEvent) => {
            if (window.innerWidth >= 768 || !(e.target as Element).closest('[data-ghost-tap]')) return;
            clearTimeout(tapTimer);
            taps += 1;
            if (taps >= REQUIRED_TAPS) {
                taps = 0;
                show(`⚠️ ACCESS GRANTED. Secret: ${SECRET_CODE} (Tap to Copy)`, true, 15000);
            } else {
                tapTimer = setTimeout(() => (taps = 0), TAP_TIMEOUT);
            }
        };

        window.addEventListener('keypress', onKeyPress);
        document.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('keypress', onKeyPress);
            document.removeEventListener('click', onClick);
            clearTimeout(tapTimer);
            clearTimeout(toastTimer);
        };
    }, []);

    if (!toast) return null;

    const copy = () => {
        if (!toast.copyable) return;
        navigator.clipboard
            .writeText(SECRET_CODE)
            .then(() => setToast({ message: '✅ PAYLOAD COPIED', copyable: false }))
            .catch(() => setToast({ message: `❌ Copy failed - Code: ${SECRET_CODE}`, copyable: false }));
    };

    return (
        <div className="toast" role="status" onClick={copy}>
            {toast.message}
        </div>
    );
};

export default EasterEggs;
