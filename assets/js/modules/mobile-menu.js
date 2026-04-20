export const initMobileMenu = () => {
  "use strict";

  const hamburgerButton = document.querySelector(".hamburger-box");
  const mobileShell = document.querySelector("#mobile-nav-shell");
  const backdropButton = document.querySelector(".mobile-nav-backdrop");
  const mobilePanel = document.querySelector("#mobile-nav-panel");

  if (!hamburgerButton || !mobileShell || !backdropButton || !mobilePanel) {
    return;
  }

  if (hamburgerButton.dataset.mobileMenuReady === "true") {
    return;
  }
  hamburgerButton.dataset.mobileMenuReady = "true";

  hamburgerButton.setAttribute("aria-label", "Open menu");

  const closeMenu = () => {
    hamburgerButton.classList.remove("is-active");
    hamburgerButton.setAttribute("aria-expanded", "false");
    hamburgerButton.setAttribute("aria-label", "Open menu");
    mobileShell.classList.remove("is-open");
    document.body.classList.remove("mobile-menu-open");

    window.setTimeout(() => {
      if (!mobileShell.classList.contains("is-open")) {
        mobileShell.hidden = true;
      }
    }, 300);
  };

  const openMenu = () => {
    mobileShell.hidden = false;
    window.requestAnimationFrame(() => {
      mobileShell.classList.add("is-open");
    });

    hamburgerButton.classList.add("is-active");
    hamburgerButton.setAttribute("aria-expanded", "true");
    hamburgerButton.setAttribute("aria-label", "Close menu");
    document.body.classList.add("mobile-menu-open");
  };

  const toggleMenu = () => {
    if (mobileShell.classList.contains("is-open")) {
      closeMenu();
      return;
    }

    openMenu();
  };

  hamburgerButton.addEventListener("click", toggleMenu);
  backdropButton.addEventListener("click", closeMenu);

  mobilePanel.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileShell.classList.contains("is-open")) {
      closeMenu();
      hamburgerButton.focus();
    }
  });

  const onViewportChange = () => {
    if (window.innerWidth >= 992) {
      closeMenu();
      mobileShell.hidden = true;
    }
  };

  window.addEventListener("resize", onViewportChange);
};
