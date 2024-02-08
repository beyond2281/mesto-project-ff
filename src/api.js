export const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-5",
  headers: {
    authorization: "87c8aa25-04d0-4103-a6d9-c45510e9c4e5",
    "Content-Type": "application/json",
  },
};

function handleResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

export function userInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
}

export function getCard() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
}

export function userEdit(user) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: user.name,
      about: user.about,
    }),
  }).then(handleResponse);
}

export function newCardAddServer(card) {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: card.name,
      link: card.link,
    }),
  }).then(handleResponse);
}

export function deleteCard(id) {
  return fetch(`${config.baseUrl}/cards/${id}`, {
    method: "DELETE",
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
}

export function pushLikeCard(id) {
  return fetch(`${config.baseUrl}/cards/likes/${id}`, {
    method: "PUT",
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
}

export function delLikeCard(id) {
  return fetch(`${config.baseUrl}/cards/likes/${id}`, {
    method: "DELETE",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": "application/json",
    },
  }).then(handleResponse);
}

export function editUserAvatar(linkImgAvatar) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      avatar: linkImgAvatar,
    }),
  }).then(handleResponse);
}
