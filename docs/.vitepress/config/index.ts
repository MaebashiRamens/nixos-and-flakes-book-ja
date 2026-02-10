/*
NixOS & Flakes Book 日本語翻訳プロジェクト
この設定ファイルは日本語翻訳プロジェクト用に変更されています。
マージの際にこのファイルを変更しないよう注意してください。
*/

import { defineConfig } from "vitepress"
import { shared } from "./shared"
import { ja } from "./ja"

export default defineConfig({
  ...shared,
  title: "NixOS & Flakes Book",
  rewrites: {
    "ja/:rest*": ":rest*",
  },
  srcExclude: ["en/**/*.md", "zh/**/*.md"],
  locales: {
    root: {
      label: "日本語",
      ...ja,
    },
    en: {
      label: "English",
      link: "https://nixos-and-flakes.thiscute.world/",
    },
    zh: {
      label: "简体中文",
      link: "https://nixos-and-flakes.thiscute.world/zh/",
    },
    pt: {
      label: "Português",
      link: "https://nixos-and-flakes.ieda.me/",
    },
  },
})
