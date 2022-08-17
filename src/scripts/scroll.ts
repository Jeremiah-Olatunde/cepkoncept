"use strict";

import { animate } from "motion";

export function scroll(from: number, to: number){
  const navbar = document.getElementById("cepkoncept-navbar")!;
  const displacement: number = (to - navbar.offsetHeight) - from;

  animate((t) => {
    window.scrollTo(0, from + displacement * t);
  }, { duration: 2, easing: [.17, .85, .438, .99]})
}