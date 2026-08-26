const fs = require("node:fs");
const path = require("node:path");

const apiBaseUrl = process.env.CREDIT_API_BASE_URL || "http://10.0.2.2:8080";
const target = path.join(__dirname, "..", "src", "shared", "config", "generated.env.js");
const body = `export const generatedConfig = ${JSON.stringify({ apiBaseUrl }, null, 2)};\n`;

fs.writeFileSync(target, body);
console.log(`Mobile API base URL: ${apiBaseUrl}`);

