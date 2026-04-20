export const initNavbarDropdown = () => {
  "use strict";

  const dropdownItems = Array.from(document.querySelectorAll("[data-dropdown]"));
  const closeTimers = new WeakMap();

  if (!dropdownItems.length) {
    return;
  }

  const syncDropdownSize = (menu) => {
    menu.style.setProperty("--dropdown-height", `${menu.scrollHeight}px`);
  };

  const setExpandedState = (button, isExpanded) => {
    button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  };

  const cancelClose = (item) => {
    const timerId = closeTimers.get(item);

    if (!timerId) {
      return;
    }

    window.clearTimeout(timerId);
    closeTimers.delete(item);
  };

  const openDropdown = (item) => {
    const button = item.querySelector(".nav-dd-toggle");
    const menu = item.querySelector(".dropdown-menu-custom");

    if (!button || !menu) {
      return;
    }

    cancelClose(item);
    syncDropdownSize(menu);
    item.classList.add("is-open");
    menu.classList.add("is-open");
    setExpandedState(button, true);
  };

  const closeDropdown = (item) => {
    const button = item.querySelector(".nav-dd-toggle");
    const menu = item.querySelector(".dropdown-menu-custom");

    if (!button || !menu) {
      return;
    }

    item.classList.remove("is-open");
    menu.classList.remove("is-open");
    setExpandedState(button, false);
  };

  const scheduleClose = (item) => {
    cancelClose(item);

    const timerId = window.setTimeout(() => {
      closeDropdown(item);
      closeTimers.delete(item);
    }, 180);

    closeTimers.set(item, timerId);
  };

  const closeAllDropdowns = (exceptItem = null) => {
    dropdownItems.forEach((item) => {
      if (item !== exceptItem) {
        cancelClose(item);
        closeDropdown(item);
      }
    });
  };

  const focusFirstMenuLink = (menu) => {
    const firstLink = menu.querySelector("a");

    if (firstLink) {
      firstLink.focus();
    }
  };

  const syncAllDropdowns = () => {
    dropdownItems.forEach((item) => {
      const menu = item.querySelector(".dropdown-menu-custom");

      if (menu) {
        syncDropdownSize(menu);
      }
    });
  };

  dropdownItems.forEach((item) => {
    const button = item.querySelector(".nav-dd-toggle");
    const menu = item.querySelector(".dropdown-menu-custom");

    if (!button || !menu) {
      return;
    }

    syncDropdownSize(menu);

    button.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen = item.classList.contains("is-open");
      closeAllDropdowns(item);

      if (isOpen) {
        closeDropdown(item);
        return;
      }

      openDropdown(item);
    });

    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") {
        return;
      }

      event.preventDefault();
      closeAllDropdowns(item);
      openDropdown(item);
      focusFirstMenuLink(menu);
    });

    item.addEventListener("mouseenter", () => {
      closeAllDropdowns(item);
      openDropdown(item);
    });

    item.addEventListener("mouseleave", () => {
      scheduleClose(item);
    });

    item.addEventListener("focusout", (event) => {
      if (!item.contains(event.relatedTarget)) {
        closeDropdown(item);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-dropdown]")) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const openItem = dropdownItems.find((item) => item.classList.contains("is-open"));
    closeAllDropdowns();

    if (!openItem) {
      return;
    }

    const button = openItem.querySelector(".nav-dd-toggle");
    if (button) {
      button.focus();
    }
  });

  window.addEventListener("load", syncAllDropdowns);
  window.addEventListener("resize", syncAllDropdowns);
};
