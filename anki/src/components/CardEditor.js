import React, { useState } from 'react';
import { db, appId } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

export default function CardEditor({ navigateTo, deck, user }) {
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');

    const handleSaveCard = async () => {
        if (frontText.trim() === '' || backText.trim() === '' || !user || !deck) return;
        const cardsCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'decks', deck.id, 'cards');
        await addDoc(cardsCollection, {
            frontText,
            backText,
            createdAt: new Date(),
            easeFactor: 2.5,
            interval: 0,
            nextReview: new Date(),
        });
        setFrontText('');
        setBackText('');
        navigateTo('cardList', deck);
    };

    if (!deck) {
         return (
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <button onClick={() => navigateTo('decks')} className="mr-4"><ArrowLeft /></button>
                    <h1 className="text-2xl font-bold">カード追加</h1>
                </div>
                <p>まず、カードを追加するデッキを選択してください。</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <button onClick={() => navigateTo('cardList', deck)} className="mr-4"><ArrowLeft /></button>
                <h1 className="text-2xl font-bold">カード追加: {deck.name}</h1>
            </div>
            <div className="space-y-4">
                <textarea
                    value={frontText}
                    onChange={(e) => setFrontText(e.target.value)}
                    placeholder="表面のテキスト"
                    className="w-full p-2 border rounded-md h-32"
                />
                <textarea
                    value={backText}
                    onChange={(e) => setBackText(e.target.value)}
                    placeholder="裏面のテキスト"
                    className="w-full p-2 border rounded-md h-32"
                />
                <button onClick={handleSaveCard} className="w-full bg-blue-500 text-white p-3 rounded-md font-bold">
                    カードを保存
                </button>
            </div>
        </div>
    );
}
