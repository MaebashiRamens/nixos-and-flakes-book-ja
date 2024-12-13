# 高度なトピック

一度NixOSに慣れてしまえば、さらなるトピックを探してより深いNixエコシステムの世界に飛び込むことができます。これらは知識を更に高めるのに有益ないくつかの情報とコミュニティプロジェクトです:

## コミュニティ

- [Nix Official - Community](https://nixos.org/community/): Nix コミュニティやフォーラム、リアルタイムのチャット、meetups、RFCの情報が公開されています。
- [Nix Channel Status](https://status.nixos.org/): 各Nix channelのビルドステータス。
- [nix-community/NUR](https://github.com/nix-community/NUR): Nixpkgsには非常に多くのパッケージが含まれていますが、レビューの速度やライセンスの問題等によって含まれていないパッケージもあります。NURは誰でも独自に作成して他の人が使えるようにパッケージを追加できる、分散型のNixパッケージリポジトリです。Nixpkgsに無いパッケージを使いたいときはNURで探すことができます。また、NURのREADMEに従えば独自のNixパッケージを他の人と共有することもできます。

## ドキュメントとビデオ

- [Eelco Dolstra - The Purely Functional Software Deployment Model - 2006](https://edolstra.github.io/pubs/phd-thesis.pdf):
  Eelco Dolstra氏によるNixパッケージマネージャーに関する独創的な博士論文。
- [Nix Reference Manual](https://nixos.org/manual/nix/stable/package-management/profiles.html):
  デザインとコマンドラインの使い方もコミコミのNixパッケージマネージャーのガイド。
- [nixpkgs Manual](https://nixos.org/manual/nixpkgs/unstable/): このnixpkgsのマニュアルでは各パラメータの紹介と
  使い方、そして変更やパッケージングの方法を説明しています。
- [NixOS Manual](https://nixos.org/manual/nixos/unstable/): A user manual for NixOS,
  providing configuration instructions for system-level components such as Wayland/X11 and
  GPU.
- [nix-pills](https://nixos.org/guides/nix-pills): "Nix Pills"はNixでソフトウェアのパッケージを構築する手法を
  深く説明しているガイドです。やさしくわかりやすい説明をしてくれています。
- [nixos-in-production](https://github.com/Gabriella439/nixos-in-production): プロダクション環境でNixOSを使用し
  メンテナンスするための手法を説明しているまだ作業中(WIP)の本です。LeanPub上に構築されています。

[NixOS Foundation](https://www.youtube.com/@NixOS-Foundation)と[NixCon](https://www.youtube.com/@NixCon)のYouTubeチャンネルには更に多くの公式ビデオがあります。以下は推奨されるビデオです:

- [Summer of Nix 2022 — Public Lecture Series](https://www.youtube.com/playlist?list=PLt4-_lkyRrOMWyp5G-m_d1wtTcbBaOxZk):
  A series of public lectures hosted by the NixOS Foundation, presented by core members of
  the Nix community such as Eelco Dolstra and Armijn Hemel. The content covers the
  development history of Nix, the history of NixOS, and the future of Nix, among other
  topics.
- [Summer of Nix 2023 — Nix Developer Dialogues](https://www.youtube.com/playlist?list=PLt4-_lkyRrOPcBuz_tjm6ZQb-6rJjU3cf):
  A series of dialogues between core members of the Nix community in 2023. The content
  includes the evolution and architectural challenges of Nixpkgs, exploration of Nix's
  module system, discussion of the Nix ecosystem, AI applications in Nixpkgs, and the
  application of Nix in the commercial field and open source economics.

## 高度なテクニックとコミュニティプロジェクト

Flakesに慣れたなら、更に高度なテクニックとコミュニティプロジェクトを探すのも良いでしょう。以下の人気なものを試してみるのもいいかもしれません:

- [flake-parts](https://github.com/hercules-ci/flake-parts): モジュールシステムを利用して設定の記述とメンテナンスを容易にします
- [flake-utils-plus](https://github.com/gytis-ivaskevicius/flake-utils-plus): Flakeの設定を強化し追加の高度な機能を提供してくれるサードパーティ製のパッケージ

他にも、良質なコミュニティがたくさんあるので覗いてみるのも良いでしょう。いくつかの例はこちら:

- [nix-output-monitor](https://github.com/maralorn/nix-output-monitor): Beautifully
  displays the build progress of Nix packages, with additional information such as build
  time and build log.
- [agenix](https://github.com/ryantm/agenix): A tool for secrets management.
- [colmena](https://github.com/zhaofengli/colmena): Tools for NixOS deployment.
- [nixos-generators](https://github.com/nix-community/nixos-generators): A tool to
  generate ISO/qcow2/... from NixOS configurations.
- [lanzaboote](https://github.com/nix-community/lanzaboote): Enables secure boot for
  NixOS.
- [impermanence](https://github.com/nix-community/impermanence): Helps make NixOS
  stateless and improves system reproducibility.
- [devbox](https://github.com/jetpack-io/devbox): Lightweight, repeatable dev environments
  without container woes, internally powered by nix, similar to earthly.
- [nixpak](https://github.com/nixpak/nixpak): A tool to sandbox all sorts of Nix-packaged
  applications, including graphical ones.
- [nixpacks](https://github.com/railwayapp/nixpacks): Nixpacks takes a source directory
  and produces an OCI compliant image that can be deployed anywhere, similar to
  buildpacks.
- ...

これらのプロジェクトはNixOSでの体験を強化してくれる機能的なツールを提供してくれます。

[awesome-nix](https://github.com/nix-community/awesome-nix)で追加の情報を確認できます。
