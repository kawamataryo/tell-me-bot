import { App } from "@slack/bolt";

export const registerActionOrEvents = (app: App, actionOrEvents: [(app: App) => void, boolean][]) => {
  actionOrEvents.forEach(([actionOrEvent, condition]) => {
    if (condition) {
      actionOrEvent(app);
    }
  });

}
