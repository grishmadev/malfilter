# Malfilter

![demo_gif](/assets/malfilter_demo.GIF)

Malfilter is a small security script in the form of CLI to search and determine if packages are safe to install.

## Usage

```sh
malfilter -r 30 -i express
```

## Features

- Detection for Typosquatting
- Package age based Verification
- Popularity based Verification

Dynamically changes threshold based on popularity, package age and name similarity(Levenshtein Distance) with other packages.

### Flags

`--help`: Show available flags like below
`--install`/`-i`: Install Package after determining if it's safe
`--range <range>`/`-r <range>`: Determine the size of the search limit to increase discovery (Consumes more data).
