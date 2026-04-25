export const initDisclaimerGate = () => {
  "use strict";

  const root = document.documentElement;
  const gate = document.querySelector("#plp-disclaimer-gate");
  const acceptButton = gate?.querySelector("[data-disclaimer-accept]");

  if (!gate || !acceptButton ) {
    return;
  }

  const STORAGE_KEY = "plp_disclaimer_ack_v1";
  const REDIRECT_URL = "https://www.google.com/";

  const hasAccepted = () => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "accepted";
    } catch (error) {
      return false;
    }
  };

  const setAccepted = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch (error) {
      // Continue even if storage is blocked.
    }
  };

  const openGate = () => {
    root.setAttribute("data-plp-disclaimer", "pending");
    gate.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      acceptButton.focus();
    }, 0);
  };

  const closeGate = () => {
    root.setAttribute("data-plp-disclaimer", "accepted");
    gate.setAttribute("aria-hidden", "true");
  };

  if (hasAccepted()) {
    closeGate();
  } else {
    openGate();
  }

  acceptButton.addEventListener("click", () => {
    setAccepted();
    closeGate();
  });

  document.addEventListener("keydown", (event) => {
    if (root.getAttribute("data-plp-disclaimer") === "pending" && event.key === "Escape") {
      event.preventDefault();
    }
  });
};
