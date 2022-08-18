"use strict";

const element = document.getElementById("year");

if(element instanceof HTMLElement){
  const year = new Date(Date.now()).getFullYear();
  element.textContent = `${year}`;
}

export {};