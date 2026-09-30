# Malfilter

[malfilter_demo.webm](https://github.com/user-attachments/assets/b8779b08-bcaa-446d-b064-e0fe01eb5570)

Malfilter is a small security script in the form of CLI to search and determine if packages are safe to install.

## Installation

- NPM Registry

```sh
npm i malfilter@latest
# or globally by npm i -g malfilter@latest
```

- From Source

```sh
npm i -g https://github.com/grishmadev/malfilter
```

## Usage

```sh
npx malfilter -r 30 -i <pkg name>
# or malfilter -r 30 -i <pkg name> if installed globally
```

## Features

- Detection for Typosquatting
- Package age based Verification
- Popularity based Verification

Dynamically changes threshold based on popularity, package age and name similarity(Levenshtein Distance) with other packages.

### Flags

- `--help`: Show available flags like below
- `--install`/`-i`: Install Package after determining if it's safe
- `--range <range>`/`-r <range>`: Determine the size of the search limit to increase discovery (Consumes more data).
