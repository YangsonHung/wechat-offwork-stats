export type FeedbackState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };
