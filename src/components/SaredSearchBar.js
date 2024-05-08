import { useMemo } from 'react';
import Fuse from 'fuse.js';

function useSharedSearchBar(items, options, term) {
    const fuse = useMemo(() => new Fuse(items, options), [items, options]);

    const results = useMemo(() => {
        return term ? fuse.search(term).map(result => result.item) : items;
    }, [fuse, term]);

    return [results];
}

export default useSharedSearchBar;
