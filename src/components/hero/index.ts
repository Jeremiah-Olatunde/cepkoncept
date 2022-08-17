"use strict";

import { scroll } from "~/src/scripts/scroll";

const btns = Array.from(document.querySelectorAll(".cepkoncept-hero .view-more"));
const projects = document.getElementById("cepkoncept-projects");

btns.forEach(btn => btn.addEventListener("click", (event) => {

  const offset = +(projects.dataset.scrollOffset ?? 0);  

  if (!(projects instanceof HTMLElement)) return;
  scroll(window.pageYOffset, projects.offsetTop + offset);
}));

export {}