import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const MOTION = "(prefers-reduced-motion: no-preference)";
// Scenes pin only where they have room; elsewhere their content stacks.
const PINNED = `(min-width: 60rem) and (min-height: 680px) and ${MOTION}`;
// Pointer effects need a real pointer.
const POINTER = `(hover: hover) and (pointer: fine) and ${MOTION}`;

let lenis = null;

export function scrollToId(id) {
  if (lenis) lenis.scrollTo(id);
  else document.querySelector(id)?.scrollIntoView();
}

// Splits a heading into words and characters. Screen readers keep the whole line.
function splitChars(el) {
  const text = el.textContent;
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const chars = [];
  text.split(" ").forEach((word, i, all) => {
    const w = document.createElement("span");
    w.className = "word";
    w.setAttribute("aria-hidden", "true");
    for (const ch of word) {
      const c = document.createElement("span");
      c.className = "ch";
      c.textContent = ch;
      w.append(c);
      chars.push(c);
    }
    el.append(w);
    if (i < all.length - 1) el.append(" ");
  });
  return { chars, restore: () => { el.textContent = text; el.removeAttribute("aria-label"); } };
}

// Everything that moves with the scroll on any screen.
function buildScroll() {
  const undo = [];

  gsap.fromTo(
    ".nav__progress",
    { scaleX: 0 },
    { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } },
  );

  // The scene: every chapter has its own photograph, and each arrives through a different cut
  // (iris, wipe, slant, iris from the floor, rise) scrubbed as the chapter's top crosses the screen.
  const shots = gsap.utils.toArray(".scene__shot");
  gsap.fromTo(shots, { scale: 1.04 }, { scale: 1.32, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.8 } });
  const cuts = [
    ["#experience", "circle(0% at 50% 62%)", "circle(150% at 50% 62%)"],
    ["#projects", "inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
    ["#about", "polygon(0% 0%, 0% 0%, -40% 100%, -40% 100%)", "polygon(0% 0%, 140% 0%, 100% 100%, -40% 100%)"],
    ["#achievements", "circle(0% at 50% 100%)", "circle(150% at 50% 100%)"],
    ["#contact", "inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  ];
  cuts.forEach(([trigger, from, to], i) => {
    gsap.set(shots[i + 1], { opacity: 1 });
    gsap.fromTo(
      shots[i + 1],
      { clipPath: from },
      { clipPath: to, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "top 20%", scrub: 0.6 } },
    );
  });

  // The nav steps aside on the way down and returns on the way up.
  const nav = document.querySelector(".nav");
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => nav.classList.toggle("is-away", self.direction === 1 && self.scroll() > 480),
  });

  // The hero photograph pushes in and its content lifts away as the page leaves it.
  const hero = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__grid", { yPercent: -12, autoAlpha: 0, ease: "none", scrollTrigger: { ...hero, end: "70% top" } });

  // One entrance, once: the headline rises a character at a time, then the card's rows follow.
  const heroChars = gsap.utils.toArray(".hero .line").flatMap((line) => {
    const { chars, restore } = splitChars(line);
    undo.push(restore);
    return chars;
  });
  gsap
    .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
    .from(heroChars, { yPercent: 110, opacity: 0, duration: 1, stagger: 0.018, ease: "power4.out" })
    .from(".hero__text > :not(h1)", { y: 28, opacity: 0, stagger: 0.09 }, 0.35)
    .from(".now", { y: 36, opacity: 0 }, 0.15)
    .from(".now__rows li, .now__open", { y: 14, opacity: 0, stagger: 0.07, duration: 0.6 }, 0.35);

  // Section heads arrive a character at a time.
  gsap.utils.toArray("main h2:not(.visually-hidden)").forEach((h2) => {
    const { chars, restore } = splitChars(h2);
    undo.push(restore);
    gsap.from(chars, {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      stagger: 0.025,
      ease: "power4.out",
      scrollTrigger: { trigger: h2, start: "top 88%", once: true },
    });
  });

  // The statement lights up word by word while it crosses the screen.
  gsap.fromTo(
    ".statement .w",
    { opacity: 0.18 },
    { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".statement", start: "top 82%", end: "bottom 48%", scrub: true } },
  );

  // The band of names slides with the scroll and leans with its speed.
  gsap.utils.toArray(".marquee__row").forEach((row, i) => {
    gsap.fromTo(
      row,
      { xPercent: i % 2 ? -28 : 0 },
      { xPercent: i % 2 ? 0 : -28, ease: "none", scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: true } },
    );
  });
  const lean = gsap.quickTo(".marquee__row", "skewX", { duration: 0.5, ease: "power3" });
  const upright = () => lean(0);
  ScrollTrigger.create({
    trigger: ".marquee",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => lean(gsap.utils.clamp(-14, 14, self.getVelocity() / -220)),
  });
  ScrollTrigger.addEventListener("scrollEnd", upright);
  undo.push(() => ScrollTrigger.removeEventListener("scrollEnd", upright));

  // Photographs wipe open, then drift inside their frames.
  gsap.utils.toArray("[data-clip]").forEach((frame) => {
    gsap.fromTo(
      frame,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.out", scrollTrigger: { trigger: frame, start: "top 86%", once: true } },
    );
    gsap.fromTo(
      frame.querySelector("img"),
      { yPercent: -7, scale: 1.16 },
      { yPercent: 7, scale: 1.16, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });

  // The footer's name climbs out of the floor.
  const mark = splitChars(document.querySelector(".footer__mark"));
  undo.push(mark.restore);
  gsap.from(mark.chars, {
    yPercent: 105,
    stagger: 0.04,
    ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true },
  });

  // One reveal for everything else, as it arrives.
  gsap.set("[data-rise]", { autoAlpha: 0, y: 32 });
  ScrollTrigger.batch("[data-rise]", {
    start: "top 88%",
    once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true }),
  });

  return () => undo.forEach((fn) => fn());
}

// Pinned scenes: the figures play as a sequence, then the projects list holds while panes change.
function buildPinned() {
  const root = document.documentElement;
  root.classList.add("is-pinned"); // CSS stacks each scene's items in one cell

  const items = gsap.utils.toArray(".seq__item");
  const tl = gsap.timeline({
    defaults: { ease: "none", duration: 1 },
    scrollTrigger: {
      trigger: ".seq",
      pin: ".seq__pin",
      start: "top top",
      end: () => `+=${items.length * 75}%`,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  items.forEach((item, i) => {
    if (i) tl.fromTo(item, { autoAlpha: 0, yPercent: 28, scale: 0.86, filter: "blur(18px)" }, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" }, i * 2 - 1);
    if (i < items.length - 1) tl.to(item, { autoAlpha: 0, yPercent: -28, scale: 1.12, filter: "blur(18px)" }, i * 2 + 1);
  });
  tl.to({}, { duration: 0.6 });

  const section = document.querySelector(".work");
  const buttons = [...section.querySelectorAll(".work__list button")];
  const panes = [...section.querySelectorAll(".pane")];

  let active = 0;
  const show = (idx) => {
    if (idx === active) return;
    active = idx;
    buttons.forEach((b, i) => (i === idx ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
    panes.forEach((p, i) => p.classList.toggle("is-active", i === idx));
  };

  const st = ScrollTrigger.create({
    trigger: section,
    pin: section.querySelector(".work__pin"),
    start: "top top",
    end: () => `+=${panes.length * 62}%`,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => show(Math.min(panes.length - 1, Math.floor(self.progress * panes.length))),
  });

  const jump = (event) => {
    const idx = Number(event.currentTarget.dataset.index);
    const y = st.start + ((idx + 0.5) / panes.length) * (st.end - st.start);
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo(0, y);
  };
  buttons.forEach((b) => b.addEventListener("click", jump));

  return () => {
    buttons.forEach((b) => b.removeEventListener("click", jump));
    root.classList.remove("is-pinned");
    show(0);
  };
}

// Pointer effects: a labelled cursor, magnetic buttons, a spotlight on rows and a tilt on photographs.
function buildPointer() {
  const root = document.documentElement;
  const cursor = document.querySelector(".cursor");
  const label = cursor.querySelector("span");
  const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
  const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
  root.classList.add("has-pointer");

  const skyX = gsap.quickTo(".scene__cam", "x", { duration: 1.4, ease: "power2" });
  const skyY = gsap.quickTo(".scene__cam", "y", { duration: 1.4, ease: "power2" });

  const onMove = (e) => {
    cx(e.clientX);
    cy(e.clientY);
    skyX((e.clientX / window.innerWidth - 0.5) * -36);
    skyY((e.clientY / window.innerHeight - 0.5) * -36);
    const target = e.target.closest?.("[data-cursor]");
    cursor.classList.toggle("is-on", Boolean(target));
    if (target) label.textContent = target.dataset.cursor;

    const spot = e.target.closest?.(".spot");
    if (spot) {
      const r = spot.getBoundingClientRect();
      spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
      spot.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const undo = [() => window.removeEventListener("pointermove", onMove), () => root.classList.remove("has-pointer")];
  const pull = (el, strength, props) => {
    const [a, b] = props.map((p) => gsap.quickTo(el, p, { duration: 0.5, ease: "power3" }));
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      props[0] === "x" ? (a(dx * r.width * strength), b(dy * r.height * strength)) : (a(dx * strength), b(-dy * strength));
    };
    const leave = () => { a(0); b(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    undo.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
  };

  gsap.utils.toArray(".btn, .now__socials a").forEach((el) => pull(el, 0.32, ["x", "y"]));
  gsap.utils.toArray(".shot__frame").forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    pull(el, 14, ["rotationY", "rotationX"]);
  });

  return () => undo.forEach((fn) => fn());
}

export default function useCinematics() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(PINNED, buildPinned);
    mm.add(MOTION, buildScroll);
    mm.add(POINTER, buildPointer);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (window.matchMedia(MOTION).matches) {
      lenis = new Lenis({ anchors: true, prevent: (node) => node.tagName === "TEXTAREA" });
      lenis.on("scroll", ScrollTrigger.update);
    }
    const raf = (time) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      mm.revert();
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}
