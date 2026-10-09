import type { Adapter } from "./types.js";
import { indeed } from "./indeed.js";
import { linkedin } from "./linkedin.js";
import { google } from "./google.js";

export const adapters: Adapter[] = [indeed, linkedin, google];
export const pickAdapter = (url: URL): Adapter | undefined => adapters.find((a) => a.matches(url));
