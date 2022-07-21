
"use strict";

import type { AnimationOptionsWithOverrides, AnimationControls } from "motion";
import { animate } from "motion";

type FocusPosition = "start" | "center" | "end";
interface SlideshowConfig { duration: number }

interface SliderEvent {
  slideNo: number,
  prev: HTMLElement,
  focus: HTMLElement,
  slider: HTMLElement,
  animCtrls: AnimationControls
}

export class Slider {

  private slider: HTMLElement;
  private wrapper: HTMLElement;
  private focus: HTMLElement;

  private focusPosition: FocusPosition;
  private animConfig: AnimationOptionsWithOverrides;
  private slideshowConfig: SlideshowConfig | undefined;

  private slideshowTimer: number = 0;
  private listeners: ((event: SliderEvent) => void)[] = [];

  private playState: "pause" | "play" = "pause";
  private inView: boolean = false;

  constructor(
    private sliderId: string, 
    { focusPosition, animConfig, slideshowConfig }: { 
      focusPosition: FocusPosition,
      slideshowConfig?: SlideshowConfig,
      animConfig: AnimationOptionsWithOverrides, 
    }
   ){

    const { slider, wrapper, focus } = this.initializeSlider(sliderId);

    this.slider = slider;
    this.wrapper = wrapper;
    this.focus = focus;

    this.animConfig = animConfig;
    this.focusPosition = focusPosition;
    this.slideshowConfig = slideshowConfig;

    this.initializeListeners();
    this.initializeObservers();

  }

  private initializeSlider(sliderId: string): { slider: HTMLElement, wrapper: HTMLElement, focus: HTMLElement} {

    // RETRIEVE SLIDER COMPONENTS FROM THE DOM 
    
    const slider = document.querySelector(`[data-slider=${sliderId}]`);
    const wrapper = slider?.querySelector(`[data-wrapper]`);
    const focus = wrapper?.querySelector(`[data-focus]`);

    if(!(focus instanceof HTMLElement)) throw new Error("Focus not specified");
    if(!(wrapper instanceof HTMLElement)) throw new Error("Wrapper not specified");
    if(!(slider instanceof HTMLElement)) throw new Error("Slider not a HTMLElement");

    // SET REQUIRED STYLES
    slider.style.overflow = "hidden";
    slider.style.position = "relative";

    wrapper.style.display = "flex";
    wrapper.style.position = "absolute"; 

    return { slider, wrapper, focus };

  }

  private initializeListeners(): void {

    const left = document.querySelector(`[data-left=${this.sliderId}]`);
    const right = document.querySelector(`[data-right=${this.sliderId}]`);

    left?.addEventListener("click", () => {
      this.jumpToSlide(this.currentSlideNo() - 1);
      this.move();
    })

    right?.addEventListener("click", () => {
      this.jumpToSlide(this.currentSlideNo() + 1);
      this.move();
    })

  }

  private initializeObservers(): void {

    const resize = new ResizeObserver(_ => this.move());
    resize.observe(this.slider);
    Array.from(this.wrapper.children).forEach(slide => resize.observe(slide));

    const intersection = new IntersectionObserver((entries) => {

      this.inView = entries[0].isIntersecting;
      if(this.inView && this.playState == "play") this.beginSlideshow();
      else this.endSlideshow();

    }, { threshold: 1 });

    intersection.observe(this.slider);

  }

  private move(): AnimationControls {

    // ANIMATE THE SLIDE IN FOCUS TO IT'S APPROPRIATE POSITION

    const offset: number = this.computeFocusPoint() - this.focus.offsetLeft - this.wrapper.offsetLeft;
    return animate( this.wrapper, { x: offset }, this.animConfig );

  }

  private changeFocus(index: number): { prev: HTMLElement, focus: HTMLElement } {

    // DO NOT CHANGE FOCUS IF NEW INDEX OUT OF RANGE

    const prevFocus = this.focus; // STORE CURRENT FOCUS AS PREVIOS FOCUS
    const newFocus = this.wrapper.children[index]; // GET NEW FOCUS | NULL IF INDEX OUT OF RANGE

    if(!(newFocus instanceof HTMLElement)) // RETURN IF NEW FOCUS IS NULL
      return { prev: prevFocus, focus: prevFocus };  

    prevFocus.toggleAttribute("data-focus");
    newFocus.toggleAttribute("data-focus");

    this.focus = newFocus;
    return { prev: prevFocus, focus: newFocus };

  }

  private computeFocusPoint(): number {

    // CALCULATES THE COORDINATES OF THE SLIDE IN FOCUS BASED ON CHOSEN POSITION IN THE SLIDER

    switch(this.focusPosition){
      case "start": return 0;
      case "center": return (this.slider.offsetWidth - this.focus.offsetWidth)/2;
      case "end": return this.slider.offsetWidth - this.focus.offsetWidth;
    }    

  }

  public currentSlideNo(): number {
  
    return Array.from(this.wrapper.children).findIndex(item => item === this.focus);
  
  }

  public jumpToSlide(index: number): void {

    const { prev, focus } = this.changeFocus(index);
    const animCtrls = this.move();
    this.listeners.forEach(listener => listener({
      animCtrls,
      prev, focus,
      slider: this.slider,
      slideNo: this.currentSlideNo(),
    }));

  }

  private beginSlideshow(): void {

    if(!this.slideshowConfig) return;

    const slideCount: number = this.wrapper.children.length;

    this.slideshowTimer = setInterval(() => {
      this.jumpToSlide((this.currentSlideNo() + 1) % slideCount);
    }, this.slideshowConfig.duration * 1000);

  }

  private endSlideshow(): void {
    if(!this.slideshowConfig) return;
    clearInterval(this.slideshowTimer);
  }

  public play(): void {

    this.playState = "play";
    if(this.inView) this.beginSlideshow();

  }

  public pause(): void {
    this.playState = "pause";
    this.endSlideshow();
  }

  public on(eventName: "transition", listener: (event: SliderEvent) => void){
   
    eventName;
    this.listeners.push(listener);

  }
  
}