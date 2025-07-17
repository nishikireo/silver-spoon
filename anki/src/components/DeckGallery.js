import React, { useState, useEffect } from 'react';
import { db, appId } from '../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

export default function DeckGallery({ navigateTo, user }) {
    const [decks, setDecks] = useState([]);
    const [newDeckName, setNewDeckName] = useState('');

    useEffect(() => {
        if (!user) return;
        const decksCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'decks');
        const unsubscribe = onSnapshot(decksCollection, (snapshot) => {
            const decksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDecks(decksData);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAddDeck = async () => {
        if (newDeckName.trim() === '' || !user) return;
        const decksCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'decks');
        await addDoc(decksCollection, { name: newDeckName, createdAt: new Date() });
        setNewDeckName('');
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">マイデッキ</h1>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="新しいデッキ名"
                    className="flex-grow p-2 border rounded-l-md"
                />
                <button onClick={handleAddDeck} className="bg-blue-500 text-white p-2 rounded-r-md">作成</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {decks.map(deck => (
                    <div key={deck.id} onClick={() => navigateTo('cardList', deck)} className="bg-white p-4 rounded-lg shadow-md aspect-w-3 aspect-h-4 flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition-shadow">
                        <p className="text-center font-semibold">{deck.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
