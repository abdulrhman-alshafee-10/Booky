/**
 * Booky — main.js
 * Entry point. Imports and initialises all feature modules.
 * Scripts are loaded with defer — DOM is ready when this executes.
 * Every init is null-safe: it no-ops if its markup isn't on the page.
 */

import { initTheme }       from "./modules/theme.js";
import { initAccordions }  from "./modules/accordion.js";
import { initTabs }        from "./modules/tabs.js";
import { initModals }      from "./modules/modal.js";
import { initDropdowns }   from "./modules/dropdown.js";
import { initHeader }      from "./modules/header.js";
import { initMobileNav }   from "./modules/mobile-nav.js";
import { initCountdowns }  from "./modules/countdown.js";
import { initCarousels }   from "./modules/carousel.js";
import { initNewsletter }  from "./modules/newsletter.js";
import { initBackToTop }   from "./modules/back-to-top.js";
import { initCartUI }      from "./modules/cart-ui.js";
import { initVideoBackgrounds } from "./modules/media.js";
import { initShopFilters } from "./modules/shop-filters.js";

// Foundation
initTheme();
initAccordions();
initTabs();
initModals();
initDropdowns();

// Home / page chrome
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
