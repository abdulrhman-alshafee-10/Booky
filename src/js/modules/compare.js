/* compare.js — compare toggle on cards (capped at 4). Active state +
 * toast; persisted in store. The compare page renders in a later phase. */
import { qsa } from "../utils/dom.js";
import { toggleCompare, isInCompare, readPayload, subscribe, compareCap } from "./store.js";
import { toast } from "./toast.js";

function reflect() {
  qsa("[data-compare]").forEach((btn) => {
    btn.classList.toggle("is-active", isInCompare(readPayload(btn).id));
  });
}

export function initCompare() {
  reflect();
  subscribe(reflect);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-compare]");
    if (!btn) return;
    e.preventDefault();
    const p = readPayload(btn);
    const result = toggleCompare(p);
    if (result === "full") {
      toast({ title: "Compare is full", message: `Remove a title — up to ${compareCap} at once.`, type: "error" });
      return;
    }
    btn.classList.toggle("is-active", result === true);
    toast({ title: result ? "Added to compare" : "Removed from compare", message: p.title, type: "info" });
  });
}
