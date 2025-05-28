import "./ItemCard.css";

function ItemCard({ item, onCardClick }) {
  const handleCardClick = () => {
    onCardClick(item);
  };

  return (
    <li className="card" onClick={() => onCardClick(item)}>
      <img
        src={item.imageUrl || item.link}
        alt={item.name}
        className="card__image"
      />
      <p className="card__name">{item.name}</p>
    </li>
  );
}

export default ItemCard;
