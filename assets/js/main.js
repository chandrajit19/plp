import { initNavbarDropdown } from "./modules/navbar-dropdown.js";
import { setupLazyMobileMenu } from "./modules/mobile-menu-loader.js";
import { initDisclaimerGate } from "./modules/disclaimer-gate.js";
import { initSwiperWhenVisible } from "./modules/swiper-loader.js";

const boot = () => {
  initNavbarDropdown();
  initDisclaimerGate();
  setupLazyMobileMenu();
  initSwiperWhenVisible();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
