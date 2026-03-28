const env = import.meta.env || {};

const cohortId = env.VITE_MESTO_COHORT_ID;
const token = env.VITE_MESTO_TOKEN;

const config = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${cohortId}`,
  headers: {
    authorization: token,
    "Content-Type": "application/json",
  },
};

const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

const checkConfig = () => {
  if (!cohortId || !token) {
    return Promise.reject(
      "Ошибка конфигурации: задайте VITE_MESTO_COHORT_ID и VITE_MESTO_TOKEN в .env"
    );
  }
  return Promise.resolve();
};

export const getUserInfo = () => {
  return checkConfig().then(() => {
    return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers,
    }).then(getResponseData);
  });
};

export const getCardList = () => {
  return checkConfig().then(() => {
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers,
    }).then(getResponseData);
  });
};

export const setUserInfo = ({ name, about }) => {
  return checkConfig().then(() => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify({ name, about }),
    }).then(getResponseData);
  });
};

export const setUserAvatar = ({ avatar }) => {
  return checkConfig().then(() => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify({ avatar }),
    }).then(getResponseData);
  });
};

export const addCard = ({ name, link }) => {
  return checkConfig().then(() => {
    return fetch(`${config.baseUrl}/cards`, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify({ name, link }),
    }).then(getResponseData);
  });
};

export const deleteCard = (cardId) => {
  return checkConfig().then(() => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: config.headers,
    }).then(getResponseData);
  });
};

export const changeLikeCardStatus = (cardId, isLiked) => {
  return checkConfig().then(() => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: config.headers,
    }).then(getResponseData);
  });
};
