# まえがき

## NixOS初学者の苦しみ - ドキュメントとFlakes

NixOSはNixパッケージマネージャーのもとで構築された非常に特徴的なLinuxディストリビューションであり、
これまでのUbuntuやCentOS、Arch Linux等の伝統的なディストリビューションとは一線を画す哲学的デザインに基づいています。

他のディストリビューションに対するNixOSの大きな利点の1つはその再現性の高さと宣言的記述にあり、
複数のデバイスを跨いで一貫した環境を複製することができます。

NixOSは確実に強力ですが、この大きな力には複雑さの増大という犠牲が伴います。この犠牲は初学者には非常に困難なものになります。
そのうちの1つが他のLinuxディストリビューションの知識をNixOSに活用するのが難しいということです。
また、公式やコミュニティのドキュメントが分散していたり古くなっていたりすることがあります。
こういった問題はNixOSの初心者に大きな壁として立ちはだかります。

それ以外にも、Flakesと呼ばれるNixパッケージマネージャーの実験的な機能に関連したトラブルも見られます。
npmやCargoといったパッケージマネージャーに触発され、Flakesは`flake.nix`と呼ばれるファイルに
全ての外部の依存関係を記録し`flake.lock`でバージョンを固定します。
これらはNixパッケージマネージャーとNixOSの再現性と可用性(composability)を高めます。

Flakeはその利点によってコミュニティで広く使われるようになりました。
公式の調査によると、新たにGitHubに作成されるNixのリポジトリの過半数がFlakesを利用しています。

しかし、残念ながら安定性を維持するために公式のドキュメントはFlakesに関する内容にごく僅かに言及しているのみです。
このことは多くのNix/NixOSユーザーが混乱してしまいました。
多くの人がFlakesを使っており、自分もそれを学びたいのにどこから始めたら良いのかわからないのです。
散らばった情報をパズルのように繋ぎ合わせたり、Nixpkgsのソースコードを検索したり、
経験豊富なユーザーに助けを求めなければなりませんでした。

## この本の原点

この本の原点は私は最初にNixOSを使い始めたときに書いていた散らばったメモまで遡ります。

私がNixOSに入門した今年(2023)の4月、Nixの哲学とデザインに感銘を受けました。
友人が勧めるままに私はNixの実験的な機能であるFlakesを学びました。
Flakesと旧来のNixOSの設定方法を比較したとき、前者がまさに求めているものだと気づきました。
その結果私は伝統的なアプローチを完全に無視して、最初の段階でFlakesを用いてNixOSのシステムを構築する方法を学びました。

この学習を経て、初心者に優しいFlakesに関するガイドが殆ど存在しないこに気づきました。
多くのドキュメントは伝統的なNixの設定にのみ焦点を当てており、当時の私はNixOS Wiki、Zero to Nix、
Nixpkgs Manual、Nixpkgsのソースコードなどから、旧来の設定に関する情報を無視しながら必要な情報のみを探し出す必要がありました。
この学習の道のりはあまりにも複雑で苦痛でした。
今後また躓かないよう、作業を進めるにつれて分散したメモを必死に文書化するようになりました。

いくらかの経験を経た今年(2023)の5月のはじめ、私はメインPCをNixOSに切り替えました。
NixOS入門者向けのメモを整理した後、それを私のブログ[^1]にアップロードし中国のコミュニティで共有しました。
そこでの好感触な反応とアドバイスをもとに、その記事を英語に翻訳してRedditで共有し大きな反響を頂きました[^2]。

共有したドキュメントが好感触に受け入れられたことが私の原動力となり、更に改善をし続けました。
継続的なアップデートにより、ドキュメントの内容は20,000語を突破しました。
数名の読者がこのドキュメントの体験を更に改善できるのではないかと提案[^3]し、私はそれに導かれました。
結果として私は今までの記事をGitHub上のリポジトリに移動し、専用のドキュメントサイトを立ち上げ、
個人的なメモではなく初学者向けのガイドとなるように更に調整を加えました。

そしてこの多言語対応なオープンソースの本が生まれました。"<NixOS & Flakes Book>"と命名されたこの本は中国語で"NixOS & Flakes 新手指南" ("NixOS & Flakes Beginner's Guide")と命名されました。

このオープンソースの本の内容は、私が更にNixOSを使ったり読者と交流を持っていくなかで少しずつ進化していきました。
読んでくださる方々からのポジティブな感想は、このドキュメントの更新のモチベーションになります。
何人かの読者からの感想はまさにこの本の「進化」に役立ちました。
最初はただNixOSでの体験を気軽に共有したかっただけでしたが、なんとオープンソースの本にまで成長しました。
海外の読者数は私の国での数を大きく上回り、予想だにしなかった多くの数のstarをいただくことができました。

この本に貢献してくださったり提案をくださった全ての友人に感謝を申し上げます。
さらに、支援と励ましをくださった全ての読者に深く感謝します。
彼らがいなければこの本の内容は私の個人ブログに留まり、現在の形になることはなかったでしょう。

## この本の特徴

1. NixOSとFlakesに焦点を当て、旧来のNixのアプローチを無視しています。
2. 初心者に優しく、Linuxやプログラミングをある程度使ったことのあるNixOS初学者の視点から説明しています。
3. 段階的に進めていく学習方式を採用しています。
4. 本書のほとんどの章には末尾に参考リンクを記載しており、読者がトピックをより深く掘り下げたり、内容の信頼性を評価しやすくなっています。
5. 内容に一貫性があり、よく整理された構成になっています。読者は本書を順を追って読み進めることも、必要な情報をすばやく見つけることもできます。

## 寄付

もしこの本があなたのお役に立てたなら、さらなる更新と維持のために寄付をしていただけると幸いです。

- GitHub: <https://github.com/sponsors/ryan4yin>
- Patreon: <https://patreon.com/ryan4yin>
- Buy me a coffee: <https://buymeacoffee.com/ryan4yin>
- 爱发电: <https://afdian.com/a/ryan4yin>
- Ethereum: `0xB74Aa43C280cDc8d8236952400bF6427E4390855`

## フィードバックとディスカッション

私はNixOSのエキスパートではなく2024年2月の時点でNixOSを9ヶ月程度しか使ってないので、
何かしらの誤解や複雑な事例が含まれているかもしれません。
なにか間違っていることや質問/提案を発見したら、是非issueを開いたり
[ディスカッションに参加](https://github.com/ryan4yin/nixos-and-flakes-book/discussions)したりして私に知らせてください。
この本を今後も改善し続けたいと考えています。

この小さな本を書き始めた理由は、当時はコミュニティの誰も初学者の私に代わって書いてくれる人がいなかったためです。
間違いを犯す可能性があったとしても、何もしないよりは遥かに良いことだと考えています。

この本がより多くの人の助けとなり、NixOSを楽しんでいただくことを心から願っています。
気に入っていただければ幸いです。

## この本に関するフィードバックとディスカッションの歴史

英語でのフィードバックと関連するディスカッション:

- [[2023-05-11] NixOS & Nix Flakes - A Guide for Beginners - Reddit](https://www.reddit.com/r/NixOS/comments/13dxw9d/nixos_nix_flakes_a_guide_for_beginners/)
- [[2023-06-22] Updates: NixOS & Nix Flakes - A Guide for Beginners - Reddit](https://www.reddit.com/r/NixOS/comments/14fvz1q/updates_nixos_nix_flakes_a_guide_for_beginners/)
- [[2023-06-24] An unofficial NixOS & Flakes book for beginners - Discourse](https://discourse.nixos.org/t/an-unofficial-nixos-flakes-book-for-beginners/29561)
- [[2023-07-06] This isn't an issue but it has to be said: - Discussions](https://github.com/ryan4yin/nixos-and-flakes-book/discussions/43)

中国語のフィードバックとディスカッション:

- [[2023-05-09] NixOS 与 Nix Flakes 新手入门 - v2ex 社区](https://www.v2ex.com/t/938569#reply45)
- [[2023-06-24] NixOS 与 Flakes | 一份非官方的新手指南 - v2ex 社区](https://www.v2ex.com/t/951190#reply9)
- [[2023-06-24] NixOS 与 Flakes | 一份非官方的新手指南 - 0xffff 社区](https://0xffff.one/d/1547-nixos-yu-flakes-yi-fen-fei-guan)

[^1]:
    [NixOS & Nix Flakes - A Guide for Beginners - This Cute World](https://thiscute.world/en/posts/nixos-and-flake-basics/)

[^2]:
    [NixOS & Nix Flakes - A Guide for Beginners - Reddit](https://www.reddit.com/r/NixOS/comments/13dxw9d/nixos_nix_flakes_a_guide_for_beginners/)

[^3]:
    [Updates: NixOS & Nix Flakes - A Guide for Beginners - Reddit](https://www.reddit.com/r/NixOS/comments/14fvz1q/comment/jp4xhj3/?context=3)
