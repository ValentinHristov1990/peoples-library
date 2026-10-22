import { useEffect } from 'react';

export default function usePreventGlobalDrop() {
    useEffect(() => {
        const preventGlobalDrop = (e) => {
            e.preventDefault();
        };

        window.addEventListener('dragover', preventGlobalDrop);
        window.addEventListener('drop', preventGlobalDrop);

        return () => {
            window.removeEventListener('dragover', preventGlobalDrop);
            window.removeEventListener('drop', preventGlobalDrop);
        };
    }, []);
}