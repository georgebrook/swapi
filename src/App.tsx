import { useState } from 'react';
import styles from './App.module.css';
import SearchInput from './components/SearchInput/SearchInput';
import ResultBox from './components/ResultBox/ResultBox';
import type { Character } from './types/Character';

const App = () => {
  const [selected, setSelected] = useState<Character | null>(null);

  return (
    <main className={styles.container}>
      <h1>Star Wars Character Search</h1>
      <SearchInput onSelect={setSelected} />
      <ResultBox character={selected} />
    </main>
  );
};

export default App;
