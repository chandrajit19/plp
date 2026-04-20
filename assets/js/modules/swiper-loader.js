const SWIPER_SELECTOR = ".continuous-swiper";
const SWIPER_CDN_JS = "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js";
const SWIPER_READY_ATTR = "data-swiper-ready";

const hasValidSwiperMarkup = (root) => {
  if (!root) {
    return false;
  }

  const wrapper = root.querySelector(".swiper-wrapper");
  const slides = root.querySelectorAll(".swiper-slide");
  return Boolean(wrapper) && slides.length > 0;
};

const loadSwiperScript = () => {
  if (window.Swiper) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SWIPER_CDN_JS}"]`);

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Swiper.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = SWIPER_CDN_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Swiper."));
    document.head.appendChild(script);
  });
};

const mountSwiper = async (root) => {
  if (root.getAttribute(SWIPER_READY_ATTR) === "true") {
    return;
  }

  await loadSwiperScript();

  if (!window.Swiper) {
    return;
  }

  new window.Swiper(root, {
    loop: true,
    slidesPerView: "auto",
    freeMode: false,
    allowTouchMove: false,
    speed: 40000,
    autoplay: {
      delay: 1,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
      reverseDirection: false,
    },
    watchOverflow: false,
  });

  root.setAttribute(SWIPER_READY_ATTR, "true");
};

export const initSwiperWhenVisible = () => {
  "use strict";

  const swiperRoot = document.querySelector(SWIPER_SELECTOR);

  // Swiper cannot initialize without container + wrapper + slides.
  if (!hasValidSwiperMarkup(swiperRoot)) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    void mountSwiper(swiperRoot);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);

      if (!isVisible) {
        return;
      }

      currentObserver.disconnect();
      void mountSwiper(swiperRoot);
    },
    { rootMargin: "160px 0px" },
  );

  observer.observe(swiperRoot);
};
