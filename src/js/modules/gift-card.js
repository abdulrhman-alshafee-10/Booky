/**
 * gift-card.js
 * Gift card configurator: amount/design/recipient selections,
 * live preview update, add-to-cart via store.js.
 */

import { addToCart } from "./store.js";

export function initGiftCard() {
  const config = document.querySelector("[data-gift-config]");
  if (!config) return;

  const preview = document.querySelector("[data-gift-preview]");
  const previewAmount = preview?.querySelector("[data-preview-amount]");
  const previewTo     = preview?.querySelector("[data-preview-to]");
  const addBtn        = config.querySelector("[data-gift-add]");

  // Live preview: amount
  config.querySelectorAll("[data-gift-amount]").forEach((radio) => {
    radio.addEventListener("change", () => {
      if (previewAmount) previewAmount.textContent = "$" + radio.value;
    });
  });

  // Live preview: recipient name
  const recipientInput = config.querySelector("[data-gift-recipient]");
  if (recipientInput && previewTo) {
    recipientInput.addEventListener("input", () => {
      previewTo.textContent = recipientInput.value
        ? "To: " + recipientInput.value
        : "To: Recipient";
    });
  }

  // Add to cart
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const amount  = config.querySelector("[data-gift-amount]:checked")?.value ?? "25";
      const message = config.querySelector("[data-gift-message]")?.value ?? "";
      addToCart({
        id:     "gift-card-" + amount,
        title:  "Gift Card — $" + amount,
        author: "Booky",
        price:  Number(amount),
        cover:  "cover-1",
        type:   "gift-card",
        note:   message,
      });
    });
  }
}
