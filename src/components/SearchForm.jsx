import { useState } from 'react';

// 検索欄と検索ボタンをまとめた部品（コンポーネント）です。
// 親（App.jsx）から「検索が実行されたときに呼んでほしい関数」を props として受け取ります。
function SearchForm({ onSearch, isLoading }) {
  // keyword：入力欄に今何が入力されているかを覚えておくための状態(state)です。
  const [keyword, setKeyword] = useState('');

  // フォームが送信された（検索ボタンが押された）ときに呼ばれる関数です。
  const handleSubmit = (event) => {
    event.preventDefault(); // フォーム送信時のページ再読み込みを止める
    onSearch(keyword); // 親から渡された関数に、入力中のキーワードを渡す
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="pokemon-name">ポケモン名</label>
      <input
        id="pokemon-name"
        type="text"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="例：pikachu"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? '検索中...' : '検索'}
      </button>
    </form>
  );
}

export default SearchForm;

//ポイント解説（初心者向け）：
//useState('') … 「入力欄の中身」を覚えておくための箱です。Reactでは、画面に表示される値が変わるものは基本的に useState で管理します。
//value={keyword} と onChange={...} … 入力欄の表示内容(value)を keyword に固定し、ユーザーが1文字打つたびに setKeyword で更新しています。
// これを「制御されたコンポーネント」と呼びます。
//onSearch は「このコンポーネント自身は検索処理のやり方を知らず、親から渡された処理を呼び出すだけ」という設計です。
// これにより SearchForm は「検索欄の見た目と入力」だけに専念でき、コンポーネントの役割が分かりやすくなります。
