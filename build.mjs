import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const __dirname = import.meta.dirname;

execSync("pnpm run front-build", { pwd: __dirname });
// fs.copyFileSync(path.join(__dirname, './package.json'), path.join(__dirname, './build/temp/server/package.json'));
// execSync('npm install', { cwd: path.join(__dirname, './build/temp/server') });
fs.cpSync(
  path.join(__dirname, "./server"),
  path.join(__dirname, "./build/temp/server/"),
  {
    recursive: true,
  }
);
fs.cpSync(
  path.join(__dirname, "./text-map/"),
  path.join(__dirname, "./build/temp/text-map/"),
  {
    recursive: true,
  }
);
fs.cpSync(
  path.join(__dirname, "./dist/"),
  path.join(__dirname, "./build/temp/dist/"),
  {
    recursive: true,
  }
);
fs.cpSync(
  path.join(__dirname, "./build/pre/node-v20-win-x64.exe"),
  path.join(__dirname, "./build/temp/runtime/node.exe")
);
fs.writeFileSync(
  path.join(__dirname, "./build/temp/start.bat"),
  `
  "./runtime/node.exe" ./server/main.mjs
  start http://localhost:52102
  pause
  `
);

fs.cpSync(
  path.join(__dirname, "./build/temp/"),
  path.join(__dirname, "./build/dist/GTQRT-win-x64-full-withRuntime"),
  {
    recursive: true,
  }
);
