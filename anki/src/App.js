import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signInAnonymously } from './firebase';

// 各コンポーネントをインポート
import BottomNav from './components/BottomNav';
import DeckGallery from './components/DeckGallery';
import CardList from './components/CardList';
import TrainingMode from './components/TrainingMode';
import CardEditor from './components/CardEditor';

// カードフリップアニメーション用のCSS
import './styles/custom.css';

export default function App() {
    const [view, setView] = useState('decks'); // 'decks', 'training', 'addCard', 'cardList'
    const [currentDeck, setCurrentDeck] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
            } else {
                try {
                    const userCredential = await signInAnonymously(auth);
                    setUser(userCredential.user);
                } catch (error) {
                    console.error("Anonymous sign-in failed:", error);
                }
            }
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    const navigateTo = (newView, deck = null) => {
        if (deck) {
            setCurrentDeck(deck);
        }
        setView(newView);
    };
    
    // viewがdecksに戻った時にcurrentDeckをリセット
    useEffect(() => {
        if (view === 'decks') {
            setCurrentDeck(null);
        }
    }, [view]);

    const renderView = () => {
        switch (view) {
            case 'decks':
                return <DeckGallery navigateTo={navigateTo} user={user} />;
            case 'cardList':
                return <CardList navigateTo={navigateTo} deck={currentDeck} user={user} />;
            case 'training':
                return <TrainingMode navigateTo={navigateTo} deck={currentDeck} user={user} />;
            case 'addCard':
                return <CardEditor navigateTo={navigateTo} deck={currentDeck} user={user} />;
            default:
                return <DeckGallery navigateTo={navigateTo} user={user} />;
        }
    };

    if (!isAuthReady) {
        return <div className="flex items-center justify-center h-screen bg-gray-100"><p>読み込み中...</p></div>;
    }

    return (
        <div className="h-screen w-screen bg-gray-100 font-sans flex flex-col">
            <main className="flex-grow overflow-y-auto pb-20">
                {renderView()}
            </main>
            <BottomNav view={view} setView={setView} currentDeck={currentDeck} />
        </div>
    );
}
