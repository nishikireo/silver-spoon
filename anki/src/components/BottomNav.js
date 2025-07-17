import React from 'react';
import { Home, BrainCircuit, PlusSquare } from 'lucide-react';

export default function BottomNav({ view, setView, currentDeck }) {
    const navItems = [
        { id: 'decks', icon: Home, label: 'デッキ' },
        { id: 'training', icon: BrainCircuit, label: '学習', disabled: !currentDeck },
        { id: 'addCard', icon: PlusSquare, label: '追加', disabled: !currentDeck },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md">
            <div className="flex justify-around max-w-lg mx-auto">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && setView(item.id)}
                        disabled={item.disabled}
                        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm 
                            ${view === item.id ? 'text-blue-500' : 'text-gray-500'}
                            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <item.icon size={24} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
