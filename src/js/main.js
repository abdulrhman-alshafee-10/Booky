/**
 * BOOKY — app entry → dist/assets/js/main.js
 * Feature modules are imported and initialised here as phases land
 * (plan.md §12). Every module no-ops cleanly when its markup is absent.
 */
import { initStore }         from "./modules/store.js";
import { initHeader }        from "./modules/header.js";
import { initDialogs }       from "./modules/dialog.js";
import { initMobileNav }     from "./modules/mobile-nav.js";
import { initSearchOverlay } from "./modules/search-overlay.js";
import { initTabs }          from "./modules/tabs.js";
import { initAccordions }    from "./modules/accordion.js";
import { initToasts }        from "./modules/toast.js";
import { initBackToTop }     from "./modules/back-to-top.js";
import { initQuantity }      from "./modules/quantity.js";
import { initCart, initCartPage } from "./modules/cart-ui.js";
import { initWishlist, initWishlistPage } from "./modules/wishlist.js";
import { initCompare, initComparePage } from "./modules/compare.js";
import { initQuickview }     from "./modules/quickview.js";
import { initProduct }       from "./modules/product.js";
import { initCheckout, initOrderComplete } from "./modules/checkout.js";
import { initCarousels }     from "./modules/carousel.js";
import { initCountdowns }    from "./modules/countdown.js";
import { initForms }         from "./modules/forms.js";
import { initShop }          from "./modules/shop.js";
import { initBlog }          from "./modules/blog.js";
import { initPages }         from "./modules/pages.js";
import { initAccount }       from "./modules/account.js";

document.documentElement.classList.add("js");

initStore();
initHeader();
initDialogs();
initMobileNav();
initSearchOverlay();
initTabs();
initAccordions();
initToasts();
initBackToTop();
initQuantity();
initCart();
initCartPage();
initWishlist();
initWishlistPage();
initCompare();
initComparePage();
initQuickview();
initProduct();
initCheckout();
initOrderComplete();
initCarousels();
initCountdowns();
initForms();
initShop();
initBlog();
initPages();
initAccount();
