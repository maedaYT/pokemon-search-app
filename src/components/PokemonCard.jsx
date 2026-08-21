import { pokemonTypeNames } from '../utils/pokemonTypeNames';

// 検索結果1件分（画像・名前・タイプ・お気に入りボタン）を表示する部品です。
function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  return (
    <div className="pokemon-card">
      <img src={pokemon.image} alt={pokemon.name} />
      <p className="pokemon-name">{pokemon.name}</p>
      <p className="pokemon-types">
        タイプ：
        {pokemon.types.map((type) => pokemonTypeNames[type] || type).join('、')}
      </p>
      <button onClick={() => onToggleFavorite(pokemon)}>
        {isFavorite ? '♥ お気に入り解除' : '♡ お気に入り'}
      </button>
    </div>
  );
}

export default PokemonCard;

//ポイント解説：

//pokemon, isFavorite, onToggleFavorite はすべて親（App.jsx）から渡される props です。このコンポーネント自体は「今お気に入りかどうか」を
// 自分では判断せず、渡された isFavorite の値をそのまま表示に使うだけです（状態は極力1箇所＝App.jsxにまとめる、という考え方です）。

//pokemonTypeNames[type] || type … 対応表に無いタイプ名だった場合は、英語のまま表示するための保険です。
//ボタンを押すと onToggleFavorite(pokemon) を呼び、「このポケモンをお気に入りの登録/解除の対象にしてください」と親に伝えます。
// 実際の登録処理は App.jsx 側で行います。
