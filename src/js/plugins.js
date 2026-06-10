/**
 * Third-party plugin bundle.
 * Exposes Swiper and GSAP (+ ScrollTrigger) on window so main.js can init them.
 * Built as IIFE → dist/assets/js/plugins.js, loaded with defer BEFORE main.js.
 */

import Swiper from "swiper";
import { Navigation, Pagination, A11y, Autoplay, Keyboard } from "swiper/modules";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

window.Swiper = Swiper;
window.SwiperModules = { Navigation, Pagination, A11y, Autoplay, Keyboard };
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
