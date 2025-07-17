import React, { useState, useEffect } from 'react';
import { db, appId } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

export default function CardList({ navigateTo, deck, user }) {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        if (!user || !deck) return;
        const cardsCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'decks', deck.id, 'cards');
        const unsubscribe = onSnapshot(cardsCollection, (snapshot) => {
            const cardsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCards(cardsData);
        });
        return () => unsubscribe();
    }, [user, deck]);

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <button onClick={() => navigateTo('decks')} className="mr-4"><ArrowLeft /></button>
                <h1 className="text-2xl font-bold">{deck.name}</h1>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
                <button onClick={() => navigateTo('training', deck)} className="bg-green-500 text-white px-4 py-2 rounded-md">このデッキで学習</button>
                <button onClick={() => navigateTo('addCard', deck)} className="bg-blue-500 text-white px-4 py-2 rounded-md">カードを追加</button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {cards.map(card => (
                    <div key={card.id} className="bg-white p-2 rounded-md shadow aspect-w-3 aspect-h-4 flex items-center justify-center text-xs text-center">
                        {card.frontText}
                    </div>
                ))}
                {cards.length === 0 && <p className="col-span-full text-center text-gray-500">カードがありません。</p>}
            </div>
        </div>
    );
}
