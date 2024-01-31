export const config = {
baseUrl: 'https://nomoreparties.co/v1/wff-cohort-5',
  headers: {
    authorization: '87c8aa25-04d0-4103-a6d9-c45510e9c4e5',
    'Content-Type': 'application/json'
  }
}

export function userInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: {
      authorization: config.headers.authorization
    }
  })
}

export function getCard() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: {
      authorization: config.headers.authorization
    }
  })
}

export function userEdit(user) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      authorization: config.headers.authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: user.name,
      about: user.about
    })
  })
}

export function newCardAddServer(card) {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: {
      authorization: config.headers.authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: card.name,
      link: card.link
    })
  })
}