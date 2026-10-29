// Next's standalone build does not include static files; copy them next to server.js.
import { cpSync, existsSync } from "node:fs";

const out = ".next/standalone";
cpSync(".next/static", `${out}/.next/static`, { recursive: true });
if (existsSync("public")) cpSync("public", `${out}/public`, { recursive: true });
