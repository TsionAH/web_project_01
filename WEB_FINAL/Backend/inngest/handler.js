import { serve } from "inngest/express";
import { inngest } from "./inngest.js";
import { functions } from "./inngest.js";

export const inngestHandler = serve({
  client: inngest,
  functions,
});