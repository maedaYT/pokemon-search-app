// お気に入り一覧を表示する部品です。
function FavoriteList({ favorites }) {
  return (
    <div className="favorite-list">
      <h2>【お気に入り】</h2>
      {favorites.length === 0 ? (
        <p>お気に入りはまだ登録されていません。</p>
      ) : (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.id}>♥ {favorite.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoriteList;

//ポイント解説：
//key={favorite.id} … リスト表示（map）をするとき、Reactは各要素を区別するために一意な key を必要とします。ポケモンのID（図鑑番号）は重複しないので、
// これをkeyに使っています。
