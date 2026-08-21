// 検索履歴の一覧を表示するだけの部品です。FavoriteListと同じ考え方です。
function SearchHistory({ history }) {
  return (
    <div className="search-history">
      <h2>【検索履歴】</h2>
      {history.length === 0 ? (
        <p>検索履歴はありません</p>
      ) : (
        <ul>
          {history.map((item) => (
            <li key={item.id}>・{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchHistory;

//ポイント解説：favorites と同様に、このコンポーネント自身は状態を持たず、親（App.jsx）から渡された history 配列を表示するだけです。
