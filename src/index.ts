"use strict";

// IMPORT ALL COMPONENT ROOT SCRIPTS
import "./**/index.ts";

import { scroll } from  "./scripts/scroll";

const links = Array.from(document.querySelectorAll("[data-nav-link]")) as HTMLElement[];
const sections = Array.from(document.querySelectorAll("[data-nav-target]")) as HTMLElement[];
//--CHANGE ACTIVE NAVBAR LINK BASED ON IN VIEW SECTION---------------

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const target = (entry.target as HTMLElement).dataset.navTarget;
    const link = links.find(link => link.dataset.navLink === target);

    if(!(link instanceof HTMLElement) || !entry.isIntersecting) return;

    links.forEach(link => link.classList.remove("active"));
    link.classList.add("active");
  })
}, { threshold: .75 });

sections.forEach(section => observer.observe(section));

//-------------------------------------------------------------------



//--SCROLLING NAVIGATION FROM LANBAR LINKS---------------------------

links.forEach(link => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const target = document.querySelector(`[data-nav-target=${link.dataset.navLink}]`);
    if(!(target instanceof HTMLElement)) return;

    const offset = +(target.dataset.scrollOffset ?? 0);

    scroll(window.pageYOffset, target.offsetTop + offset);
  });
})

//-------------------------------------------------------------------

export {}