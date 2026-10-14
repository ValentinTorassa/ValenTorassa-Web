#!/usr/bin/env node
// `npm audit` with a dated allowlist, for advisories that have no fix short of
// a major upgrade (or no fix at all). npm audit itself cannot ignore one.
//
// Runs `npm audit --json` in the current directory (it reads package-lock.json
// and installs nothing) and exits 1 on any advisory at or above the audit
// level that .github/npm-audit-allowlist.json does not name. Allowlisted ones
// are printed as warnings so they stay visible in every run.
//
//   node .github/scripts/npm-audit.mjs [--audit-level=high]
//
// Allowlist entries need all four fields:
//   {"id": "GHSA-xxxx-xxxx-xxxx", "package": "name", "added": "YYYY-MM-DD",
//    "reason": "why it is not fixed and why that is acceptable for now"}
// An entry that matches nothing in any directory of this run is reported, so
// it can be removed once the dependency moves on.
//
// No dependencies: Node's standard library only.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LEVELS = ["info", "low", "moderate", "high", "critical"];
const levelArg = process.argv.find((a) => a.startsWith("--audit-level="));
const level = levelArg ? levelArg.split("=")[1] : "high";
if (!LEVELS.includes(level)) {
  console.error(`::error::Unknown audit level "${level}"`);
  process.exit(2);
}
const threshold = LEVELS.indexOf(level);

const allowlistPath = join(dirname(fileURLToPath(import.meta.url)), "..", "npm-audit-allowlist.json");
let allow = [];
try {
  allow = JSON.parse(readFileSync(allowlistPath, "utf8")).allow ?? [];
} catch (err) {
  if (err.code !== "ENOENT") {
    console.error(`::error::Cannot read ${allowlistPath}: ${err.message}`);
    process.exit(2);
  }
}
for (const entry of allow) {
  const missing = ["id", "package", "added", "reason"].filter((k) => !entry[k]);
  if (missing.length || !/^\d{4}-\d{2}-\d{2}$/.test(entry.added)) {
    console.error(`::error::Allowlist entry ${JSON.stringify(entry)} needs id, package, added (YYYY-MM-DD) and reason`);
    process.exit(2);
  }
}
const allowed = new Map(allow.map((e) => [e.id, e]));

const run = spawnSync("npm", ["audit", "--json"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
let report;
try {
  report = JSON.parse(run.stdout);
} catch {
  console.error(`::error::npm audit did not return JSON (exit ${run.status})`);
  console.error(run.stderr || run.stdout);
  process.exit(2);
}
if (report.error) {
  console.error(`::error::npm audit failed: ${report.error.summary ?? JSON.stringify(report.error)}`);
  process.exit(2);
}

// Advisories are the `via` objects; a string `via` only points at another
// vulnerable package, whose advisories are listed under that package.
const advisories = new Map();
for (const vuln of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vuln.via) {
    if (typeof via !== "object") continue;
    const id = via.url?.split("/").pop() || String(via.source);
    if (!advisories.has(id)) advisories.set(id, { ...via, id, affects: new Set() });
    advisories.get(id).affects.add(vuln.name);
  }
}

const blocking = [];
for (const adv of advisories.values()) {
  if (LEVELS.indexOf(adv.severity) < threshold) continue;
  const entry = allowed.get(adv.id);
  const line = `${adv.severity} ${adv.name} ${adv.range}: ${adv.title} (${adv.url ?? adv.id})`;
  if (entry) {
    console.log(`::warning title=Allowlisted ${adv.id}::${line}. Allowlisted ${entry.added}: ${entry.reason}`);
  } else {
    blocking.push(line);
  }
}

const unused = allow.filter((e) => !advisories.has(e.id));
for (const e of unused) {
  console.log(`::notice title=Allowlist entry not seen here::${e.id} (${e.package}) is not reported in ${process.cwd()}; remove it if no other directory needs it.`);
}

const counts = report.metadata?.vulnerabilities ?? {};
console.log(`npm audit in ${process.cwd()}: ${JSON.stringify(counts)}`);
if (blocking.length) {
  for (const line of blocking) console.log(`::error::${line}`);
  console.log(`${blocking.length} advisory(ies) at or above "${level}" are not in the allowlist.`);
  process.exit(1);
}
console.log(`No advisory at or above "${level}" outside the allowlist.`);
