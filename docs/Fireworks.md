# Fireworks File Format

Fireworks uses PNGs for its documents, with some extra chunks added.

An example Fireworks PNG contains the following chunks:

| Chunk ID        | Chunk type                  | Description                                                                            |
| --------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| `IHDR`          | PNG header                  | Width, height, basic colour information, etc.                                          |
| `sBIT`          | Bit-depth information       |                                                                                        |
| `pHYs`          | Physical information        | Image resolution (pixels-per-meter)                                                    |
| `tEXt`          | Latin-1 text                | `Creation Time`, written in `m/d/yy` format                                            |
| `tEXt`          | Latin-1 text                | `Software`: `Adobe Fireworks CS4`                                                      |
| **`prVW`\***    | Zlib-compressed preview     | Small low-colour thumbnail image                                                       |
| **`mkBF`\***    | Unknown                     | Unknown short chunk, mostly zeroes                                                     |
| **`mkTS`\***    | Zlib-compressed data        | Contains the image definition                                                          |
| **`mkBS`\***    | Zlib-compressed data        | The same format as `mkTS` but contains an attribution image                            |
| **`mkBT`\*...** | Zlib-compressed[^zlib] tile | Each `mkBT` chunk defines a 128&times;128 ARGB tile, or a 256&times;256 grayscale tile |
| `iTXt`          | International (UTF-8) text  | Key `XML:com.adobe.xmp` with XML content (see below)                                   |
| `IDAT`          | Rasterised image data       | Regular PNG data for the flattened image                                               |
| `IEND`          | End-of-file indicator       |                                                                                        |

Chunks marked with a **\*** are private.

## `mkBT`

[`mkBT`]: #mkbt

Structure:

| Magic value   | Tile Index    | Unused     | Is grayscale? | Unused            | Zlib header | Zlib data | Zlib checksum |
| ------------- | ------------- | ---------- | ------------- | ----------------- | ----------- | --------- | ------------- |
| `FA CE CA FE` | `** ** ** **` | `00 00 00` | `**`          | (`00`) &times; 64 | `78 9C`     | `**` ...  | `** ** ** **` |

Each of these chunks defines a 128&times;128 ARGB tile, or a 256&times;256
grayscale tile. These have a variety of uses (what they are used for depends on
how they are referenced from the `mkTS` and `mkBS` chunks). Typically the
grayscale tiles define textures, and the ARGB tiles define either raw raster
image data, or cached rendering results.

The compressed zlib data contains raw pixel data arranged in the standard
top-to-bottom, left-to-right arrangement. When uncompressed, it is always 65536
bytes.

## `prVW`

Structure:

| Zlib header | Zlib data | Zlib checksum |
| ----------- | --------- | ------------- |
| `78 9C`     | `**` ...  | `** ** ** **` |

After decompressing:

| Magic value   | Width   | Height  | Palette                | End of palette | Unknown  | Image definition     |
| ------------- | ------- | ------- | ---------------------- | -------------- | -------- | -------------------- |
| `CA FE BE EF` | `** **` | `** **` | (`** ** **`) &times; n | `00 00 00`     | `**` ... | (`**`) &times; 16384 |

This chunk contains the small preview image.

The unknown content is possibly uninitialised memory, and does not seem to have
a predictable size. We can find the image data by looking at the last 16384
bytes. This defines a 128&times;128 image (with 1 byte per pixel, each the index
of a colour in the palette). Within this 128&times;128 image, only the top-left
(as defined by the `width` and `height`) contains meaningful data; the rest
appears to again be uninitialised memory.

### `mkBS`

This chunk has the same format as the `mkBT` chunk (explained below), but
contains a static attribution image, regardless of our image's content.

It also appears to use a much older (or at least much simpler) version of the
format.

### `mkTS`

The `mkTS` (and `mkBS`) chunk in a Fireworks PNG contains zlib compressed data,
in the following format:

| Zlib header | Zlib data | Zlib checksum |
| ----------- | --------- | ------------- |
| `78 9C`     | `**` ...  | `** ** ** **` |

Once decompressed, it contains a structured node tree, mostly viewable as plain
ASCII:

```text
MKBv{FRCi{1}XLCi{0}LYLv{LAYv{BKGb{0}}}}
```

This is a bit easier to read with whitespace added (never present in the actual
files):

```text
MKBv{
  FRCi{
    1
  }
  XLCi{
    0
  }
  LYLv{
    LAYv{
      BKGb{
        0
      }
    }
  }
}
```

Each "node" is defined by 4 ASCII letters, where the last indicates the type of
its content (note: the first 3 letters alone are _not_ enough to identifty the
node). This is followed by its content surrounded in `{}` braces. Unlike XML,
it has no concept of attributes (the equivalent structure is achieved via child
nodes).

The node types are:

- `i`: **i**nt: a 32-bit integer, written in base 16 (not base 10!) as an ASCII
  string, for example:

  ```text
  FRCi{7f}
  ```

  Integers are almost always unsigned, with a couple of exceptions.

- `f`: **f**loat: a floating-point value, written in base 10 as an ASCII string
  (may be negative), for example:

  ```text
  XLCf{-10.5}
  ```

- `b`: **b**oolean: a boolean value, either `0` or `1` in ASCII, for example:

  ```text
  BKGb{0}
  ```

- `s`: **s**tring: contains a big-endian 2-byte character length, followed by a
  series of big-endian UTF-16 characters. Note that this structure is still
  surrounded by ASCII `{}` braces, so a full example looks like this:

  |        | Node          | brace | length  | characters          | brace |
  | ------ | ------------- | ----- | ------- | ------------------- | ----- |
  | Binary | `54 52 4E 73` | `7B`  | `00 03` | `01 A4 00 4E 00 47` | `7D`  |
  | ASCII  | `TRNs`        | `{`   | n/a     | n/a                 | `}`   |

- `v`: **v**ector: contains zero or more nested nodes, for example:

  ```text
  MKBv{FRCi{1}XLCi{0}}
  ```

  There are a few different ways the vector node type is used:

  - simple maps: Contain 0 or 1 of each sub-node type. Order does not matter.

  - simple lists: Contain 0 or more of a single sub-node type (or a small set
    of possible sub-node types). Order may or may not matter.

  - simple maps with inline lists: Behave as maps, but may contain more than
    one of some node types, acting as a shortcut for a property which contains
    a list of the nodes. Order may or may not matter.

  - lists with counters: Contain an initial counter node, followed by the
    specified number of sub-nodes. Order may or may not matter.

  - hybrid map/lists: Act as a flattened list of objects, where each element
    begins with a particular node type which can then be optionally followed
    by attributes which apply to it. Order matters.

  - running state: Act as a list where each element modifies some part of the
    current state (for example formatting options in a rich text node). Order
    matters.

The root of the document may contain more than one node (it is effectively a
vector):

```text
MKBv{
  FRCi{
    1
  }
}
PDCv{
  VRSi{a}
}
```

When the format wants flexibility, [`DCEv`] (dictionary entry) nodes are used;
these contain a string key associated with one of several types of value.

The vast majority of node IDs serve a single purpose, but there are
a couple which hold different types of data depending on their path;
`BCMi` is an example of a node which may be an enum or a colour:
[`BPLv`.`BCMi`] / [`BEHv`.`BCMi`]. This seems to mostly be a problem
with the "popup menu" feature.

Colours can be represented in a number of ways. Filter effects
typically use hex strings `#rrggbb` / `#rrggbbaa`. Photoshop Live
filters use `RGBColor;<r>;<g>;<b>` with `<r>`, `<g>`, and `<b>` being
fractions between `0.000000` and `1.000000`. Core properties tend to
use 32-bit integers, but with a variety of byte layouts (`RGBA`,
`ABGR`, `ARGB`).

[FireworksNodes.md](./FireworksNodes.md) attempts to document the
various node types, and is based on observations from a large number
of real Fireworks documents created by Macromedia Fireworks 8 and
Adobe Fireworks CS4 (and a couple from Macromedia Fireworks MX). The
long names and descriptions are guessed / inferred, and may be
incorrect. The value ranges are based on observations and UI limits
and may be incomplete.

[`DCEv`]: ./FireworksNodes.md#dcev-dictionary-entry
[`BPLv`.`BCMi`]: ./FireworksNodes.md#bplv-bcmi-brush-tip-colouring-mode
[`BEHv`.`BCMi`]: ./FireworksNodes.md#behv-bcmi-background-colour-hover
