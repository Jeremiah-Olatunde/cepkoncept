"use strict";

// IMPORT ALL COMPONENT ROOT SCRIPTS
import "./**/index.ts";

import { Slider } from "~/src/scripts/slider";


const slider = new Slider("projects-slider", {
  focusPosition: "start",
  animConfig: { duration: .5, easing: [.767, .01, .18, 1.01] }
});

export {}