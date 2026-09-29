# Malfilter

Malfilter is small security script in the form of CLI to search and determine if packages are safe or not.

## Usage

```sh
./index.ts <pkg name>
```

### Flags

`--install`/`-i`: Install Package after determining if it's safe
`--range <range>`/`-r <range>`: Determine the size of the search to increase discovery. (Consumes more data)

### Conclusion

This script is a highly stripped down variant of [MAGI](https://magi.grishmadev.workers.dev) - A security based revenue project that's being developed privately.
If this is of interest to you, would recommend checking it out!
