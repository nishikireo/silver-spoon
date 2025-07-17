import React, { useState, useEffect } from 'react';
import { db, appId } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Check, X, ArrowLeft } from 'lucide-react';

export default function TrainingMode({ navigateTo, deck, user }) {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (!user || !deck) return;
        const fetchCards = async () => {
            const cardsCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'decks', deck.id, 'cards');
            const cardSnapshot = await getDocs(cardsCollection);
            const cardsData = cardSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCards(cardsData.sort(() => Math.random() - 0.5));
        };
        fetchCards();
    }, [user, deck]);

    const handleSwipe = (direction) => {
        console.log(`Swiped ${direction} on card ${cards[currentIndex].id}`);
        setIsFlipped(false);
        setCurrentIndex(prev => (prev + 1) % cards.length);
    };

    if (!deck) {
        return (
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <button onClick={() => navigateTo('decks')} className="mr-4"><ArrowLeft /></button>
                    <h1 className="text-2xl font-bold">学習モード</h1>
                </div>
                <p>学習するデッキを選択してください。</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <button onClick={() => navigateTo('cardList', deck)} className="mr-4"><ArrowLeft /></button>
                    <h1 className="text-2xl font-bold">{deck.name} - 学習</h1>
                </div>
                <p>学習するカードがありません。まずカードを追加してください。</p>
            </div>
        );
    }
    
    const currentCard = cards[currentIndex];

    return (
        <div className="p-4 h-full flex flex-col">
             <div className="flex items-center mb-4">
                <button onClick={() => navigateTo('cardList', deck)} className="mr-4"><ArrowLeft /></button>
                <h1 className="text-xl font-bold truncate">{deck.name}</h1>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
                <div 
                    className="w-full max-w-sm h-64 bg-white rounded-lg shadow-xl flex items-center justify-center p-4 text-center text-2xl cursor-pointer transition-transform duration-500"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center">
                        {currentCard.frontText}
                    </div>
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center" style={{ transform: 'rotateY(180deg)' }}>
                        {currentCard.backText}
                    </div>
                </div>
            </div>
            <div className="flex justify-around items-center p-4">
                <button onClick={() => handleSwipe('left')} className="bg-red-500 text-white rounded-full p-4 shadow-lg">
                    <X size={32} />
                </button>
                <button onClick={() => handleSwipe('right')} className="bg-green-500 text-white rounded-full p-4 shadow-lg">
                    <Check size={32} />
                </button>
            </div>
        </div>
    );
}
