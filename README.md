# YAML to JSON
[![CI][ci-badge]][ci-workflow]

Utility script for converting YAML files to JSON.

## Installation
```sh
npm i --save-dev @serkonda7/yaml2json
```

## Usage
```
yaml2json [flags] <file.yml> [file2.yml ...]

-o, --out      Specify a custom output dir. Default is ./out/
-p, --pretty   Json files will have an indentation of 2. By default the output is minimized.
```

<!-- LINKS -->
[ci-badge]: https://github.com/serkonda7/yaml2json/actions/workflows/ci.yml/badge.svg
[ci-workflow]: https://github.com/serkonda7/yaml2json/actions/workflows/ci.yml
