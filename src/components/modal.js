// Функция открытия модального окна
export function openModal(popup) {
  popup.classList.add("popup_is-animated");
  setTimeout(() => {
    popup.classList.add("popup_is-opened");
  }, 0);
  // popup.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", closeModalEsc);
}

// Функция закрытия модального окна
export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  // popup.removeEventListener("click", closeOverlay);
  document.removeEventListener("keydown", closeModalEsc);
}

// Функция закрытия модального окна по ESC
export function closeModalEsc(event) {
  if (event.key === "Escape") {
    closeModal(document.querySelector(".popup_is-opened"));
  }
}
