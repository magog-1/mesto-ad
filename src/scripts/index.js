/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import {
  getCardList,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  addCard,
  deleteCard,
  changeLikeCardStatus,
} from "./components/api.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");
const logoElement = document.querySelector(".logo");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const deleteCardModalWindow = document.querySelector(".popup_type_remove-card");
const deleteCardForm = deleteCardModalWindow.querySelector(".popup__form");
const usersStatsModalWindow = document.querySelector(".popup_type_info");
const usersStatsModalTitle = usersStatsModalWindow.querySelector(".popup__title");
const usersStatsModalInfoList = usersStatsModalWindow.querySelector(".popup__info");
const usersStatsModalText = usersStatsModalWindow.querySelector(".popup__text");
const usersStatsModalUsersList = usersStatsModalWindow.querySelector(".popup__list");

const infoTemplate = document.getElementById("popup-info-definition-template").content;
const userPreviewTemplate = document
  .getElementById("popup-info-user-preview-template")
  .content;

let currentUserId = "";
let cardToDelete = null;

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const setButtonLoadingState = (button, isLoading, loadingText) => {
  if (!button.dataset.defaultText) {
    button.dataset.defaultText = button.textContent;
  }

  button.textContent = isLoading ? loadingText : button.dataset.defaultText;
  button.disabled = isLoading;
};

const formatDate = (date) => {
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const createInfoString = (term, description) => {
  const infoItem = infoTemplate.querySelector(".popup__info-item").cloneNode(true);
  infoItem.querySelector(".popup__info-term").textContent = term;
  infoItem.querySelector(".popup__info-description").textContent = description;

  return infoItem;
};

const createUserBadge = (userName) => {
  const userItem = userPreviewTemplate
    .querySelector(".popup__list-item")
    .cloneNode(true);
  userItem.textContent = userName;

  return userItem;
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const renderCard = (cardData, method = "append") => {
  const cardElement = createCardElement(cardData, currentUserId, {
    onPreviewPicture: handlePreviewPicture,
    onLikeClick: ({ cardId, isLiked, likeButton, applyCardData }) => {
      likeButton.disabled = true;
      changeLikeCardStatus(cardId, isLiked)
        .then((updatedCard) => {
          applyCardData(updatedCard);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          likeButton.disabled = false;
        });
    },
    onDeleteClick: ({ cardId, cardElement: element }) => {
      cardToDelete = { cardId, cardElement: element };
      openModalWindow(deleteCardModalWindow);
    },
  });

  if (method === "prepend") {
    placesWrap.prepend(cardElement);
    return;
  }

  placesWrap.append(cardElement);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;

  setButtonLoadingState(submitButton, true, "Сохранение...");
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonLoadingState(submitButton, false, "Сохранение...");
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;

  setButtonLoadingState(submitButton, true, "Сохранение...");
  setUserAvatar({ avatar: avatarInput.value })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonLoadingState(submitButton, false, "Сохранение...");
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;

  setButtonLoadingState(submitButton, true, "Создание...");
  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      renderCard(cardData, "prepend");
      closeModalWindow(cardFormModalWindow);
      cardForm.reset();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonLoadingState(submitButton, false, "Создание...");
    });
};

const handleDeleteCardSubmit = (evt) => {
  evt.preventDefault();

  if (!cardToDelete) {
    return;
  }

  const submitButton = evt.submitter;
  setButtonLoadingState(submitButton, true, "Удаление...");
  deleteCard(cardToDelete.cardId)
    .then(() => {
      cardToDelete.cardElement.remove();
      cardToDelete = null;
      closeModalWindow(deleteCardModalWindow);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonLoadingState(submitButton, false, "Удаление...");
    });
};

const handleLogoClick = () => {
  getCardList()
    .then((cards) => {
      usersStatsModalTitle.textContent = "Статистика карточек";
      usersStatsModalInfoList.replaceChildren();
      usersStatsModalUsersList.replaceChildren();

      if (!cards.length) {
        usersStatsModalInfoList.append(createInfoString("Карточек:", "0"));
        usersStatsModalText.textContent = "Пользователи";
        openModalWindow(usersStatsModalWindow);
        return;
      }

      const sortedByDate = [...cards].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      const totalLikes = cards.reduce((sum, card) => sum + card.likes.length, 0);
      const usersMap = new Map();

      cards.forEach((card) => {
        usersMap.set(card.owner._id, card.owner.name);
        card.likes.forEach((user) => {
          usersMap.set(user._id, user.name);
        });
      });

      usersStatsModalInfoList.append(createInfoString("Карточек:", String(cards.length)));
      usersStatsModalInfoList.append(createInfoString("Лайков:", String(totalLikes)));
      usersStatsModalInfoList.append(
        createInfoString("Уникальных пользователей:", String(usersMap.size))
      );
      usersStatsModalInfoList.append(
        createInfoString("Первая создана:", formatDate(new Date(sortedByDate[0].createdAt)))
      );
      usersStatsModalInfoList.append(
        createInfoString(
          "Последняя создана:",
          formatDate(new Date(sortedByDate[sortedByDate.length - 1].createdAt))
        )
      );

      usersStatsModalText.textContent = "Участники активности";
      Array.from(usersMap.values())
        .sort((a, b) => a.localeCompare(b, "ru"))
        .forEach((name) => {
          usersStatsModalUsersList.append(createUserBadge(name));
        });

      openModalWindow(usersStatsModalWindow);
    })
    .catch((err) => {
      console.error(err);
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);
deleteCardForm.addEventListener("submit", handleDeleteCardSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModalWindow(cardFormModalWindow);
});

logoElement.addEventListener("click", handleLogoClick);

deleteCardModalWindow
  .querySelector(".popup__close")
  .addEventListener("click", () => {
    cardToDelete = null;
  });

deleteCardModalWindow.addEventListener("mousedown", (evt) => {
  if (evt.target === deleteCardModalWindow) {
    cardToDelete = null;
  }
});

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((card) => {
      renderCard(card);
    });
  })
  .catch((err) => {
    console.error(err);
  });

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationConfig);
