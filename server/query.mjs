import fs from "fs";
import path from "path";
import reduceText from "./text-reduce.mjs";
const __dirname = import.meta.dirname;
import { _log } from "./core.mjs";

class Query {
  constructor(languages) {
    for (let language of languages) {
      this.load(language);
    }
  }

  load(language) {
    if (!this[language]) {
      this[language] = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, `../text-map/TextMap${language}.json`),
          "utf-8"
        )
      );
      _log('LOG - query.mjs','Loading language: ' + language);
    }
  }

  searchString(string, language) {
    if (this[language]) {
      let result = [];
      for (let key of Object.keys(this[language])) {
        if (this[language][key].includes(string)) {
          result.push(key);
        }
      }
      return result;
    } else {
      throw new Error(`Language ${language} not found`);
    }
  }

  getStringByKey(key, language) {
    if (this[language]) {
      return reduceText(this[language][key]);
    } else {
      throw new Error(`Language ${language} not found`);
    }
  }
}

export default Query;
