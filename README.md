# PNG Analyser

This tool can interpret a wide range of private PNG chunks, most notably those
used by Macromedia Fireworks to store vector information. It can also generate
adaptive colour palettes for images and export them with high compression.

Some related formats are also included in very early stages:
- CFF and OFF fonts
- BMP, ICNS, and ICO images

It can be used as a commandline tool, or as a browser-based tool (PNG input
only).

When reading a Fireworks PNG, this tool will extract each page and frame of the
document, and display them as individual SVGs (which can be saved). Hidden
elements are preserved as hidden tags in the SVG. A best-effort attempt is made
to represent text, filters, fill effects, and brush effects, but these are
limited by the capabilities of SVG as well as limitations in the understanding
of Fireworks' internal behaviour, and will not perfectly match the original
image.
