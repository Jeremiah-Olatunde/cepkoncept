"use strict";

// IMPORT ALL COMPONENT ROOT SCRIPTS
import "./**/index.ts";

import { scroll } from  "./scripts/scroll";

const links = Array.from(document.querySelectorAll("[data-nav-link]")) as HTMLElement[];
const sections = Array.from(document.querySelectorAll("[data-nav-target]")) as HTMLElement[];

//--CHANGE ACTIVE NAVBAR LINK BASED ON IN VIEW SECTION---------------

function search<K, T>(
  k: K, 
  arr: T[], 
  compare: (a: T, b: K) => boolean
): number {
  let start = 0;
  let end = arr.length - 1;

  while(start <= end){
    const pivot = Math.floor((start + end)/2); 
    [start, end] = compare(arr[pivot], k) ?  [pivot + 1, end] : [start, end - 1];
  }

  return Math.max(start, end);
}

const buffer: any[] = [];

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) buffer.push(entry);
    else {
      const idx = buffer.findIndex(v => v.target === entry.target);
      if(-1 < idx) buffer.splice(idx, 1);
    }
  });
  
  const sorted = buffer.slice().sort((a, b) => a.intersectionRatio < b.intersectionRation ? 0 : 1);
  const link = links.find(link => link.dataset.navLink === sorted.at(-1).target.dataset.navTarget);

  links.forEach(link => link.classList.remove("active"));
  link?.classList.add("active");
}, { threshold: .2 });

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