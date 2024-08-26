<script setup>
import { ref } from "vue";

import LanguageMeta from "../../text-map/meta.json";
import { watch } from "vue";

const queryMode = ref(0);
watch(queryMode, () => {
  result_display.value = {};
});
const font = ref("原神");
const is_translate = ref(false);
const queryString = ref("虚空终端");
const queryLanguage = ref("CHS");
const queryTranslateLanguage = ref(["EN"]);
const result = ref();
const result_display = ref({});
const querying = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
function reduceResult(current, size) {
  result_display.value = result.value.texts.slice(
    (current - 1) * size,
    current * size
  );
}

function changeFont() {
  if (font.value == "原神") {
    font.value = "崩坏：星穹铁道";
    document.documentElement.dataset.font = "HSR";
  } else {
    font.value = "原神";
    document.documentElement.dataset.font = "Genshin";
  }
}

function query() {
  querying.value = true;
  Snackbar.loading("查询中...");
  const api_host =
    queryMode.value == 0
      ? "http://localhost:52102/server/query-base/"
      : "http://localhost:52102/server/";
  const url = new URL(api_host);
  url.searchParams.append("q", queryString.value);
  url.searchParams.append("lang", JSON.stringify(queryLanguage.value));
  if (is_translate.value) {
    url.searchParams.append("translate-mode", "true");
    url.searchParams.append(
      "translate",
      JSON.stringify(queryTranslateLanguage.value)
    );
  }
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      result.value = data;
      currentPage.value = 1;
      reduceResult(currentPage.value, pageSize.value);
      querying.value = false;
      Snackbar.success("查询成功");
    })
    .catch((err) => {
      Snackbar.error("查询失败");
      console.log(err);
      querying.value = false;
    });
}
</script>

<template>
  <h1>原神文本速查速译</h1>
  <h3>
    <span class="title-highlight-character">G</span>enshin Impact
    <span class="title-highlight-character">T</span>ext
    <span class="title-highlight-character">Q</span>uick
    <span class="title-highlight-character">R</span>eference &
    <span class="title-highlight-character">T</span>ranslate
  </h3>
  <var-tabs v-model:active="queryMode" style="margin-top: 20px">
    <var-tab>主要文本查询</var-tab>
    <var-tab>完整文本查询</var-tab>
  </var-tabs>
  <var-button @click="changeFont()">设置字体 当前为{{ font }}字体</var-button>
  <var-input v-model="queryString" placeholder="请输入关键词"></var-input>
  <div v-if="queryMode == 0">
    <var-button block :loading="querying" @click="query()">查找</var-button>
    <var-pagination
      v-model:current="currentPage"
      v-model:size="pageSize"
      :total="result?.number ? result.number : 0"
      :show-total="(total) => `共 ${total} 条`"
      @change="reduceResult"
    />
    <div>
      <var-cell v-for="text in result_display" border>
        <h1>EN - {{ text.en }}</h1>
        <h1>
          JA -
          <ruby>
            {{ text.ja }}<rt>{{ text.pronunciationJa }}</rt>
          </ruby>
        </h1>
        <h1>zhCN - {{ text.zhCN }}</h1>
      </var-cell>
    </div>
  </div>
  <div v-else>
    <p>注：内容来自于解包文件，更新至 4.8</p>
    <var-input v-model="queryString" placeholder="请输入关键词"></var-input>
    <var-select v-model="queryLanguage" placeholder="请选择查询语言">
      <var-option
        v-for="item in LanguageMeta"
        :key="item.lang"
        :value="item.lang"
        :label="item.name"
      ></var-option>
    </var-select>
    <var-select
      v-model="queryTranslateLanguage"
      chip
      multiple
      :disabled="!is_translate"
      placeholder="要翻译的语言"
    >
      <var-option
        v-for="item in LanguageMeta"
        :key="item.lang"
        :value="item.lang"
        :label="item.name"
      ></var-option>
    </var-select>
    <var-divider></var-divider>
    <var-checkbox disabled>正则表达式(后续版本支持)</var-checkbox>
    <var-checkbox v-model="is_translate">翻译模式</var-checkbox>
    <var-button block :loading="querying" @click="query()">查找</var-button>
    <div>耗时 {{ result?.time ? result.time : 0 }} 毫秒</div>
    <var-pagination
      v-model:current="currentPage"
      v-model:size="pageSize"
      :total="result?.number ? result.number : 0"
      :show-total="(total) => `共 ${total} 条`"
      @change="reduceResult"
    />
    <div style="background-color: #5a6171">
      <var-cell v-for="item in result_display" :key="item.id" border>
        <div id="result-text">
          <div id="query-text" style="color: #fff">
            <var-badge :value="item.text.languageName"></var-badge>
            <div v-html="item.text.text"></div>
            <var-badge
              v-if="
                item.text.languageName == '简体中文' &&
                item.text.text.includes('test')
              "
              value="提示：该文本可能为测试文本。不会在游戏实机出现，但是它确实存在于游戏文件内。"
              type="warning"
            ></var-badge>
          </div>
          <div id="translate-text" v-if="is_translate">
            <div v-for="language of item.translation" style="color: #fff">
              <var-badge :value="language.languageName"></var-badge>
              <div
                v-if="!(language.text == '~~NOTEXT~~')"
                v-html="language.text"
              ></div>
              <var-badge
                v-if="language.text == '~~NOTEXT~~'"
                value="该语言中没有这个文本"
                type="warning"
              ></var-badge>
            </div>
          </div>
        </div>
      </var-cell>
    </div>
  </div>
</template>

<style scoped>
#result-text {
  display: flex;
  flex-direction: row;
  height: 100%;
  gap: 20px;
}

#query-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;

  div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
  }
}

#translate-text {
  flex: 2;
  display: flex;
  flex-direction: row;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;

  div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
  }
}

.title-highlight-character {
  color: var(--color-primary);
}
</style>
