# パッケージをアップ(ダウン)グレードする

Flakesを使用していると、バグを特定したり互換性の問題に対処したりするために
特定のパッケージをアップ(ダウン)グレードしたいことがあります。
Flakesにおいては、パッケージのバージョンとハッシュ値はそのflake inputのgit commitに直接結びついています。
パッケージのバージョンを変更するには、flake inputのgit commitをロックする必要があります。

こちらの例は複数のnipkgs inputを指定し、それぞれで異なるgit commitやブランチを使う設定です:

```nix{8-13,19-20,27-44}
{
  description = "NixOS configuration of Ryan Yin";

  inputs = {
    # Default to the nixos-unstable branch
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    # Latest stable branch of nixpkgs, used for version rollback
    # The current latest version is 24.11
    nixpkgs-stable.url = "github:nixos/nixpkgs/nixos-25.11";

    # You can also use a specific git commit hash to lock the version
    nixpkgs-fd40cef8d.url = "github:nixos/nixpkgs/fd40cef8d797670e203a27a91e4b8e6decf0b90c";
  };

  outputs = inputs@{
    self,
    nixpkgs,
    nixpkgs-stable,
    nixpkgs-fd40cef8d,
    ...
  }: {
    nixosConfigurations = {
      my-nixos = nixpkgs.lib.nixosSystem rec {
        system = "x86_64-linux";

        # The `specialArgs` parameter passes the
        # non-default nixpkgs instances to other nix modules
        specialArgs = {
          # To use packages from nixpkgs-stable,
          # we configure some parameters for it first
          pkgs-stable = import nixpkgs-stable {
            # Refer to the `system` parameter from
            # the outer scope recursively
            inherit system;
            # To use Chrome, we need to allow the
            # installation of non-free software.
            config.allowUnfree = true;
          };
          pkgs-fd40cef8d = import nixpkgs-fd40cef8d {
            inherit system;
            config.allowUnfree = true;
          };
        };

        modules = [
          ./hosts/my-nixos

          # Omit other configurations...
        ];
      };
    };
  };
}
```

上記の例では、複数のnixpkgs inputをそれぞれ`nixpkgs`、`nixpkgs-stable`、`nixpkgs-fd40cef8d`として定義しました。
それぞれのinputは異なるcommitやbranchに対応しています。

その後、サブモジュール`pkgs-stable`や`pkgs-fd40cef8d`のパッケージを参照します。
Next, you can refer to the packages from `pkgs-stable` or `pkgs-fd40cef8d` within your
submodule. Here's an example of a Home Manager submodule:

```nix{4-7,13,25}
{
  pkgs,
  config,
  # Nix will search for and inject this parameter
  # from `specialArgs` in `flake.nix`
  pkgs-stable,
  # pkgs-fd40cef8d,
  ...
}:

{
  # Use packages from `pkgs-stable` instead of `pkgs`
  home.packages = with pkgs-stable; [
    firefox-wayland

    # Chrome Wayland support was broken on the nixos-unstable branch,
    # so we fallback to the stable branch for now.
    # Reference: https://github.com/swaywm/sway/issues/7562
    google-chrome
  ];

  programs.vscode = {
    enable = true;
    # Refer to vscode from `pkgs-stable` instead of `pkgs`
    package = pkgs-stable.vscode;
  };
}
```

## Overlaysを用いてパッケージバージョンを固定する

上記の方法はアプリケーションのパッケージには最適ですが、ときにはそれらのアプリケーションが用いるライブラリのバージョンを固定したいということもあるでしょう。
そんなときには[Overlays](../nixpkgs/overlays.md)が威力を発揮します。
Overlaysを用いると任意のパッケージの属性を変更したり書き換えたりできますが、今回は特定のパッケージのバージョンを書き換えるだけとします。
この方法の最大のデメリットはNixがそれに依存するパッケージを全てリコンパイルしてしまうことですが、それがむしろ特定のバグの解決につながることもあるでしょう。

```nix
# overlays/mesa.nix
{ config, pkgs, lib, pkgs-fd40cef8d, ... }:
{
  nixpkgs.overlays = [
    # Overlay: Use `self` and `super` to express
    # the inheritance relationship
    (self: super: {
      mesa = pkgs-fd40cef8d.mesa;
    })
  ];
}
```

## 新しい設定を適用する

以下に示されているように設定を調整すると、`sudo nixos-rebuild switch`を用いて新しいシステムをデプロイできます。
こうすることで、Firefox/Chrome/VSCodeのバージョンを`nixpkgs-stable`から`nixpkgs-fd40cef8d`にダウングレードします。

> According to
> [1000 instances of nixpkgs](https://discourse.nixos.org/t/1000-instances-of-nixpkgs/17347),
> it's not a good practice to use `import` in submodules or subflakes to customize
> `nixpkgs`. Each `import` creates a new instance of nixpkgs, which increases build time
> and memory usage as the configuration grows. To avoid this problem, we create all
> nixpkgs instances in `flake.nix`.
