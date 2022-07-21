"use strict";

import { Slider } from "~/src/scripts/slider";

import type { AnimationControls } from "motion";
import { timeline } from "motion";

const slider = new Slider("hero-slider", {
  focusPosition: "start",
  slideshowConfig: { duration: 5 },
  animConfig: { easing: [.767, .01, .18, 1.01], duration: .75}
});

slider.play();

const bgCtrl = initializeBgSlider();

slider.on("transition", ({slideNo}) => {
   bgCtrl(slideNo);

   const cards = document.querySelector(".hero-cards");
   const active = cards?.querySelector(".active");

   active?.classList.toggle("active");
   cards?.children[slideNo].classList.toggle("active");
})

function image(bg: HTMLElement): HTMLImageElement {
  // HEPLER FUNCTION | RETURN IMAGE OF BACKGROUD DIV
  const img = bg.querySelector("img");
  if(img) return img;
  else throw new Error("Background imaged not found");
}

function initializeBgSlider(): (_: number) => void {

  // RETRIEVE BACKGROUNDS FRON THE DOM
  const bgArr: HTMLElement[] = Array.from(document.querySelectorAll(".hero-bg"));

  let bgCurr: number = 0; // SET CURRENT BACKGROUND TO FIRST BACKGROUND

  // INITIAL STYLES OF FIRST BACKGROUND
  bgArr[bgCurr].style.left = "0%";
  image(bgArr[bgCurr]).style.transform = "scale(1.2)";

  // STORES THE ANIMATION CONTROLS OBJECT OF THE CURRENT ANIMATIOM
  let currAnim: AnimationControls;

  return function label(bgNext: number): void {

    // DO NOTHING IF NEXT AND CURRENT BACKGROUND ARE THE SAME
    if(bgNext == bgCurr) return;
    if(bgNext < 0 || bgArr.length <= bgNext) throw new Error("Background index out of range");


    // DEFER ANIMATION UNTIL AFTER ON GOING ANIMATION HAS COMPLETED
    if(currAnim?.playState == "running"){
     currAnim.playbackRate *= 3;
     currAnim.finished.then(_ => label(bgNext));
     return;
    }

    // SET Z-INDEXES
    bgArr[bgCurr].style.zIndex = "-2";
    bgArr[bgNext].style.zIndex = "-1";

    // ANIMATIONS
    currAnim = timeline([
      [ bgArr[bgCurr], { left: [null, "-20%"] }, { duration: 1, easing: [.767, .01, .18, 1.01] } ], // MOVE CURR BG SLIGHTY LEFT
      [ image(bgArr[bgCurr]), { transform: "scale(1)" }, { duration: 1, easing: [.767, .01, .18, 1.01], at: 0 } ], // ZOOM OUT OF CURRENT BG
      [ bgArr[bgNext], { left: [null, "0%"] }, { duration: 1, easing: [.767, .01, .18, 1.01], at: 0 } ], // SLIDE NEXT BG IN
      [ image(bgArr[bgNext]), { transform: "scale(1.2)" }, { duration: 1, easing: [.767, .01, .18, 1.01], at: 0 } ], // ZOOM OUT OF NEXT BG
    ])

    // MOVE CURRENT BACKGROUND TO RIGHT
    // UPDATE CURRENT BACKGROUND
    currAnim.finished.then(_ => {
      bgArr[bgCurr].style.left = "100%";
      image(bgArr[bgCurr]).style.transform = "scale(2)";
      bgCurr = bgNext;
    });

  }

}

// C
const cards = document.querySelector(".hero-cards")!;
cards?.addEventListener("click", function(event){

  if(!(event.target instanceof HTMLElement)) return;

  const clickedCard = event.target.closest(".hero-card");
  const cardNo = Array.from(cards.children).findIndex(card => card === clickedCard);
  
  slider.jumpToSlide(cardNo);
  slider.pause();

});

document.addEventListener("scroll", _ => {

  const clientHeight = document.documentElement.clientHeight;
  const offsetY = window.pageYOffset;
  const socials = document.getElementsByClassName("hero-socials")[0];

  if(!(socials instanceof HTMLElement)) return;

  socials.style.transition = "opacity .35s";

  socials.style.opacity = 0.35 < offsetY/clientHeight ? "0" : "1";

});


export {}