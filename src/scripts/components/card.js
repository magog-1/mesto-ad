const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

const isLikedByUser = (likes, currentUserId) => {
  return likes.some((user) => user._id === currentUserId);
};

export const createCardElement = (
  data,
  currentUserId,
  { onPreviewPicture, onLikeClick, onDeleteClick }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  let cardData = data;

  const applyLikeState = (card) => {
    cardData = card;
    const liked = isLikedByUser(cardData.likes, currentUserId);

    likeButton.classList.toggle("card__like-button_is-active", liked);

    if (likeCount) {
      likeCount.textContent = cardData.likes.length;
    }
  };

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;
  applyLikeState(cardData);

  if (onLikeClick) {
    likeButton.addEventListener("click", () => {
      onLikeClick({
        cardId: cardData._id,
        isLiked: isLikedByUser(cardData.likes, currentUserId),
        likeButton,
        applyCardData: applyLikeState,
      });
    });
  }

  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else if (onDeleteClick) {
    deleteButton.addEventListener("click", () => {
      onDeleteClick({
        cardId: cardData._id,
        cardElement,
      });
    });
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: cardData.name, link: cardData.link })
    );
  }

  return cardElement;
};
