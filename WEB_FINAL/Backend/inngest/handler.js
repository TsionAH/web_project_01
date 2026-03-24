import { serve } from "inngest/express";
import { inngest } from "./index.js";
import { functions } from "./index.js";

export const inngestHandler = serve({
  client: inngest,
  functions,
});