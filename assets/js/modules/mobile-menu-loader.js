export const setupLazyMobileMenu = () => {
  "use strict";

  const hamburgerButton = document.querySelector(".hamburger-box");

  if (!hamburgerButton) {
    return;
  }

  let loadPromise = null;

  const loadMenuModule = async () => {
    if (!loadPromise) {
      loadPromise = import("./mobile-menu.js").then((module) => {
        module.initMobileMenu();
      });
    }

    return loadPromise;
  };

  const warmup = () => {
    void loadMenuModule();
  };

  const bootstrapOnFirstClick = async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    await loadMenuModule();

    window.requestAnimationFrame(() => {
      hamburgerButton.click();
    });
  };

  // Load only when there is clear user intent.
  hamburgerButton.addEventListener("click", bootstrapOnFirstClick, { once: true, capture: true });
  hamburgerButton.addEventListener("pointerenter", warmup, { once: true });
  hamburgerButton.addEventListener("touchstart", warmup, { once: true, passive: true });
};
