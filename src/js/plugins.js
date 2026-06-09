/**
 * Third-party plugin bundle.
 * Exposes Swiper (and the modules we use) on window so main.js can init it.
 * Built as IIFE → dist/assets/js/plugins.js, loaded with defer BEFORE main.js.
 */

import Swiper from "swiper";
import { Navigation, Pagination, A11y, Autoplay, Keyboard } from "swiper/modules";

window.Swiper = Swiper;
window.SwiperModules = { Navigation, Pagination, A11y, Autoplay, Keyboard };
