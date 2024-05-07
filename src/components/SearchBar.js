import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';

function useSearchBar(items, options) {
    const [term, setTerm] = useState('');
    const fuse = useMemo(() => new Fuse(items, options), [items, options]);

    const results = useMemo(() => {
        return term ? fuse.search(term).map(result => result.item) : items;
    }, [fuse, term]);

    return [results, setTerm, term];
}

export default useSearchBar;
