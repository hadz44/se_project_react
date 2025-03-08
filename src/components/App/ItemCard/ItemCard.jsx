import "../ItemCard/ItemCard.css";

function ItemCard({ item, onCardClick }) {
    const handleImageClick = () => {
        onCardClick(item);
    };

    return (
        <li className="card">
            <div>
                <h2 className="card__name">{item.name}</h2>
                <img
                    onClick={handleImageClick}
                    className="card__image" 
                    src={item.image} 
                    alt={item.name} />
            </div>
        </li>
    )
}

export default ItemCard;