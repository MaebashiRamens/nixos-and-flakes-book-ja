# Flakes 入門

flakes の実験的な機能は Nix における大きな進展です。flakes は Nix 式の間の依存関係を管理す
るためのポリシーを導入し、再現性、構成可能性、使いやすさを向上させることができます。flakes
はまだ、実験的な機能ですが Nix コミュニティの間で広く使われています。[^1]

Flakes は nix プロジェクト始まって以来最も大きな変化の1つです。[^2]

簡単に説明していきます。もし JavaScript/Go/Rust/Python などの言語の経験があれば
`package.json`/`go.mod`/`Cargo.toml`/`pyproject.toml` のようなファイルに親しみがあるでしょ
う。これらのファイルにはソフトウェアパッケージ間の依存関係とプロジェクトのビルドの仕方が記
述されています。

同様に、このような言語のパッケージマネージャは依存関係のバージョンのロックをし、プロジェク
トの再現性を担保するために `package-lock.json`/`go.sum`/`Cargo.lock`/`poetry.lock` のよう
なファイルを利用します。

Flakes は Nix のエコシステムの再現性、構成可能性、使いやすさを強化するためにこのようなパッ
ケージマネージャから着想を得ました。

Flakes では flake.nix を導入することで、Nix パッケージ間の依存関係やプロジェクトのビルド方
法を記述しています (`package.json` のようなものです) 。さらに、flake.lock を用いて依存する
バージョンをロックし、プロジェクトの再現性を担保しています (`package-lock.json` のようなも
のです) 。

とはいえ、Flakes の実験的な機能は Nix 本来の設計をユーザレベルで壊すものではありません。
Flakes が導入する2つのファイル `flake.nix`/`flake.lock` は、他の Nix の設定の単なるラッ
パーに過ぎません。以降の章では、Flakes を使うことで、より便利な方法で Nix 式間の依存関係を
Nix 本来の設計に基づいて管理できるようになることを見ていきます。

## Flakes における注意事項 <Badge type="danger" text="caution" />

Flakes の利点ははっきりとしていて、Flakes は NixOS コミュニティ全体で受け入れられてきまし
た。現在では、半分以上のユーザが Flakes を活用していて[^3]、Flakes はこれからも活用されて
いくでしょう。

:warning: しかし、**Flakes が未だに実験的な機能** であることは覚えておくべきです。Flakesに
はいくつか問題もあり、安定化の最中に破壊的変更が行われる可能性もあります。このような破壊的
変更の程度は不確かなままです。

特にこの本は NixOS と Flakes を中心として構成されていることもあり、総合的に、私は Flakes
を利用することを強く推奨します。しかし、今後の破壊的変更によって起こりうる潜在的な問題へ備
えることも重要です。

## いつ Flakes は安定するの?

Flakes の詳細についていくらか掘り下げました。

- [[RFC 0136] A Plan to Stabilize Flakes and the New CLI Incrementally](https://github.com/NixOS/rfcs/pull/136):
  Flakes と新しい CLI の段階的な安定化の計画について(マージ済)
- [CLI stabilization effort](https://github.com/NixOS/nix/issues/7701): 新しい CLI の安定
  化の進捗をトラックする Issue
- [Why Are Flakes Still Experimental? - NixOS Discourse](https://discourse.nixos.org/t/why-are-flakes-still-experimental/29317):
  Flakes が未だに実験段階と捉えられている理由についての議論が行われている投稿
- [Flakes Are Such an Obviously Good Thing - Graham Christensen](https://grahamc.com/blog/flakes-are-an-obviously-good-thing/):
  Flakes の設計と開発のプロセスにおける改善できる点を指摘しつつ Flakes の利点を強調してい
  る記事
- [ teaching Nix 3 CLI and Flakes #281 - nix.dev](https://github.com/NixOS/nix.dev/issues/281):
  nix.dev において Nix 3.0 の CLI と Flakes を扱うべきかという Issue で、nix.dev において
  は、不安定な機能について積極的に扱うべきではないという結論になりました。
- [Draft: 1-year Roadmap - NixOS Foundation](https://nixos-foundation.notion.site/1-year-roadmap-0dc5c2ec265a477ea65c549cd5e568a9):
  NixOS Foundation が提供しているロードマップで、Flakes の安定化に関する計画について言及し
  ています。

これらの情報から、Flakes はいくらかの破壊的変更の可能性はありますが、ここ2年以内には安定す
るのではないかと思われます。

## 新しい CLI と 従来の CLI

Nix は 2020年に `nix-command` と `flakes` の2つの実験的な機能を導入しました。これによっ
て、新しい command-line インターフェース (新しい CLI)、標準化された Nix パッケージの構造定
義 (Flakes の機能)、cargo/npm のバージョンをロックするファイルと同様の `flake.lock` のよう
な機能といったものがもたらされています。これらの機能は Nix の潜在能力を大きく引き出すこと
ができ、2024年2月1日時点で実験段階ですが Nix コミュニティの間で広く受け入れられています。

現在の Nix の新しい CLI (`nix-command` の実験的な機能) は Flakes と強く結びついています。
この CLI と Flakes を明示的に切り離そうとする運動もありますが、Flakes を使う際にはどうして
も新しい CLI を使う必要があります。この本は、NixOS と Flakes の入門者向けのガイドであるの
で、Flakes が依存している新しい CLI と従来の CLI との違いについて解説する必要があります。

ここでは、新しい CLI (`nix-command`) と Flakes を使う上で、もはや必要なくなった従来の CLI
について羅列しています。これらのコマンドは、対応する新しい CLI に置き換えることができます
(しかし、`nix-collect-garbage` については現在代用のコマンドはありません):

1. `nix-channel`: apt/yum/pacman のような他のパッケージ管理ツールのように `nix-channel` は
   ソフトウェアパッケージのバージョンを stable/unstable/test チャンネルを用いて管理するこ
   とができます。
   1. Flakes では、`nix-channel` の機能は `flake.nix` の `inputs` セクションで完全に置き換
      えることができます。
2. `nix-env`: `nix-env` は従来の Nix のユーザ環境のソフトウェアパッケージを管理するための
   CLI ツールです。
   1. `nix-channel` によって加えたデータソースからのパッケージのインストールを行います。こ
      の際、パッケージのバージョンはこのチャンネルに影響を受けます。 `nix-env` を用いたイ
      ンストールでは Nix の宣言的な設定に自動的に記録されず、Nix の設定の制御下に置かれな
      いので、他のコンピュータへの複製は大変になります。このことから、このコマンドを直接使
      用することはおすすめしません。
   2. これに対応する新しい CLI のコマンドは `nix profile` です。ですが、個人的には入門者に
      はおすすめしません。
3. `nix-shell`: `nix-shell` は一時的なシェル環境を作り出すことだでき、開発やテストに便利で
   す。
   1. 新しい CLI では、3つのサブコマンド: `nix develop`, `nix shell`, `nix run` に分けられ
      ます。これらのコマンドについては、"[開発環境](../development/intro.md)" の章で議論し
      ていきます。
4. `nix-build`: `nix-build` は Nix パッケージをビルドし、ビルド成果物を `/nix/store` に格
   納します。しかし、このビルド成果物は Nix の宣言的な設定には記録されません。
   1. 新しい CLI では `nix-build` は `nix build` で置き換えられます。
5. `nix-collect-garbage`: ガベージコレクションコマンドは、`/nix/store` 内の使われていない
   ストアオブジェクトを一掃します。
   1. 新しい CLI にも `nix store gc --debug` という似たようなコマンドが存在しますが、この
      コマンドは Nix のプロファイル世代を削除しないので完全な代用のコマンドは現在のところ
      ありません。
6. 他のマイナーなコマンドについてはここでは扱いません。
   1. [nixのコマンドを解説してみる](https://qiita.com/Sumi-Sumi/items/6de9ee7aab10bc0dbead?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en)
      で詳細なコマンドの比較をすることができます。

[^1]: [Flakes - NixOS Wiki](https://wiki.nixos.org/wiki/Flakes)
[^2]:
    [Flakes are such an obviously good thing](https://grahamc.com/blog/flakes-are-an-obviously-good-thing/)

[^3]:
    [Draft: 1 year roadmap - NixOS Foundation](https://web.archive.org/web/20250317120825/https://nixos-foundation.notion.site/1-year-roadmap-0dc5c2ec265a477ea65c549cd5e568a9)
