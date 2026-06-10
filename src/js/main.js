/**
 * Booky — main.js
 * Entry point. Imports and initialises all feature modules.
 * Scripts are loaded with defer — DOM is ready when this executes.
 * Every init is null-safe: it no-ops if its markup isn't on the page.
 */

import { initTheme }          from "./modules/theme.js";
import { initAccordions }     from "./modules/accordion.js";
import { initTabs }           from "./modules/tabs.js";
import { initModals }         from "./modules/modal.js";
import { initDropdowns }      from "./modules/dropdown.js";
import { initHeader }         from "./modules/header.js";
import { initMobileNav }      from "./modules/mobile-nav.js";
import { initCountdowns }     from "./modules/countdown.js";
import { initCarousels }      from "./modules/carousel.js";
import { initNewsletter }     from "./modules/newsletter.js";
import { initBackToTop }      from "./modules/back-to-top.js";
import { initCartUI }         from "./modules/cart-ui.js";
import { initVideoBackgrounds } from "./modules/media.js";
import { initShopFilters }    from "./modules/shop-filters.js";
import { initStore }          from "./modules/store.js";
import { initCart }           from "./modules/cart.js";
import { initWishlist }       from "./modules/wishlist.js";
import { initCompare }        from "./modules/compare.js";
import { initQuantity }       from "./modules/quantity.js";
import { initProductGallery } from "./modules/product-gallery.js";
import { initQuickview }      from "./modules/quickview.js";
import { initAutoForms }      from "./modules/form-validate.js";
import { initCheckout }       from "./modules/checkout.js";
import { initAccount }        from "./modules/account.js";
import { initSkeleton }       from "./modules/skeleton.js";
import { initBlog }           from "./modules/blog.js";
import { initToc }            from "./modules/toc.js";
import { initAudioPreview }   from "./modules/audio-preview.js";
import { initPricing }        from "./modules/pricing.js";
import { initContact }        from "./modules/contact.js";
import { initGiftCard }       from "./modules/gift-card.js";
import { initGallery }        from "./modules/gallery.js";
import { initFilterLists }    from "./modules/filter-list.js";
import { initRtlToggle }      from "./modules/rtl-toggle.js";
import { initMotion }         from "./modules/motion.js";

// Foundation
initTheme();
initStore();
initAccordions();
initTabs();
initModals();
initDropdowns();

// Page chrome
initHeader();
initMobileNav();
initCountdowns();
initCarousels();
initNewsletter();
initBackToTop();
initCartUI();
initVideoBackgrounds();

// Shop
initShopFilters();

// eCommerce
initCart();
initWishlist();
initCompare();
initQuantity();
initProductGallery();
initQuickview();

// Forms & checkout
initAutoForms();
initCheckout();

// Account
initAccount();

// UX
initSkeleton();

// Blog
initBlog();
initToc();

// Phase 5 features
initAudioPreview();
initPricing();
initContact();
initGiftCard();
initGallery();
initFilterLists();

// Phase 6 features
initRtlToggle();

// Motion layer must run last — GSAP needs final layout
initMotion();
