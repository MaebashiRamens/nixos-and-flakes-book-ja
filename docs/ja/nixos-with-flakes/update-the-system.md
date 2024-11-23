# システムのアップデート

Flakesを使う場合、システムのアップデートは簡単です。
単に次のコマンドを、`/etc/nixos`または設定を保存している他のディレクトリで実行するだけです。

```shell
# flake.lock のアップデート
nix flake update

# または、home-managerのような特定のインプットのみの置き換え
nix flake update home-manager

# アップデートの適用
sudo nixos-rebuild switch --flake .

# または、flake.lockのアップデートと適用を一つのコマンドで行うこともできます。（一つ前に"nix flake update"を実行するのと同じ）
sudo nixos-rebuild switch --recreate-lock-file --flake .
```

`nixos-rebuild switch`を実行した際、"sha256 mismatch"エラーに遭遇するかもしれません。
このエラーは`nix flake update`コマンドを実行し、`flake.lock`を更新することで解消することができます。
