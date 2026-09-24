import * as digi from "digicomponents"
import type { Component } from "vue"

import EventLayout from "./templates/EventLayout.vue"

// Every Digi* export that is a Vue component. The manifest generator (M1) will replace this with a generated list.
export const components: Record<string, Component> = Object.fromEntries(
  Object.entries(digi).filter(
    ([name, value]) =>
      name.startsWith("Digi") && value !== null && (typeof value === "object" || typeof value === "function"),
  ),
) as Record<string, Component>

export const templates: Record<string, Component> = {
  EventLayout,
}
