/**
 * BOOKY — third-party bundle → dist/assets/js/plugins.js (IIFE)
 * Swiper + GSAP core + ScrollTrigger only (plan.md §2).
 * Exposed as globals for the app bundle; loaded first via defer order.
 */
import Swiper from "swiper/bundle";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

window.Swiper = Swiper;
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
