"use strict";

import type { AnimationOptionsWithOverrides, AnimationControls } from "motion";
import { animate } from "motion";

type FocusPosition = "start" | "center" | "end";

export function initializeSlider(
  sliderId: string, 
  {position, animOpts}: {position: FocusPosition, animOpts: AnimationOptionsWithOverrides},
  callback?: ({focus, prev, slider, slideNo}: {
      slideNo: number,
      prev: HTMLElement, 
      focus: HTMLElement, 
      slider: HTMLElement
      animCtrls: AnimationControls
  }) => void
): void {

  // SET UP AND CONFIGURE SLIDER

  const slider = document.querySelector(`[data-slider=${sliderId}]`);

  if(!(slider instanceof HTMLElement)) 
    throw new Error("Slider not found | Slider not a HTMLElement");

  // SET REQUIRED STYLES

  slider.style.overflow = "hidden";
  slider.style.position = "relative";

  const { wrapper } = components(slider);
  wrapper.style.display = "flex";
  wrapper.style.position = "absolute";

  // ADJUST POSITION OF SLIDES WHEN SLIDER DIMENSION CHANGES'
  const observer = new ResizeObserver(_ => slide(slider, position, animOpts));
  Array.from(wrapper.children).forEach(slide => observer.observe(slide));
  observer.observe(slider);
  

  document.querySelector(`[data-left=${sliderId}]`)?.addEventListener("click", () => {
    const {prev, focus} = updateFocus(slider, -1);
    const animCtrls = slide(slider, position, animOpts);
    callback?.({focus, prev, slider, animCtrls, slideNo: slideNo(slider)});
  })

  document.querySelector(`[data-right=${sliderId}]`)?.addEventListener("click", () => {
    const {prev, focus} = updateFocus(slider, 1);
    const animCtrls = slide(slider, position, animOpts);
    callback?.({focus, prev, slider, animCtrls, slideNo: slideNo(slider)});
  })

}

function slide(
  slider: HTMLElement, 
  position: 
  FocusPosition, animOpts: AnimationOptionsWithOverrides
): AnimationControls {

  // ANIMATE THE SLIDE IN FOCUS TO IT'S APPROPRIATE POSITION

  return animate(
    components(slider).wrapper, 
    {x: computeOffset(slider, computeFocusPoint(slider, position))}, 
    animOpts
  );

}

function updateFocus(
  slider: HTMLElement, 
  direction: -1 | 1
): { prev: HTMLElement, focus: HTMLElement} {

  // CHANGES THE SLIDE IN FOCUS CARD BY TOGGLING THE data-focus ATTRIBUTE ON SLIDE ELEMENTS
  // -1 CHANGES SLIDE IN FOCUS TO THE PREVIOUS SIBLING (LEFT) 
  // +1 CHANGES SLIDE IN FOCUS TO THE NEXT SIBLING (RIGHT)
  // RETURNS THE PREVIOUS AND CURRENT FOCUS SLIDES

  const { focus } = components(slider);
  const next = direction < 0 ? focus?.previousElementSibling : focus?.nextElementSibling;

  if(!(next instanceof HTMLElement)) return { prev: focus, focus: focus};

  focus.toggleAttribute("data-focus");
  next.toggleAttribute("data-focus");

  return { prev: focus, focus: next }

}

function computeFocusPoint(
  slider: HTMLElement, 
  postion: FocusPosition
): number {

  // CALCULATES THE COORDINATES OF THE SLIDE IN FOCUS BASED ON CHOSEN POSITION IN THE SLIDER

  const { focus } = components(slider);

  switch(postion){
    case "start": return 0;
    case "center": return (slider.offsetWidth - focus.offsetWidth)/2;
    case "end": return slider.offsetWidth - focus.offsetWidth;
  }

}

function computeOffset(
  slider: HTMLElement,
  targetPoint: number
): number {

  // RETURNS THE DISPLACEMENT OF THE SLIDE IN FOCUS FROM IT'S DESIRED POSITION

  const { focus, wrapper } = components(slider);
  return targetPoint - focus.offsetLeft - wrapper.offsetLeft;

}

function components(slider: HTMLElement): { focus: HTMLElement, wrapper: HTMLElement } {

  // ENSURES THE TYPE AND EXIXSTENCE OF THE WRAPPER AND FOCUC SLIDE OF A SLIDER
  // RETURNS THE WRAPPER AND FOCUS SLIDE OF A SLIDER
  // PERFORMS TYPE NARROWING
  // TODO: CACHE WRAPPER AND FOCUS ELEMENTS TO MAKE REPEATED CALLED MORE EFFICENT

  const wrapper = slider.querySelector("[data-wrapper]");
  const focus = slider.querySelector("[data-focus]");

  if(!(focus instanceof HTMLElement)) throw new Error("Focus not specified");
  if(!(wrapper instanceof HTMLElement)) throw new Error("Wrapper not specified");

  return { wrapper, focus }

}

function slideNo(slider: HTMLElement): number {

  // RETURNS THE SLIDE NUMBER OF THE SLIDE IN FOCUS

  const { wrapper, focus } = components(slider);
  return Array.from(wrapper.children).findIndex(item => item === focus);

}