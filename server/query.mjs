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
      if (language == "BASE") {
        this[language] = JSON.parse(
          fs.readFileSync(
            path.resolve(__dirname, `../text-map/base.json`),
            "utf-8"
          )
        );
      } else {
        this[language] = JSON.parse(
          fs.readFileSync(
            path.resolve(__dirname, `../text-map/TextMap${language}.json`),
            "utf-8"
          )
        );
      }
      _log("LOG - query.mjs", "Loading language: " + language);
    }
  }

  queryBase(string) {
    this.load("BASE");
    let result = [];
    for (let index in this.BASE) {
      if (this.BASE[index]?.["en"]?.includes(string)) {
        result.push(this.BASE[index]);
      } else if (this.BASE[index]?.["ja"]?.includes(string)) {
        result.push(this.BASE[index]);
      } else if (this.BASE[index]?.["zhCN"]?.includes(string)) {
        result.push(this.BASE[index]);
      }
    }
    return result;
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
