<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setAppLocale, type AppLocale } from '@/i18n'

const { locale } = useI18n()

function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value as AppLocale
  setAppLocale(v)
  locale.value = v
}
</script>

<template>
  <label class="lang-switch">
    <span class="sr-only">Language</span>
    <select :value="locale" class="lang-select" @change="onChange">
      <option value="zh-CN">中文</option>
      <option value="en-US">English</option>
    </select>
  </label>
</template>

<style scoped>
.lang-switch {
  display: block;
  margin-bottom: 12px;
}
.lang-select {
  width: 100%;
  background: #0f1419;
  border: 1px solid #243044;
  color: #c5d0de;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  cursor: pointer;
}
.lang-select:focus {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
