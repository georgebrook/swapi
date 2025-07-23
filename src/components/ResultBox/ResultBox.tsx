import styles from './ResultBox.module.css';
import type { Character } from '../../types/Character';

interface Props {
  character: Character | null;
}

const ResultBox: React.FC<Props> = ({ character }) => {
  if (!character) return null;

  const rows = [
    ['Name', character.name],
    ['Height', character.height],
    ['Mass', character.mass],
    ['Hair color', character.hair_color],
    ['Skin color', character.skin_color],
    ['Eye color', character.eye_color],
    ['Birth year', character.birth_year],
    ['Gender', character.gender],
  ].filter(([_, value]) => !!value);

  return (
    <div className={styles.result}>
      <table className={styles.resultTable}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultBox;
