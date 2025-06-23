{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
    deno_1_41_3.url = "github:NixOS/nixpkgs/080a4a27f206d07724b88da096e27ef63401a504";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      deno_1_41_3,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        deno = deno_1_41_3.legacyPackages.${system}.deno;
      in
      {
        devShells.default = pkgs.mkShellNoCC {
          packages = [
            deno
          ];
        };
      }
    );
}
