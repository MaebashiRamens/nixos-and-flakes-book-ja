# その他の便利な豆知識

## 詳細なエラーメッセージを表示する

`nixos-rebuild`のコマンドライン引数に `--show-trace --print-build-logs --verbose`を渡すと
デプロイ中に起きたエラーについて詳細なメッセージを表示させることができます。

```bash
cd /etc/nixos
sudo nixos-rebuild switch --flake .#myhost --show-trace --print-build-logs --verbose

# A more concise version
sudo nixos-rebuild switch --flake .#myhost --show-trace -L -v
```

## 構成をGitで管理する

NixOSの設定ファイルはテキストファイルで構成されているのでGitでの管理に非常に適しています。
バージョン管理を行えば、問題が発生したときに簡単にロールバックできるようになります。

> NOTE: When using Git, Nix ignores all files that are not tracked by Git. If you
> encounter an error in Nix stating that a particular file is not found, it may be because
> you haven't `git add`ed it.

デフォルトではNixOSは設定ファイルを`/etc/nixos`に配置します。
このディレクトリは保護されているのでファイルを変更するにはroot権限が必要ですが、普段遣いをする上では非常に不便です。
ありがたいことにFlakesはこの問題を解決してくれているので、自分の好きな場所にflakeを配置することができます。

例えば、以下のようにflakeを`~/nixos-config`に配置したうえでシンボリックリンクを作成できます:

```shell
sudo mv /etc/nixos /etc/nixos.bak  # Backup the original configuration
sudo ln -s ~/nixos-config /etc/nixos

# Deploy the flake.nix located at the default location (/etc/nixos)
sudo nixos-rebuild switch
```

この方法では`~/nixos-config`以下にある設定をGitで管理できます。
そしてこれらのファイルは通常のユーザー権限で編集できるのでroot権限は不要です。

他にも、`/etc/nixos`ディレクトリを削除して設定ファイルへのパスをデプロイの際に指定する方法もあります:

```shell
sudo mv /etc/nixos /etc/nixos.bak
cd ~/nixos-config

# `--flake .#my-nixos` deploys the flake.nix located in
# the current directory, and the nixosConfiguration's name is `my-nixos`
sudo nixos-rebuild switch --flake .#my-nixos
```

どちらかの自分に適した方法を使いましょう。そうすることでシステムのロールバックはシンプルになります。
ただ単に以前のコミットにswitchしてデプロイするだけになります:

```shell
cd ~/nixos-config
# 1つ前のコミットに切り替える
git checkout HEAD^1
# Deploy the flake.nix located in the current directory,
# with the nixosConfiguration's name `my-nixos`
sudo nixos-rebuild switch --flake .#my-nixos
```

より高度なGitの操作についてはここでは説明しませんが、基本的にはロールバックはGitを用いて直接行うことができます。
しかしシステムが完全にクラッシュしてしまった場合には、ブートローダーから以前のバージョンを起動する必要があるかもしれません。

## 変更履歴の表示と削除

最初の方で示した通り、NixOSの各デプロイはそれぞれ新しいバージョンとして記録され、全ての各バージョンは
システムのブートオプションに追加されています。
コンピュータを再起動する以外にも以下のコマンドで過去のバージョンの一覧を確認できます:

```shell
nix profile history --profile /nix/var/nix/profiles/system
```

過去のバージョン履歴を削除して、ストレージの余白を増やすには以下のコマンドを使用してください:

```shell
# Delete all historical versions older than 7 days
sudo nix profile wipe-history --older-than 7d --profile /nix/var/nix/profiles/system

# Wiping history won't garbage collect the unused packages, you need to run the gc command manually as root:
sudo nix-collect-garbage --delete-old

# Due to the following issue, you need to run the gc command as per user to delete home-manager's historical data:
# https://github.com/NixOS/nix/issues/8508
nix-collect-garbage --delete-old
```

## Why some packages are installed?

To find out why a package is installed, you can use the following command:

1. Enter a shell with `nix-tree` & `rg` available:
   `nix shell nixpkgs#nix-tree nixpkgs#ripgrep`
1. `nix-store --gc --print-roots | rg -v '/proc/' | rg -Po '(?<= -> ).*' | xargs -o nix-tree`
1. `/<package-name>` to find the package you want to check.
1. `w` to show the package is depended by which packages, and the full dependency chain.

## ディスクの使用量を減らす

以下の設定をNixOSに追加することで、ディスクの使用量を減らすことができます:

```nix
{ lib, pkgs, ... }:

{
  # ...

  # Limit the number of generations to keep
  boot.loader.systemd-boot.configurationLimit = 10;
  # boot.loader.grub.configurationLimit = 10;

  # Perform garbage collection weekly to maintain low disk usage
  nix.gc = {
    automatic = true;
    dates = "weekly";
    options = "--delete-older-than 1w";
  };

  # Optimize storage
  # You can also manually optimize the store via:
  #    nix-store --optimise
  # Refer to the following link for more details:
  # https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-auto-optimise-store
  nix.settings.auto-optimise-store = true;
}
```

By incorporating this configuration, you can better manage and optimize the disk usage of
your NixOS system.
