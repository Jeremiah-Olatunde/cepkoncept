"use strict";

// IMPORT ALL COMPONENT ROOT SCRIPTS
import "./**/index.ts";

import { Slider } from "~/src/scripts/slider";

const portrait: boolean = true; // document.documentElement.clientWidth < document.documentElement.clientHeight;

const slider = new Slider("projects-slider", {
  focusPosition: portrait ? "center" : "start",
  animConfig: { duration: .5, easing: [.767, .01, .18, 1.01] }
});

function initPagination(){
  const pagination = document.querySelector(".projects-pagination");
  const children = Array.from(pagination?.children || []);

  if(!(pagination instanceof HTMLElement)) return;

  pagination.addEventListener("click", (event) => {
    const next = children.findIndex(child => child === event.target);
    const curr = children.findIndex(child => child.classList.contains("active"));

    slider.jumpToSlide(next);

    if(children[next]){
      children[curr]?.classList.toggle("active");
      children[next]?.classList.toggle("active");
    }
  });
}

initPagination();

export {}