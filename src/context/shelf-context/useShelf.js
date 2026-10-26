import { useContext } from 'react';
import { ShelfContext } from './shelfContext';

export function useShelf() {
    return useContext(ShelfContext);
}
