import { useState, useEffect, useRef } from 'react';
import styles from './SearchInput.module.css';
import type { Character } from '../../types/Character';
import { fetchSuggestions } from '../../api/characters';  // import from new file

interface Props {
  onSelect: (character: Character) => void;
}

const SearchInput: React.FC<Props> = ({ onSelect }) => {
  // State to keep track of the current input query string
  const [query, setQuery] = useState('');

  // State to hold the array of suggested Character objects returned from fetch
  const [suggestions, setSuggestions] = useState<Character[]>([]);

  // State to track whether the input is currently focused (used for UI behavior)
  const [isFocused, setIsFocused] = useState(false);

  // State to track the index of the currently highlighted suggestion (-1 means none)
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Ref to the <ul> element that contains the suggestion list (for possible DOM access)
  const listRef = useRef<HTMLUListElement>(null);

  // Effect runs whenever `query` changes to fetch new suggestions asynchronously
  useEffect(() => {
    // Define async function to fetch suggestions based on current query
    const fetchData = async () => {
      const results = await fetchSuggestions(query);  // fetch suggestions from API or function
      setSuggestions(results);                         // update suggestions state with results
      setActiveIndex(-1);                              // reset active highlight index
    };

    // Debounce fetching: wait 300ms after last keystroke before fetching suggestions
    const timeout = setTimeout(fetchData, 300);

    // Cleanup: clear the timeout if query changes again before 300ms (prevents race conditions)
    return () => clearTimeout(timeout);
  }, [query]);

  // Handler for key presses on the input field to navigate suggestions or select one
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      // Move highlight down through suggestions; wrap around to start if at end
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      // Move highlight up through suggestions; wrap around to end if at start
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      // When Enter is pressed and a suggestion is highlighted, select it
      handleSelect(suggestions[activeIndex]);
    }
  };

  // Function to handle selecting a suggestion (called on Enter or click)
  const handleSelect = (character: Character) => {
    onSelect(character);           // Pass selected character to parent or handler
    setQuery(character.name);      // Update input query with selected character's name
    setSuggestions([]);            // Clear suggestions list after selection
  };


  return (
    <div className={styles.wrapper}>
      <label htmlFor="character-search" className={styles.label}>
        Search Star Wars Characters
      </label>
      <input
        id="character-search"
        type="text"
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls="suggestion-list"
        aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        className={styles.input}
        placeholder="Type 2 or more characters..."
      />

      {isFocused && (
        <>
          {suggestions.length > 0 ? (
            <ul
              id="suggestion-list"
              role="listbox"
              className={styles.suggestions}
              ref={listRef}
            >
              {suggestions.map((s, index) => {
                const name = s.name;
                const matchIndex = name.toLowerCase().indexOf(query.toLowerCase());
                const before = name.slice(0, matchIndex);
                const match = name.slice(matchIndex, matchIndex + query.length);
                const after = name.slice(matchIndex + query.length);

                return (
                  <li
                    key={s.name}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={activeIndex === index}
                    className={`${styles.item} ${activeIndex === index ? styles.active : ''}`}
                    onMouseDown={() => handleSelect(s)}
                  >
                    {matchIndex >= 0 ? (
                      <>
                        {before}
                        <strong>{match}</strong>
                        {after}
                      </>
                    ) : (
                      name
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            query.length >= 2 && (
              <div className={styles.noResults}>No suggestions found</div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SearchInput;
