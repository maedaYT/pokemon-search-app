// PokeAPIが返す英語のタイプ名を、日本語表示に変換するための対応表です。
// オブジェクト（連想配列）に「英語: 日本語」のペアを並べているだけの、シンプルな仕組みです。
export const pokemonTypeNames = {
  normal: 'ノーマル',
  fire: 'ほのお',
  water: 'みず',
  electric: 'でんき',
  grass: 'くさ',
  ice: 'こおり',
  fighting: 'かくとう',
  poison: 'どく',
  ground: 'じめん',
  flying: 'ひこう',
  psychic: 'エスパー',
  bug: 'むし',
  rock: 'いわ',
  ghost: 'ゴースト',
  dragon: 'ドラゴン',
  dark: 'あく',
  steel: 'はがね',
  fairy: 'フェアリー',
};
// なぜ必要か：PokeAPIは electric のような英語しか返してくれません。この対応表を使って
//  pokemonTypeNames['electric'] とすれば 'でんき' が取れます。データ変換のロジックを1ファイルにまとめておくと、
// PokemonCard.jsx のコードがすっきりします。
