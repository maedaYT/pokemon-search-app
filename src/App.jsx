import { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import PokemonCard from './components/PokemonCard';
import FavoriteList from './components/FavoriteList';
import SearchHistory from './components/SearchHistory';
import './App.css';

// localStorageに保存するときの「鍵（キー）」の名前です。
const FAVORITES_STORAGE_KEY = 'pokemonApp.favorites';
const HISTORY_STORAGE_KEY = 'pokemonApp.history';
const HISTORY_MAX_LENGTH = 10;

function App() {
  // 検索結果（1匹分のポケモン情報）を覚えておく状態。まだ何も検索していないので初期値はnull。
  const [pokemon, setPokemon] = useState(null);
  // お気に入り登録されたポケモンの配列を覚えておく状態。
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ページを開いたとき（初回表示時）に1回だけ、localStorageからお気に入りを読み込みます。
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []); // 依存配列を空[]にすることで「最初の1回だけ実行」される

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // 検索ボタンが押されたときに実行される処理です（SearchFormから呼ばれます）。
  const handleSearch = async (keyword) => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      // ★検索欄が空のまま検索された場合のエラー表示（設計書F-005の必須条件）
      setPokemon(null);
      setError('ポケモン名を入力してください。');
      return;
    }

    // ★新しい検索を始めるタイミングで、前回の結果・エラーを両方リセットする
    setPokemon(null);
    setError(null);
    setIsLoading(true); // ★通信を始める直前に「読み込み中」にする

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${trimmed.toLowerCase()}`);

      if (!response.ok) {
        // ★ポケモンが見つからなかった場合（404など）
        setError('ポケモンが見つかりませんでした');
        return;
      }

      const data = await response.json();

      // APIから返る情報の中から、画面表示に必要な部分だけを取り出して整形します。
      const result = {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
        types: data.types.map((typeInfo) => typeInfo.type.name),
      };
      setPokemon(result);
      addToHistory(result); // 検索に成功したので、履歴にも追加する
    } catch (fetchError) {
      // ★通信自体に失敗した場合（オフライン等）
      console.error(fetchError);
      setError('検索中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false); // ★成功でも失敗でも、通信が終わったら必ず「読み込み中」を解除する
    }
  };

  // 検索履歴に追加する処理です。重複を除外し、新しいものを先頭にし、最大10件に切り詰めます。
  const addToHistory = (target) => {
    const withoutDuplicate = history.filter((item) => item.id !== target.id);
    const nextHistory = [target, ...withoutDuplicate].slice(0, HISTORY_MAX_LENGTH);

    setHistory(nextHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  };

  // 指定したポケモンがすでにお気に入りかどうかを判定する関数です。
  const isFavorite = (id) => favorites.some((favorite) => favorite.id === id);

  // お気に入りボタンが押されたときの処理です（PokemonCardから呼ばれます）。
  const handleToggleFavorite = (target) => {
    const nextFavorites = isFavorite(target.id)
      ? favorites.filter((favorite) => favorite.id !== target.id) // すでに登録済みなら除外＝解除
      : [...favorites, target]; // 未登録なら配列の最後に追加＝登録

    setFavorites(nextFavorites);
    // 画面の状態を更新するだけでなく、ブラウザにも保存しておくことで、
    // ページを閉じて再度開いてもお気に入りが消えないようにします。
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
  };

  return (
    <div className="app">
      <h1>Pokémon Search</h1>

      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <p className="loading-message">読み込み中...</p>}

      {!isLoading && error && <p className="error-message">{error}</p>}

      {pokemon && (
        <section>
          <h2>【検索結果】</h2>
          <PokemonCard
            pokemon={pokemon}
            isFavorite={isFavorite(pokemon.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        </section>
      )}

      <SearchHistory history={history} />

      <FavoriteList favorites={favorites} />
    </div>
  );
}

export default App;

//ポイント解説（重要な部分）：
//App.jsxが「状態の管理者」：pokemon（検索結果）とfavorites（お気に入り一覧）という、画面全体に関わる情報はすべてApp.jsxで一括管理しています。
// 子コンポーネント（SearchForm・PokemonCard・FavoriteList）は、propsで受け取った値を表示したり、propsで渡された関数を呼んだりするだけです。
// この「親が状態を持ち、子は表示と通知に専念する」という形が、Reactの基本的な設計パターンです。

//useEffect(() => {...}, [])：「画面が最初に表示されたタイミングで1回だけ実行したい処理」を書く場所です。
// 今回は「localStorageに保存されたお気に入りを読み込む」処理をここに書いています。第2引数の []（依存配列）が空だと「初回のみ実行」という意味になります。

//fetchとasync/await：fetch(URL) は指定したURLにリクエストを送る処理です。通信には時間がかかるため、
// await を使って「レスポンスが返ってくるまで待つ」ようにしています。async function の中でのみ await は使えるため、
// handleSearch 関数には async を付けています。

//localStorage.setItem / getItem：ブラウザ内にデータを保存できる仕組みです。オブジェクトや配列はそのままでは保存できないため、
// JSON.stringify() で文字列に変換してから保存し、読み込むときは JSON.parse() で元の形（配列）に戻しています。
