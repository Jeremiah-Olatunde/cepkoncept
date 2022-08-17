"use strict";

function toggleFixedClass(navbar: HTMLElement | null): void {
  if(!(navbar instanceof HTMLElement)) return;
  if(window.pageYOffset !== 0) navbar.classList.add("fixed");
  else navbar.classList.remove("fixed");
}

document.addEventListener("scroll", () => {
  toggleFixedClass(document.getElementById("cepkoncept-navbar"));
})

document.body.onload = function(){
  toggleFixedClass(document.getElementById("cepkoncept-navbar"));
}

export {}