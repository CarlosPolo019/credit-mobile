const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const keystorePath = path.join(__dirname, "..", "android", "app", "debug.keystore");

if (fs.existsSync(keystorePath)) {
  process.exit(0);
}

const result = spawnSync(
  "keytool",
  [
    "-genkeypair",
    "-v",
    "-storetype",
    "PKCS12",
    "-keystore",
    keystorePath,
    "-storepass",
    "android",
    "-alias",
    "androiddebugkey",
    "-keypass",
    "android",
    "-keyalg",
    "RSA",
    "-keysize",
    "2048",
    "-validity",
    "10000",
    "-dname",
    "CN=Android Debug,O=Android,C=US",
  ],
  { stdio: "inherit" },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

