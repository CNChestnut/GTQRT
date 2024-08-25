import express from "express";
import path from 'path'
const __dirname = import.meta.dirname
import cors from "cors";
import Query from "./query.mjs";
import { _log } from "./core.mjs";

const app = express();
app.use(cors());

const query = new Query(["CHS", "EN"]);
const languageMap = {
  CHS: "简体中文",
  CHT: "繁體中文",
  DE: "Deutsch",
  EN: "English",
  ES: "Español",
  FR: "Français",
  ID: "Bahasa Indonesia",
  IT: "Italiano",
  JP: "日本語",
  KR: "한국어",
  PT: "Português",
  RU: "Русский",
  TH: "ไทย",
  TR: "Türkçe",
  VI: "Tiếng Việt",
};

const server = app.listen(52102, () => {
  console.log(`

  原神文本速查速译工具
  Genshin Impact Text Quick Reference & Translator Tool

  服务已启动，请访问 http://localhost:52102/ 使用。
  同时其他设备也可以使用 http://[你的IP]:52102/ 访问。
    
`);
});

app.use('/', express.static(path.resolve(__dirname, '../dist')))

app.get("/server/", (req, res) => {
  const start = new Date().getTime();
  const queryString = req.query.q;
  const queryLanguage = [JSON.parse(req.query.lang)];
  let translateLanguage
  if (req.query['translate-mode']) {
    translateLanguage = JSON.parse(req.query.translate);
  }
  else{
    translateLanguage = []
  }
  const allLanguage = queryLanguage.concat(translateLanguage);
  for (let language of allLanguage) {
    query.load(language);
  }
  const keys = query.searchString(queryString, queryLanguage);
  let texts = [];
  keys.forEach((key) => {
    let text = {
        languageName: languageMap[queryLanguage[0]],
        text:query.getStringByKey(key, queryLanguage)
    };
    let translation = {};
    for (let language of translateLanguage) {
      translation[language] = {
        languageName: languageMap[language],
        text:query.getStringByKey(key, language)
    };
    }
    texts.push({
      id: key,
      text,
      translation,
    });
  });
  res.send({
    number: keys.length,
    texts: texts,
    time: new Date().getTime() - start,
  });
  _log("LOG - main.mjs", "Response sent, length: " + keys.length);
});
