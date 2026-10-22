# Fireworks Node Types

See [Fireworks.md](./Fireworks.md) for an introduction to the data
structure used here.

Children of vector nodes are shown here with a suffix to indicate the
number of times they may appear: `*` means 0 or more; `+` means 1 or more;
`?` means 0 or 1 (i.e. optional); `(x2)` means exactly 2 (etc.); `(x2 +)`
means 2 or more. No suffix means it has always been observed to appear
exactly once.

## Root

[Root]: #root

This is the root of the document.
It is not represented as an actual node in the file.

Contains:

- [`MKBv`] Document
- [`PDCv`]\* Page

## `A2Ts` Anchor Link **A**lt **T**ext

[`A2Ts`]: #a2ts-anchor-link-alt-text

Parent: [`ALSv`] / [`MSTv`] / [`URLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

## `AACb` Export GIF **A**nimation **C**rop

[`AACb`]: #aacb-export-gif-animation-crop

Parent: [`EXPv`]

Crop individual frames when exporting as animated GIF.

## `AADb` Export GIF **A**nimation **D**iff

[`AADb`]: #aadb-export-gif-animation-diff

Parent: [`EXPv`]

Only include diffs between frames when exporting as animated GIF.

## `AEOi` **A**nimation **E**nd **O**pacity

[`AEOi`]: #aeoi-animation-end-opacity

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Final opacity for animation-type symbol. Defaults to 1000.

Value range: `0` (transparent) .. `1000` (opaque)

## `AGMb`

[`AGMb`]: #agmb

Parent: [`PTHv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Seen this set to `false` in one file, but it's usually `true`; seems to have no impact on rendering.

Values:

- `false`: unknown - TODO
- `true`: normal (TODO)

## `AIDi`

[`AIDi`]: #aidi

Parent: [`TXTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Set on text in some symbols, unknown meaning

Values:

- `1`: unknown - TODO
- `2`: unknown - TODO
- `3`: unknown - TODO
- `4`: unknown - TODO

## `ALNi`

[`ALNi`]: #alni

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Appears to be some sort of randomly-generated ID

## `ALSv` **S**ymbol Instance

[`ALSv`]: #alsv-symbol-instance

Parent: [`ELMv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

References a [`MSTv`] symbol definition with a matching [`MSNi`] ID.

Contains:

- [`ANNi`] Animation Number of Frames
- [`ANXf`] Animation X Shift
- [`ANYf`] Animation Y Shift
- [`ASCf`] Animation Scaling
- [`MSNi`] Symbol Unique Number
- [`MTXv`] Matrix
- [`XFMi`]
- [`A2Ts`]? Anchor Link Alt Text
- [`AEOi`]? Animation End Opacity
- [`ALNi`]?
- [`ANRi`]? Animation Rotation
- [`ASOi`]? Animation Start Opacity
- [`ATMv`]? Symbol Transform Matrix
- [`BEVv`]? Behaviour List
- [`BLDi`]? Blend Mode
- [`BUTs`]?
- [`DTAv`]? Data
- [`DVLb`]?
- [`EFLv`]? Effect List
- [`FILs`]? Label
- [`IMGv`]? Image
- [`INMs`]? Internal Name
- [`LCKb`]? Lock
- [`OBNs`]? Object Name
- [`VISb`]? Visible
- [`WPVs`]? Widget Parameter Values

## `ALTs` **A**nchor **L**ink **T**arget

[`ALTs`]: #alts-anchor-link-target

Parent: [`MSTv`] / [`URLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

## `ANNi` **An**imation **N**umber of Frames

[`ANNi`]: #anni-animation-number-of-frames

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Number of frames of animation to generate for the animation-type symbol (this generates a smooth transition using [`ANRi`], [`ASCf`], [`ASOi`], [`AEOi`], [`ANXf`], and [`ANYf`]).

Value range: `1`..inf

## `ANRi` **An**imation **R**otation

[`ANRi`]: #anri-animation-rotation

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Number of degrees of clockwise rotation to apply to an animation-type symbol. Uses a **signed** 32-bit value. Negative numbers are counter-clockwise.

Value range: `-360`..`360` (degrees)

## `ANXf` **An**imation **X** Shift

[`ANXf`]: #anxf-animation-x-shift

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Amount of x translation (pixels) to apply to an animation-type symbol.

## `ANYf` **An**imation **Y** Shift

[`ANYf`]: #anyf-animation-y-shift

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Amount of y translation (pixels) to apply to an animation-type symbol.

## `APLb`

[`APLb`]: #aplb

Parent: [`EXPv`]

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `APSb`

[`APSb`]: #apsb

Parent: [`EXPv`]

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `ASCf` **A**nimation **Sc**aling

[`ASCf`]: #ascf-animation-scaling

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Scaling to apply to an animation-type symbol

Value range: `0`..`250` (percent)

## `ASOi` **A**nimation **S**tart **O**pacity

[`ASOi`]: #asoi-animation-start-opacity

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Initial opacity for animation-type symbol.

Value range: `0` (transparent) .. `1000` (opaque)

## `ASTi` Websnap Tolerance

[`ASTi`]: #asti-websnap-tolerance

Parent: [`EXPv`]

Observed value range: `0x0000000e`..`0x0000000e` (`14`..`14`)

## `ATEb` **A**u**t**o-**E**nlarge

[`ATEb`]: #ateb-auto-enlarge

Parent: [`BEHv`] / [`TXTv`]

Values:

- `false`: Fixed width, wrap text.
- `true`: Adapt width to fit text content, no soft wrapping.

## `ATKb` **A**u**t**o-**K**ern

[`ATKb`]: #atkb-auto-kern

Parent: [`TXTv`] / [`ZSTv`]

Apply kerning based on character shape.

## `ATMv` Symbol **T**ransform **M**atrix

[`ATMv`]: #atmv-symbol-transform-matrix

Parent: [`ALSv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS5.1

Unclear what this matrix is for; it only includes translation, not rotation/scale/skew. Possibly a legacy value? Prefer using [`MTXv`] for the transformation.

Contains:

- [`M00f`] Matrix Element 0, 0
- [`M01f`] Matrix Element 0, 1
- [`M02f`] Matrix Element 0, 2
- [`M10f`] Matrix Element 1, 0
- [`M11f`] Matrix Element 1, 1
- [`M12f`] Matrix Element 1, 2
- [`M20f`] Matrix Element 2, 0
- [`M21f`] Matrix Element 2, 1
- [`M22f`] Matrix Element 2, 2

## `ATSb`

[`ATSb`]: #atsb

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `BANi` **B**rush **An**gle

[`BANi`]: #bani-brush-angle

Parent: [`BPLv`]

Value range: `0`..`359` (degrees); `0` = horizontal, `90` = vertical, increasing clockwise

## `BASi` **B**rush **As**pect

[`BASi`]: #basi-brush-aspect

Parent: [`BPLv`]

Value range: `0` (flat) .. `1000` (round)

## `BAZv` **B**e**z**ier Sub-Point

[`BAZv`]: #bazv-bezier-sub-point

Parent: [`BZLv`]

These sub-points are spaced equally along the bezier curve (TODO: by distance or by t-value?), and give details about varying pressure and speed of the pen.

Contains:

- [`PRSf`]? Pressure
- [`VELf`]? Velocity

## `BBKi` **B**rush **B**lac**k**ness

[`BBKi`]: #bbki-brush-blackness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `BBLi` **B**rush **Bl**eed

[`BBLi`]: #bbli-brush-bleed

Parent: [`BPLv`]

Observed value range: `0x00000000`..`0x00000000` (`0`..`0`)

## `BCLi` **B**rush **C**o**l**our

[`BCLi`]: #bcli-brush-colour

Parent: [`PALv`] / [`PATv`]

ARGB format colour.

Value range: `0x00000000`..`0xffffffff`

## `BCNi` **B**rush **C**o**n**centration

[`BCNi`]: #bcni-brush-concentration

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `BDIi` **B**rush **Di**ameter

[`BDIi`]: #bdii-brush-diameter

Parent: [`BPLv`]

Value range: `0`..inf (pixels)

## `BEEi` **Be**haviour Trigger **E**vent

[`BEEi`]: #beei-behaviour-trigger-event

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Values:

- `0`: mouse over
- `1`: click
- `2`: mouse out
- `3`: load

## `BEFi` **B**rush **E**dge **F**unction

[`BEFi`]: #befi-brush-edge-function

Parent: [`BPLv`]

Values:

- `0`: none
- `1`: white neon
- `2`: harsh wet
- `3`: smooth neon
- `4`: wavy gravy
- `5`: white neon edge

## `BEHv` **Beh**aviour

[`BEHv`]: #behv-behaviour

Parent: [`BEVv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Used for popup menus, rollover effects, etc.

- For setting status text, the text to set is in [`UNMs`].
- For swapping image, the frame to get the image from is in [`FRCi`]. The slice to change is referenced by [`MSNi`].
- For nav bar changes, the frame to get the "down" image from is in [`FRCi`], the frame for "over while down" is in [`FRTi`] (or 3, by default). The slice to change is referenced by [`MSNi`].
- For popup menus, [`TRNs`] contains the menu definition in the format:

  ```text
  {{"Item 1","link","target",{{"Nested 1","nested link","nested target",{}}{"Nested 2","","",{{"Sub-nested","","",{}}}}}}{"Item 2","","",{}}}
  ```

Contains:

- [`BEEi`] Behaviour Trigger Event
- [`BETi`] Behaviour Type
- [`ATEb`]? Auto-Enlarge
- [`BEHv`.`BCLi`]? Background Colour
- [`BEHv`.`BCMi`]? Background Colour Hover
- [`BEHv`.`FCLi`]? Menu Item Text Colour
- [`BEHv`.`FETi`]?
- [`BOCi`]? Border Colour
- [`BOLb`]? Bold
- [`BOSi`]? Border Size
- [`CDTs`]?
- [`CHKb`]? Checked ?
- [`CPDi`]? Menu Item Cell Padding
- [`CSHi`]? Colour Shadow
- [`CSPi`]? Menu Item Cell Spacing
- [`FONs`]? Font Family
- [`FRCi`]? Frame Count
- [`FRTi`]? Over While Down state number
- [`HICi`]? Highlight Colour
- [`HIMb`]?
- [`ITLb`]? Italic
- [`JSTi`]? Justification
- [`MIDi`]? Text Colour Hover
- [`MIHi`]? Menu Item Height
- [`MITi`]? Menu Indent Text
- [`MIVb`]? Menu Items Vertical
- [`MIWi`]? Menu Item Width
- [`MSNi`]? Symbol Unique Number
- [`OPQb`]?
- [`OVHb`]? Override Height
- [`OVWb`]? Override Width
- [`PREb`]? Preload
- [`PTSf`]? Font Point Size
- [`RELb`]?
- [`RMOb`]? Revert on Mouse Out
- [`ROLi`]? Roll Behaviour
- [`TMOi`]? Menu Delay
- [`TRNs`]? Text Run
- [`UNMs`]? User-facing Name
- [`VERi`]?
- [`XLCf`]? X Location
- [`XSLf`]?
- [`YLCf`]? Y Location
- [`YSLf`]?
- [`ZSTv`]\* Saved Style

## `BEHv`.`BCLi` **B**ackground **C**o**l**our

[`BEHv`.`BCLi`]: #behv-bcli-background-colour

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

ARGB format colour.

Value range: `0x00000000`..`0xffffffff`

## `BEHv`.`BCMi` **B**ackground **C**olour Hover

[`BEHv`.`BCMi`]: #behv-bcmi-background-colour-hover

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

A BGRA colour for the background of highlighted menu items.

Value range: `0x00000000`..`0xffffffff`

## `BEHv`.`FCLi` **M**enu **I**tem **T**ext Colour

[`BEHv`.`FCLi`]: #behv-fcli-menu-item-text-colour

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

ARGB (?) format colour for the text of highlighted menu items.

Value range: `0x00000000`..`0xffffffff`

## `BEHv`.`FETi`

[`BEHv`.`FETi`]: #behv-feti

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

An ARGB (?) format colour, unknown purpose.

Value range: `0x00000000`..`0xffffffff`

## `BETi` **Be**haviour **T**ype

[`BETi`]: #beti-behaviour-type

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Values:

- `0`: set nav bar image
- `1`: set text of status bar
- `2`: swap image
- `4`: nav bar down
- `5`: swap image restore
- `6`: nav bar over
- `7`: nav bar restore
- `8`: "simple rollover"
- `9`: popup menu

## `BEVv` **Be**haviour List

[`BEVv`]: #bevv-behaviour-list

Parent: [`ALSv`] / [`MSTv`] / [`URLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Contains:

- [`BEHv`]\* Behaviour

## `BFBi` **Br**ush **F**eed**b**ack

[`BFBi`]: #bfbi-brush-feedback

Parent: [`BPLv`]

Values:

- `0`: none
- `1`: brush
- `2`: background

## `BFRi` **Br**ush **F**low **R**ate

[`BFRi`]: #bfri-brush-flow-rate

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `BGCi` **B**ack**g**round **C**olour

[`BGCi`]: #bgci-background-colour

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`]

ARGB format colour.

Value range: `0x00000000`..`0xffffffff`

## `BIAb` **B**rush **I**s **A**nti-Aliased

[`BIAb`]: #biab-brush-is-anti-aliased

Parent: [`BPLv`]

## `BKGb`

[`BKGb`]: #bkgb

Parent: [`LAYv`] / [`LSLv`]

Values:

- `false`: unknown - TODO - observed in all files

## `BLDi` **Bl**en**d** Mode

[`BLDi`]: #bldi-blend-mode

Parent: [`ALSv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Values:

- `2`: multiply
- `3`: difference
- `4`: overlay
- `5`: screen
- `7`: disolve
- `8`: linear burn
- `9`: darken
- `10`: lighten
- `11`: hue
- `12`: saturation
- `13`: color
- `14`: luminosity
- `17`: invert
- `18`: linear dodge
- `19`: vivid light
- `20`: linear light
- `21`: pin light
- `22`: hard mix
- `25`: erase
- `29`: tint
- `30`: average
- `31`: negation
- `32`: exclusion
- `33`: hard light
- `34`: soft light
- `35`: fuzzy light
- `36`: color dodge
- `37`: color burn
- `38`: inverse color dodge
- `39`: inverse color burn
- `40`: soft dodge
- `41`: soft burn
- `42`: reflect
- `43`: glow
- `44`: freeze
- `45`: heat
- `46`: additive
- `47`: subtractive
- `48`: interpolation
- `49`: stamp
- `50`: xor
- `51`: red
- `52`: green
- `53`: blue
- `54`: subtract

## `BLSf` **B**ase**l**ine **S**hift

[`BLSf`]: #blsf-baseline-shift

Parent: [`TFSv`] / [`TXTv`]

Vertical shift to apply to text. Typically uses -10 for subscript and +10 for superscript (0 for normal), but can be any value

## `BMMi` **B**rush **M**ax Count

[`BMMi`]: #bmmi-brush-max-count

Parent: [`BPLv`]

UI limit on number of brush tips?

Value range: `1`..`31`

## `BMSi` **B**rush **M**in **S**ize

[`BMSi`]: #bmsi-brush-min-size

Parent: [`BPLv`]

Lower bound on rendered tip size when varying (e.g. due to sensitivity), as a proportion of the brush size.

Value range: `1`..`1000` (per mille)

## `BNTi` **Br**ush **N**umber of **T**ips

[`BNTi`]: #bnti-brush-number-of-tips

Parent: [`BPLv`]

Value range: `1`..`5`

## `BOAf` **Bo**unds

[`BOAf`]: #boaf-bounds

Parent: [`TXTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Width to fit text to, if [`TFTi`] is `1`.

## `BOCi` **Bo**rder **C**olour

[`BOCi`]: #boci-border-colour

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

An ARGB format colour for the popup menu border.

Value range: `0x00000000`..`0xffffffff`

## `BOLb` **Bol**d

[`BOLb`]: #bolb-bold

Parent: [`BEHv`] / [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `false`: end bold
- `true`: begin bold

## `BOSi` **Bo**rder **S**ize

[`BOSi`]: #bosi-border-size

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Size (in pixels) of the popup menu border.

## `BOTf` **Bot**tom

[`BOTf`]: #botf-bottom

Parent: [`CDMv`] / [`NGMv`] / [`NGVv`] / [`RCTv`] / [`TXTv`] / [`URLv`]

Distance (pixels) from top of container to bottom of entity.

## `BPLv` **B**rush **P**roperty **L**ist

[`BPLv`]: #bplv-brush-property-list

Parent: [`PATv`] / [`PLLv`]

Contains:

- [`BANi`] Brush Angle
- [`BASi`] Brush Aspect
- [`BBKi`] Brush Blackness
- [`BBLi`] Brush Bleed
- [`BCNi`] Brush Concentration
- [`BDIi`] Brush Diameter
- [`BEFi`] Brush Edge Function
- [`BFBi`] Brush Feedback
- [`BFRi`] Brush Flow Rate
- [`BIAb`] Brush Is Anti-Aliased
- [`BMMi`] Brush Max Count
- [`BMSi`] Brush Min Size
- [`BNTi`] Brush Number of Tips
- [`BPLv`.`BCMi`] Brush Tip Colouring Mode
- [`BRTi`] Brush Type
- [`BSEi`] Brush Soft Edges
- [`BSFi`] Brush Soft Edges Function
- [`BSHi`] Brush Shape
- [`BSMi`] Brush Tip Spacing Mode
- [`BSPi`] Brush Spacing
- [`BTBi`] Brush Texture Blend
- [`BTEi`] Brush Texture Edge
- [`BTSi`] Brush Tip Spacing
- [`CATs`] Category Name
- [`INMs`] Internal Name
- [`RDOb`] Read-Only
- [`DF1i`]? Dash Off 1
- [`DF2i`]? Dash Off 2
- [`DF3i`]? Dash Off 3
- [`DO1i`]? Dash On 1
- [`DO2i`]? Dash On 2
- [`DO3i`]? Dash On 3
- [`NDIi`]? Number of Dashes
- [`SHAi`]? Sensitivity to Horizontal on Angle
- [`SHBi`]? Sensitivity to Horizontal on Blackness
- [`SHHi`]? Sensitivity to Horizontal on Hue
- [`SHLi`]? Sensitivity to Horizontal on Lightness
- [`SHOi`]? Sensitivity to Horizontal on Opacity
- [`SHRi`]? Sensitivity to Horizontal on Scatter
- [`SHSi`]? Sensitivity to Horizontal on Saturation
- [`SHZi`]? Sensitivity to Horizontal on Size
- [`SPAi`]? Sensitivity to Pressure on Angle
- [`SPBi`]? Sensitivity to Pressure on Blackness
- [`SPHi`]? Sensitivity to Pressure on Hue
- [`SPLi`]? Sensitivity to Pressure on Lightness
- [`SPOi`]? Sensitivity to Pressure on Opacity
- [`SPRi`]? Sensitivity to Pressure on Scatter
- [`SPSi`]? Sensitivity to Pressure on Saturation
- [`SPZi`]? Sensitivity to Pressure on Size
- [`SRAi`]? Sensitivity to Random on Angle
- [`SRBi`]? Sensitivity to Random on Blackness
- [`SRHi`]? Sensitivity to Random on Hue
- [`SRLi`]? Sensitivity to Random on Lightness
- [`SROi`]? Sensitivity to Random on Opacity
- [`SRRi`]? Sensitivity to Random on Scatter
- [`SRSi`]? Sensitivity to Random on Saturation
- [`SRZi`]? Sensitivity to Random on Size
- [`SSAi`]? Sensitivity to Speed on Angle
- [`SSBi`]? Sensitivity to Speed on Blackness
- [`SSHi`]? Sensitivity to Speed on Hue
- [`SSLi`]? Sensitivity to Speed on Lightness
- [`SSOi`]? Sensitivity to Speed on Opacity
- [`SSRi`]? Sensitivity to Speed on Scatter
- [`SSSi`]? Sensitivity to Speed on Saturation
- [`SSZi`]? Sensitivity to Speed on Size
- [`SVAi`]? Sensitivity to Vertical on Angle
- [`SVBi`]? Sensitivity to Vertical on Blackness
- [`SVHi`]? Sensitivity to Vertical on Hue
- [`SVLi`]? Sensitivity to Vertical on Lightness
- [`SVOi`]? Sensitivity to Vertical on Opacity
- [`SVRi`]? Sensitivity to Vertical on Scatter
- [`SVSi`]? Sensitivity to Vertical on Saturation
- [`SVZi`]? Sensitivity to Vertical on Size
- [`UNMs`]? User-facing Name

## `BPLv`.`BCMi` **B**rush Tip **C**olouring **M**ode

[`BPLv`.`BCMi`]: #bplv-bcmi-brush-tip-colouring-mode

Parent: [`BPLv`]

Used to decide individual tip colours if [`BNTi`] > `1`

Values:

- `0`: random
- `1`: uniform
- `2`: complementary
- `3`: hue
- `4`: shadow (tips nearer the bottom have higher blackness)

## `BRPi` **Br**ush **P**lacement

[`BRPi`]: #brpi-brush-placement

Parent: [`PTHv`] / [`TXTv`] / [`ZSTv`]

Values:

- `0`: inside
- `1`: middle
- `2`: outside

## `BRTi` **Br**ush **T**ype

[`BRTi`]: #brti-brush-type

Parent: [`BPLv`]

Values:

- `0`: natural
- `1`: simple

## `BSEi` **B**rush **S**oft **E**dges

[`BSEi`]: #bsei-brush-soft-edges

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `BSFi` **B**rush **S**oft Edges **F**unction

[`BSFi`]: #bsfi-brush-soft-edges-function

Parent: [`BPLv`]

Values:

- `0`: bell curve
- `1`: linear

## `BSHi` **B**rush **Sh**ape

[`BSHi`]: #bshi-brush-shape

Parent: [`BPLv`]

Values:

- `0`: square
- `1`: circle

## `BSLf`

[`BSLf`]: #bslf

Parent: [`PBPv`]

Possibly related to hand-drawn curves? (TODO)

Observed value range: `0`..`0`

## `BSMi` **B**rush Tip **S**pacing **M**ode

[`BSMi`]: #bsmi-brush-tip-spacing-mode

Parent: [`BPLv`]

Values:

- `0`: random
- `1`: diagonal - tips are arranged top-left to bottom-right, spaced equally
- `2`: circular - first tip is in centre, surrounded by other tips placed at a fixed distance and equally spaced angles (if only 2 tips, they are placed diagonally)

## `BSPi` **B**rush **Sp**acing

[`BSPi`]: #bspi-brush-spacing

Parent: [`BPLv`]

Space between individual stamps of the brush image along the path, as a fraction of the brush size.

Value range: `0`..inf (per mille)

## `BTBi` **B**rush **T**exture **B**lend

[`BTBi`]: #btbi-brush-texture-blend

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `BTEi` **B**rush **T**exture **E**dge

[`BTEi`]: #btei-brush-texture-edge

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `BTSi` **B**rush **T**ip **S**pacing

[`BTSi`]: #btsi-brush-tip-spacing

Parent: [`BPLv`]

Distance from centre of tips to outermost tips, as a fraction of the brush size

Value range: `0`..inf (percent)

## `BUTs`

[`BUTs`]: #buts

Parent: [`ALSv`]

Observed in versions: Macromedia Fireworks MX - Macromedia Fireworks MX 2004

## `BZCi` **B**e**z**ier Sub-Points **C**ount

[`BZCi`]: #bzci-bezier-sub-points-count

Parent: [`BZLv`]

Number of [`BAZv`] nodes (may also be `1` if there are no nodes).

## `BZLv` **B**e**z**ier Sub-Points **L**ist

[`BZLv`]: #bzlv-bezier-sub-points-list

Parent: [`PBTv`]

Contains:

- [`BAZv`]+ Bezier Sub-Point
- [`BZCi`] Bezier Sub-Points Count

## `CATs` **Cat**egory Name

[`CATs`]: #cats-category-name

Parent: [`BPLv`] / [`EFLv`] / [`FGLv`] / [`FPLv`]

## `CBAi` **C**ell **B**ackground (Slice) **A**ttachment

[`CBAi`]: #cbai-cell-background-slice-attachment

Parent: [`EXPv`] / [`URLv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Values:

- `0`: fixed
- `1`: scroll
- `147391808`: unknown - TODO
- `153798280`: unknown - TODO
- `4294967040`: unknown - TODO
- `4294967295`: unknown - TODO

## `CBHi` **C**ell **B**ackground (Slice) **H**orizontal Position

[`CBHi`]: #cbhi-cell-background-slice-horizontal-position

Parent: [`URLv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS5

Values:

- `0`: left
- `1`: center
- `2`: right
- `3`: value ([`CHVi`])
- `93142424`: unknown - TODO
- `155681776`: unknown - TODO
- `4294967040`: unknown - TODO
- `4294967295`: unknown - TODO

## `CBRi` **C**ell **B**ackground (Slice) **R**epeat

[`CBRi`]: #cbri-cell-background-slice-repeat

Parent: [`EXPv`] / [`URLv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Values:

- `0`: no-repeat
- `1`: repeat-both
- `2`: repeat-x
- `3`: repeat-y
- `146872424`: unknown - TODO
- `154894800`: unknown - TODO
- `4294967040`: unknown - TODO

## `CBTb`

[`CBTb`]: #cbtb

Parent: [`URLv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS5

Appears to be `true` if [`TSLi`] is `2` (i.e. slice is "background").

## `CBUs` **C**ell **B**ackground **U**RL

[`CBUs`]: #cbus-cell-background-url

Parent: [`EXPv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

URL (starting `file://`) of a background image to use when exporting as HTML, or a blank string.

## `CBVi` **C**ell **B**ackground (Slice) **V**ertical Position

[`CBVi`]: #cbvi-cell-background-slice-vertical-position

Parent: [`URLv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS5

Values:

- `0`: top
- `1`: center
- `2`: bottom
- `3`: value ([`CVVi`])
- `146872424`: unknown - TODO
- `149946368`: unknown - TODO
- `154730496`: unknown - TODO
- `154894800`: unknown - TODO
- `181076223`: unknown - TODO
- `4294967040`: unknown - TODO

## `CDAi` HTML Page **A**lignment

[`CDAi`]: #cdai-html-page-alignment

Parent: [`EXPv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Values:

- `0`: left
- `1`: center
- `2`: right

## `CDMv`

[`CDMv`]: #cdmv

Parent: [`EXPv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Contains:

- [`BOTf`] Bottom
- [`LFTf`] Left
- [`RITf`] Right
- [`TOPf`] Top

## `CDTs`

[`CDTs`]: #cdts

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

A timestamp in `yyyyMMddHHmmss` format.

## `CELv` Animation **Cel**l

[`CELv`]: #celv-animation-cell

Parent: [`CLLv`]

Contains:

- [`ELMv`] Elements
- [`LCKb`] Lock
- [`VISb`]? Visible

## `CFTs` **F**ont **T**ypeface

[`CFTs`]: #cfts-font-typeface

Parent: [`TXTv`] / [`ZSTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

e.g. `Arial-Black`, `HelveticaNeue-Light`

## `CHKb` **Ch**ec**k**ed ?

[`CHKb`]: #chkb-checked

Parent: [`BEHv`]

Observed in version: Adobe Fireworks CS4

Used by Set Nav Bar behaviour.

"Show Down Image Upon Load"

## `CHOf` **Ch**aracter **O**ffset

[`CHOf`]: #chof-character-offset

Parent: [`TAPv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Offset (in pixels) along path to begin text.

## `CHVi` **C**ell **H**orizontal **V**alue

[`CHVi`]: #chvi-cell-horizontal-value

Parent: [`URLv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS5

Used if [`CBHi`] is `3`. Otherwise this is always set to `0xffffffff`

## `CLLb` **C**o**l**our **L**ocked

[`CLLb`]: #cllb-colour-locked

Parent: [`PALv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

## `CLLv` Animation **C**e**l**l **L**ist

[`CLLv`]: #cllv-animation-cell-list

Parent: [`LAYv`] / [`LSLv`]

Contains:

- [`CELv`]+ Animation Cell

## `CLMb` **C**o**l**our **M**apped

[`CLMb`]: #clmb-colour-mapped

Parent: [`PALv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Values:

- `false`: colour is defined by [`FCLi`]
- `true`: colour is mapped to value of [`BCLi`]

## `CLPi` Export Scale **P**ropotion

[`CLPi`]: #clpi-export-scale-propotion

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Used to calculate [`XSZi`] and [`YSZi`] if [`CNSb`] is `true` and [`CLSb`] is `true`.

Value range: `2`..`200` (percent)

## `CLRi` **C**o**l**ou**r** Mode

[`CLRi`]: #clri-colour-mode

Parent: [`EXPv`]

Values:

- `0`: indexed
- `1`: RGB
- `2`: RGBA

## `CLSb` Export **S**cale Constrained

[`CLSb`]: #clsb-export-scale-constrained

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Values:

- `false`: [`XSZi`] and [`YSZi`] are specified by the user directly. Export aspect ratio is not preserved.
- `true`: [`XSZi`] and [`YSZi`] are calculated from [`CLPi`] and the image size. Export aspect ratio is preserved.

## `CLTb` **C**o**l**our **T**ransparent

[`CLTb`]: #cltb-colour-transparent

Parent: [`PALv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

## `CNSb` Export **S**cale

[`CNSb`]: #cnsb-export-scale

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Note: this value is never `false`; `false` is implied by its absence.

Values:

- `true`: Rescale to [`XSZi`] x [`YSZi`] when exporting. See also [`CLSb`].

## `CPDi` Menu Item **C**ell **P**a**d**ding

[`CPDi`]: #cpdi-menu-item-cell-padding

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

## `CPSv` **C**ontrol **P**oint**s**

[`CPSv`]: #cpsv-control-points

Parent: [`ISSv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

Contains:

- [`CPTv`]+ Control Point

## `CPTv` **C**ontrol **P**oin**t**

[`CPTv`]: #cptv-control-point

Parent: [`CPSv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

Contains:

- [`CTYi`] Control Point Type
- [`TTDb`] Tooltip Tracks Drag
- [`VISb`] Visible
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`OBNs`]? Object Name
- [`TTPs`]? Tooltip

## `CRSv`

[`CRSv`]: #crsv

Parent: [`ISSv`]

Observed in version: Macromedia Fireworks MX 2004

No observed child nodes.

## `CRVb` Is **C**u**rv**e

[`CRVb`]: #crvb-is-curve

Parent: [`PBTv`]

Values:

- `false`: line is straight (points are forced to be colinear)
- `true`: line is a curve

## `CSGv` **CS**6 **G**roup

[`CSGv`]: #csgv-cs6-group

Parent: [`ELMv`]

Observed in version: Adobe Fireworks CS6

Seems to be an alternative to [`GRPv`] introduced in CS6. Unclear what the difference is.

Contains:

- [`DTAv`] Data
- [`ELMv`] Elements
- [`GRTi`] Group Type
- [`LCKb`] Lock
- [`PTHv`] Path
- [`EFLv`]? Effect List
- [`IMGv`]? Image
- [`OBNs`]? Object Name
- [`VISb`]? Visible

## `CSHi` **C**olour **Sh**adow

[`CSHi`]: #cshi-colour-shadow

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

An ARGB colour for the popup menu border shadow.

Values:

- `4283782485`: unknown - TODO
- `4284900915`: unknown - TODO
- `4294967295`: unknown - TODO

## `CSMb` HTML **CS**S **M**enus

[`CSMb`]: #csmb-html-css-menus

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX 2005 - Adobe Fireworks CS6

"Use CSS for Popup Menus".

## `CSPi` Menu Item **C**ell **Sp**acing

[`CSPi`]: #cspi-menu-item-cell-spacing

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

## `CTYi` **C**ontrol Point **Ty**pe

[`CTYi`]: #ctyi-control-point-type

Parent: [`CPTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

Grab handle config controlled by `type` in JavaScript. Appears to control the appearance of the handle.

Values:

- `0`: default (yellow diamond with blue border)
- `1`: defaultInverted (blue diamond with yellow border)
- `2`: crossHair (black crosshair on white background)

## `CVVi` **C**ell **V**ertical **V**alue

[`CVVi`]: #cvvi-cell-vertical-value

Parent: [`URLv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS5

Used if [`CBVi`] is `3`. Otherwise this is always set to `0xffffffff`

## `CXBb`

[`CXBb`]: #cxbb

Parent: [`EXPv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Values:

- `false`: unknown - TODO

## `DCEv` **D**i**c**tionary **E**ntry

[`DCEv`]: #dcev-dictionary-entry

A key-value pair with multiple possible value types. Contains a [`DCKs`] and one other child node with type [`DCVs`], [`GPLv`], [`GDTv`], or [`GVRv`] (note: `GVRv` may have a sibling `DCVs` which represents the same data but flattened).

The observed entities broken down by key are:

### `DCEv` "`AngleSoftness`"

[`DCEv` "`AngleSoftness`"]: #dcev-anglesoftness

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Observed value range: `0`..`65`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`BevelContrast`"

[`DCEv` "`BevelContrast`"]: #dcev-bevelcontrast

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inner Glow", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters. For "Glow" and "Inner Glow", this is the glow opacity.

Observed value range: `0`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`BevelType`"

[`DCEv` "`BevelType`"]: #dcev-beveltype

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Values:

- `0`: inner bevel
- `1`: outer bevel
- `2`: raise emboss
- `3`: inset emboss
- `4`: glow effect

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`BevelWidth`"

[`DCEv` "`BevelWidth`"]: #dcev-bevelwidth

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Observed value range: `0`..`133`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Blendmode`"

[`DCEv` "`Blendmode`"]: #dcev-blendmode

Parent: [`EPSv`]

Used by "Color Fill" filter.

The blend mode to use when applying the solid colour fill. Note that some modes (such as "darken") can be set in the UI, but immediately revert to "normal". Also several of these modes render identically, and are not consistent with the layer blend modes.

Values:

- `0`: normal
- `2`: color burn
- `3`: luminosity
- `4`: hard light
- `5`: inverse color dodge
- `8`: lighten
- `9`: multiply
- `10`: color dodge
- `12`: reflect
- `13`: glow
- `14`: freeze
- `17`: invert background (ignores "Color" property)
- `18`: soft light
- `19`: negation
- `21`: hue
- `22`: saturation
- `29`: unknown - TODO
- `30`: average
- `31`: green
- `32`: red
- `33`: exclusion
- `35`: difference
- `36`: soft dodge
- `37`: inverse color burn
- `39`: soft burn
- `40`: overlay
- `42`: subtract
- `43`: interpolation
- `44`: stamp
- `45`: xor
- `46`: invert (behaves as add)
- `47`: tint
- `48`: erase
- `51`: heat
- `53`: additive

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ButtonState`"

[`DCEv` "`ButtonState`"]: #dcev-buttonstate

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Values:

- `0`: up
- `1`: over
- `2`: down
- `3`: hit

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Color`"

[`DCEv` "`Color`"]: #dcev-color

Parent: [`EPSv`]

Used by "Color Fill" filter.

A colour in "#rrggbb" format

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Dict`"

[`DCEv` "`Dict`"]: #dcev-dict

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter. Always "10". Possibly a version indicator?

Observed value range: `10`..`10`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`DownBlendColor`"

[`DCEv` "`DownBlendColor`"]: #dcev-downblendcolor

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

A colour in "#rrggbbaa" format to apply when button is in the "down" state.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`EdgeThreshold`"

[`DCEv` "`EdgeThreshold`"]: #dcev-edgethreshold

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Alpha threshold for detected edges. "Glow" uses a value of `1`; all other filter types use a value of "0".

Value range: `0` (fully transparent) .. `1` (fully opaque)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`EffectIsVisible`"

[`DCEv` "`EffectIsVisible`"]: #dcev-effectisvisible

Parent: [`EPSv`]

Values:

- `false`: effect is not applied
- `true`: effect is applied

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`EffectMoaID`"

[`DCEv` "`EffectMoaID`"]: #dcev-effectmoaid

Parent: [`EPSv`]

Values:

- `{1f2f2591-9db7-11d1-8cad00a024cdc039}`: Sharpen More
- `{2932d5a2-ca48-11d1-8561000502701850}`: Convert to Alpha
- `{2ba87123-8220-11d3-baad0000861f4d01}`: Inner Glow
- `{3439b08c-1921-11d3-9bde00e02910d580}`: Brightness/Contrast
- `{3439b08d-1922-11d3-9bde00e02910d580}`: Hue/Saturation
- `{3439b08e-1923-11d3-9bde00e02910d580}`: Curves
- `{538016b6-ffd6-418f-a10c590e6ee841ae}`: Motion Blur
- `{5600f702-774c-11d3-baad0000861f4d01}`: Inner Shadow
- `{7fe61102-6ce2-11d1-8c76000502701850}`: Bevel
- `{8eeadf50-9efe-11da-a7460800200c9a66}`: Photoshop Live Effects Special Fill
- `{94dbd663-9b2e-44bf-8064ab6efdd2d327}`: Zoom Blur
- `{a7944db8-6ce2-11d1-8c76000502701850}`: Drop Shadow
- `{b90c950e-64df-11d8-aaf2000a9582f7d4}`: Solid Shadow
- `{c20952b1-fc76-11d0-8be700a024cdc039}`: Sharpen
- `{d04ef8c0-71b3-11d1-8c8200a024cdc039}`: Gaussian Blur
- `{d04ef8c1-71b4-11d1-8c8200a024cdc039}`: Auto Levels
- `{d04ef8c2-71b5-11d1-8c8200a024cdc039}`: Levels
- `{d1c33142-2ad8-4215-a39fc5d934c8fc0c}`: Radial Blur
- `{d2541291-70d6-11d1-8c8000a024cdc039}`: Invert
- `{d2e7769c-6349-11d8-b0e9000a9595f34e}`: Difference Clouds
- `{d810e821-f86b-11d0-43464c4443664973}`: unknown - TODO
- `{d810e821-f86b-11d0-4650474246504742}`: unknown - TODO
- `{d810e821-f86b-11d0-46504b5946504b59}`: unknown - TODO
- `{d810e821-f86b-11d0-46504c5546504c55}`: unknown - TODO
- `{d810e821-f86b-11d0-46504c7146504c71}`: unknown - TODO
- `{d810e821-f86b-11d0-4650524246505242}`: unknown - TODO
- `{d810e821-f86b-11d0-4650524746505247}`: unknown - TODO
- `{d810e821-f86b-11d0-4650616546506165}`: unknown - TODO
- `{d810e821-f86b-11d0-4650616646506166}`: unknown - TODO
- `{d810e821-f86b-11d0-4650676846506768}`: unknown - TODO
- `{d810e821-f86b-11d0-4650676c4650676c}`: unknown - TODO
- `{d810e821-f86b-11d0-4650696e4650696e}`: unknown - TODO
- `{d810e821-f86b-11d0-46506d6c46506d6c}`: unknown - TODO
- `{d810e821-f86b-11d0-46506d7146506d71}`: unknown - TODO
- `{d810e821-f86b-11d0-46506d7a46506d7a}`: unknown - TODO
- `{d810e821-f86b-11d0-46506f6e46506f6e}`: unknown - TODO
- `{d810e821-f86b-11d0-4650736946507369}`: unknown - TODO
- `{d810e821-f86b-11d0-4650737746507377}`: unknown - TODO
- `{d810e821-f86b-11d0-4650744c4650744c}`: unknown - TODO
- `{d810e821-f86b-11d0-4650746b4650746b}`: unknown - TODO
- `{d810e821-f86b-11d0-4650746e4650746e}`: unknown - TODO
- `{d810e821-f86b-11d0-4650747746507477}`: unknown - TODO
- `{d810e821-f86b-11d0-4650767446507674}`: unknown - TODO
- `{d810e821-f86b-11d0-4650785346507853}`: unknown - TODO
- `{d810e821-f86b-11d0-465a6550465a6550}`: unknown - TODO
- `{d810e821-f86b-11d0-4661676846616768}`: unknown - TODO
- `{d810e821-f86b-11d0-4664323546643235}`: unknown - TODO
- `{d810e821-f86b-11d0-4664353046643530}`: unknown - TODO
- `{d810e821-f86b-11d0-46676c6946676c69}`: unknown - TODO
- `{d810e821-f86b-11d0-4668736c4668736c}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747241636345}`: Accented Edges (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472416e6753}`: Angled Strokes (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472426f6b68}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74724273526c}`: Bas Relief (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747243686c43}`: Chalk && Charcoal (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747243687263}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74724368726d}`: Chrome (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472436c6473}`: Clouds (obsolete? - seen but unused in Fireworks Common Library symbol)
- `{d810e821-f86b-11d0-466c7472436c7248}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472436c7250}`: Colored Pencil (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472436e7443}`: Conté Crayon (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724372716c}`: Craquelure (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747243727368}`: Crosshatch (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747243727374}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747243742020}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747244667243}`: Difference Clouds (obsolete? - seen but unused in Fireworks Common Library symbol)
- `{d810e821-f86b-11d0-466c747244667347}`: Diffuse Glow (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472446e7472}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747244726b53}`: Dark Strokes (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747244727942}`: Dry Brush (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724473706c}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747245787472}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472466c6d47}`: Film Grain (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747246727363}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747247456663}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472476c7320}`: Glass (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472476c7745}`: Glowing Edges (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747247726150}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747247726e20}`: Grain (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472486c6653}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472496e6b4f}`: Ink Outlines (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724c676845}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74724c6e7346}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74724c766c46}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74724d736354}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74724d7a746e}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74724e476c77}`: Neon Glow (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724e545343}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74724e745072}`: Note Paper (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724f636e52}`: Ocean Ripple (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747250687463}`: Photocopy (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506c7220}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472506c7357}`: Plastic Wrap (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506c7374}`: Plaster (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506c744b}`: Palette Knife (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506e6368}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472506e7444}`: Paint Daubs (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506e746c}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747250737445}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747250746368}`: Patchwork (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747252646c42}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747252676850}`: Rough Pastels (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747252706c65}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74725274636c}`: Reticulation (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253687220}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472536c727a}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472536d6453}`: Smudge Stick (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472536d6965}`: Sumi-e (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472536d7242}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747253706872}`: Spherize (obsolete? - seen but unused in Fireworks Common Library symbol)
- `{d810e821-f86b-11d0-466c747253706e67}`: Sponge (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253707253}`: Sprayed Strokes (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253707420}`: Spatter (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253746d70}`: Stamp (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253746e47}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747254645420}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472546c7320}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472546d4d74}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747254726e45}`: Torn Edges (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74725477726c}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747254787446}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74725478747a}`: Texturizer (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472556e6472}`: Underpainting (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74725672746e}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747257615270}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747257617665}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472576e6420}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747257747250}`: Water Paper (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747257747263}`: Watercolor (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74725a675a67}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472626c7273}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74726561734f}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472666c6d32}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472676c6162}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472676f6f6c}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747267726164}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747268797074}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74726c656e73}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74726c676874}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74726d667572}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74726d6b536d}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74726f454447}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747270726f6a}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74727079726d}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747272616477}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747272647368}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747272656163}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747273637472}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747273687270}`: unknown - TODO
- `{d810e821-f86b-11d0-466c7472736d6f6b}`: unknown - TODO
- `{d810e821-f86b-11d0-466c74727370687a}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747273757266}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747274757262}`: unknown - TODO
- `{d810e821-f86b-11d0-466c747274787472}`: unknown - TODO
- `{d810e821-f86b-11d0-4670747246707472}`: unknown - TODO
- `{d810e821-f86b-11d0-4672676246726762}`: unknown - TODO
- `{d810e821-f86b-11d0-46736c6146736c61}`: unknown - TODO
- `{d810e821-f86b-11d0-46736c6246736c62}`: unknown - TODO
- `{d810e821-f86b-11d0-46736f6c46736f6c}`: unknown - TODO
- `{d810e821-f86b-11d0-4673776146737761}`: unknown - TODO
- `{d810e821-f86b-11d0-494d4673696d6653}`: unknown - TODO
- `{d810e821-f86b-11d0-506c7033506c7033}`: unknown - TODO
- `{d810e821-f86b-11d0-5244477464746852}`: unknown - TODO
- `{d810e821-f86b-11d0-6166533261664532}`: unknown - TODO
- `{d810e821-f86b-11d0-6166533361664533}`: unknown - TODO
- `{d810e821-f86b-11d0-6166533461664534}`: unknown - TODO
- `{d810e821-f86b-11d0-616e443161533231}`: unknown - TODO
- `{d810e821-f86b-11d0-616e443161533332}`: unknown - TODO
- `{d810e821-f86b-11d0-616e443161533530}`: unknown - TODO
- `{d810e821-f86b-11d0-616e443161533931}`: unknown - TODO
- `{d810e821-f86b-11d0-616e443161537630}`: unknown - TODO
- `{d810e821-f86b-11d0-616e443161537830}`: unknown - TODO
- `{d810e821-f86b-11d0-616e443261533530}`: unknown - TODO
- `{d810e821-f86b-11d0-61764a5050615032}`: unknown - TODO
- `{d810e821-f86b-11d0-6265794562657945}`: unknown - TODO
- `{d810e821-f86b-11d0-6469473064694731}`: unknown - TODO
- `{d810e821-f86b-11d0-6469473264694733}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354165636257}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354165636655}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354165636d41}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354165636d45}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354165637253}`: unknown - TODO
- `{d810e821-f86b-11d0-656335416563734c}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354165637357}`: unknown - TODO
- `{d810e821-f86b-11d0-656335416563744e}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354165637745}`: unknown - TODO
- `{d810e821-f86b-11d0-656335416563774f}`: unknown - TODO
- `{d810e821-f86b-11d0-656335426563634f}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354265636452}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354265636649}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354265636943}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354265637249}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354265637255}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354265637344}`: unknown - TODO
- `{d810e821-f86b-11d0-656335426563734d}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354265637351}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354265637744}`: unknown - TODO
- `{d810e821-f86b-11d0-656335436563624c}`: unknown - TODO
- `{d810e821-f86b-11d0-656335436563624d}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354365636256}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354365636352}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354365636558}`: unknown - TODO
- `{d810e821-f86b-11d0-656335436563674c}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354365636753}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354365636d54}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354365637348}`: unknown - TODO
- `{d810e821-f86b-11d0-6563354365637354}`: unknown - TODO
- `{d810e821-f86b-11d0-656336736563624c}`: unknown - TODO
- `{d810e821-f86b-11d0-656336736563624d}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636256}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636257}`: unknown - TODO
- `{d810e821-f86b-11d0-656336736563634f}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636352}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636452}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636558}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636649}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636655}`: unknown - TODO
- `{d810e821-f86b-11d0-656336736563674c}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636753}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636943}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636d41}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636d45}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365636d54}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637249}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637253}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637255}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637344}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637348}`: unknown - TODO
- `{d810e821-f86b-11d0-656336736563734c}`: unknown - TODO
- `{d810e821-f86b-11d0-656336736563734d}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637351}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637354}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637357}`: unknown - TODO
- `{d810e821-f86b-11d0-656336736563744e}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637744}`: unknown - TODO
- `{d810e821-f86b-11d0-6563367365637745}`: unknown - TODO
- `{d810e821-f86b-11d0-656336736563774f}`: unknown - TODO
- `{d810e821-f86b-11d0-656341346564614e}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646348}`: unknown - TODO
- `{d810e821-f86b-11d0-656341346564634f}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646355}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646452}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646453}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646649}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646655}`: unknown - TODO
- `{d810e821-f86b-11d0-656341346564674c}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646752}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646853}`: unknown - TODO
- `{d810e821-f86b-11d0-656341346564694e}`: Bevel Boss (Eye Candy 4000 LE plugin?)
- `{d810e821-f86b-11d0-6563413465646a49}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646d41}`: Marble (Eye Candy 4000 LE plugin?)
- `{d810e821-f86b-11d0-6563413465646d45}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465646d54}`: Motion Trail (Eye Candy 4000 LE plugin?)
- `{d810e821-f86b-11d0-656341346564734d}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465647351}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465647354}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465647357}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465647744}`: unknown - TODO
- `{d810e821-f86b-11d0-6563413465647745}`: unknown - TODO
- `{d810e821-f86b-11d0-656341346564774f}`: unknown - TODO
- `{d810e821-f86b-11d0-6572413265726a52}`: unknown - TODO
- `{d810e821-f86b-11d0-6572413278787352}`: unknown - TODO
- `{d810e821-f86b-11d0-657241327878744c}`: unknown - TODO
- `{d810e821-f86b-11d0-657241327878744d}`: unknown - TODO
- `{d810e821-f86b-11d0-657943336563614e}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636341}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636348}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636355}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636453}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636649}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636655}`: unknown - TODO
- `{d810e821-f86b-11d0-657943336563674c}`: unknown - TODO
- `{d810e821-f86b-11d0-657943336563674f}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636853}`: unknown - TODO
- `{d810e821-f86b-11d0-657943336563694e}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636a49}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636d54}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365636f55}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365637053}`: unknown - TODO
- `{d810e821-f86b-11d0-657943336563734d}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365637351}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365637354}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365637357}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365637744}`: unknown - TODO
- `{d810e821-f86b-11d0-6579433365637745}`: unknown - TODO
- `{d810e821-f86b-11d0-6669315366736257}`: unknown - TODO
- `{d810e821-f86b-11d0-6669315366736346}`: unknown - TODO
- `{d810e821-f86b-11d0-6670425066704250}`: unknown - TODO
- `{d810e821-f86b-11d0-6962367869623678}`: unknown - TODO
- `{d810e821-f86b-11d0-6962387869623878}`: unknown - TODO
- `{d810e821-f86b-11d0-6966494269664942}`: unknown - TODO
- `{d810e821-f86b-11d0-696e5434696e5434}`: unknown - TODO
- `{d810e821-f86b-11d0-6a7265306a726530}`: unknown - TODO
- `{d810e821-f86b-11d0-6a7265326a726532}`: unknown - TODO
- `{d810e821-f86b-11d0-6a7265376a726537}`: unknown - TODO
- `{d810e821-f86b-11d0-6a7265396a726539}`: unknown - TODO
- `{d810e821-f86b-11d0-6a7265646a726564}`: unknown - TODO
- `{d810e821-f86b-11d0-6c61453161717541}`: unknown - TODO
- `{d810e821-f86b-11d0-6c6145316368724f}`: unknown - TODO
- `{d810e821-f86b-11d0-6c614531636d6554}`: unknown - TODO
- `{d810e821-f86b-11d0-6c614531636f7454}`: unknown - TODO
- `{d810e821-f86b-11d0-6c61453164726f50}`: unknown - TODO
- `{d810e821-f86b-11d0-6c61453167654c31}`: unknown - TODO
- `{d810e821-f86b-11d0-6c61453169634531}`: unknown - TODO
- `{d810e821-f86b-11d0-6c6145316d657441}`: unknown - TODO
- `{d810e821-f86b-11d0-6c614531706c6153}`: unknown - TODO
- `{d810e821-f86b-11d0-6c614531736d6f4b}`: unknown - TODO
- `{d810e821-f86b-11d0-6c614531736e6f57}`: unknown - TODO
- `{d810e821-f86b-11d0-6c72453133646d41}`: unknown - TODO
- `{d810e821-f86b-11d0-6c72453233647348}`: unknown - TODO
- `{d810e821-f86b-11d0-6e69706c6e69706c}`: unknown - TODO
- `{d810e821-f86b-11d0-6e7a4e4a6e7a4e4a}`: unknown - TODO
- `{d810e821-f86b-11d0-7068546c62457665}`: unknown - TODO
- `{d810e821-f86b-11d0-73644b3173644b31}`: unknown - TODO
- `{d810e821-f86b-11d0-73644b32504c5032}`: unknown - TODO
- `{d810e821-f86b-11d0-73644b3264697353}`: unknown - TODO
- `{d810e821-f86b-11d0-73644b3967726944}`: unknown - TODO
- `{d810e821-f86b-11d0-73644b42636c724d}`: unknown - TODO
- `{d810e821-f86b-11d0-73646b3173646b31}`: unknown - TODO
- `{d810e821-f86b-11d0-7371473173676246}`: unknown - TODO
- `{d810e821-f86b-11d0-737147317367624f}`: unknown - TODO
- `{d810e821-f86b-11d0-7371473173676544}`: Edges (Alien Skin Splat LE plugin?)
- `{d810e821-f86b-11d0-7371473173676546}`: unknown - TODO
- `{d810e821-f86b-11d0-7371473173677041}`: unknown - TODO
- `{d810e821-f86b-11d0-7371473173677458}`: unknown - TODO
- `{d810e821-f86b-11d0-7666733576667335}`: unknown - TODO
- `{d810e821-f86b-11d0-7769673577696735}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e636245}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e63634c}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e63634f}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e636352}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e636449}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e63644f}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e63654c}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e63664c}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e636c49}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e636f52}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e637055}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e637252}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e637341}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e63734d}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e637354}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e316e637456}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278786252}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e327878634c}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e327878634f}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278786352}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278786357}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e327878654c}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278786558}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e327878664c}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278786c49}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278786d4f}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278787050}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278787055}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278787354}`: unknown - TODO
- `{d810e821-f86b-11d0-78654e3278787456}`: unknown - TODO
- `{dd54adc0-a279-11d3-b92a000502f3fdbe}`: Color Fill
- `{e4c0f4bc-c0a3-4cb3-b3513822027e4d9f}`: Add Noise
- `{f1cfce41-718e-11d1-8c8200a024cdc039}`: Blur
- `{f1cfce42-718e-11d1-8c8200a024cdc039}`: Blur More
- `{f1cfce44-718e-11d1-8c8200a024cdc039}`: Unsharp Mask
- `{fc7093f1-f95c-11d0-8be200a024cdc039}`: Find Edges
- `{ff84d00c-4494-11d8-a072000a9582f7d4}`: Clouds

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`EmbossFaceColor`"

[`DCEv` "`EmbossFaceColor`"]: #dcev-embossfacecolor

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

A colour in "#rrggbbaa" format

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Frame2_SS_MarginID`"

[`DCEv` "`Frame2_SS_MarginID`"]: #dcev-frame2-ss-marginid

Parent: [`DTAv`]

Values:

- `5`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Frame2_SS_OverhangID`"

[`DCEv` "`Frame2_SS_OverhangID`"]: #dcev-frame2-ss-overhangid

Parent: [`DTAv`]

Values:

- `10`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Frame2_SS_WidthID`"

[`DCEv` "`Frame2_SS_WidthID`"]: #dcev-frame2-ss-widthid

Parent: [`DTAv`]

Values:

- `10`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Frame3_SS_MarginID`"

[`DCEv` "`Frame3_SS_MarginID`"]: #dcev-frame3-ss-marginid

Parent: [`DTAv`]

Values:

- `5`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Frame3_SS_OverhangID`"

[`DCEv` "`Frame3_SS_OverhangID`"]: #dcev-frame3-ss-overhangid

Parent: [`DTAv`]

Values:

- `15`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Frame3_SS_WidthID`"

[`DCEv` "`Frame3_SS_WidthID`"]: #dcev-frame3-ss-widthid

Parent: [`DTAv`]

Values:

- `5`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Frame_SS_FillPattern`"

[`DCEv` "`Frame_SS_FillPattern`"]: #dcev-frame-ss-fillpattern

Parent: [`DTAv`]

Values:

- `Sienna`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Frame_SS_WidthID`"

[`DCEv` "`Frame_SS_WidthID`"]: #dcev-frame-ss-widthid

Parent: [`DTAv`]

Values:

- `24`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`GlowStartDistance`"

[`DCEv` "`GlowStartDistance`"]: #dcev-glowstartdistance

Parent: [`EPSv`]

Used by "Glow" filter. Set by "Inner Bevel", "Inner Glow", "Inset Emboss", "Outer Bevel", "Raised Emboss" but ignored.

Observed value range: `0`..`35`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`GlowWidth`"

[`DCEv` "`GlowWidth`"]: #dcev-glowwidth

Parent: [`EPSv`]

Used by "Glow" filter. Set by "Inner Bevel", "Inner Glow", "Inset Emboss", "Outer Bevel", "Raised Emboss" but ignored.

Observed value range: `0`..`35`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`HiliteColor`"

[`DCEv` "`HiliteColor`"]: #dcev-hilitecolor

Parent: [`EPSv`]

Used by "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters. Set by "Glow" but ignored.

A colour in "#rrggbb" format

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`HitBlendColor`"

[`DCEv` "`HitBlendColor`"]: #dcev-hitblendcolor

Parent: [`EPSv`]

Used by "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters. Set by "Glow" but ignored.

A colour in "#rrggbbaa" format to apply when button is in the "hit" (hover) state

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`LightAngle`"

[`DCEv` "`LightAngle`"]: #dcev-lightangle

Parent: [`EPSv`]

Used by "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters. Set by "Glow" but ignored.

Value range: `0`..`360` (degrees)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`LightDistance`"

[`DCEv` "`LightDistance`"]: #dcev-lightdistance

Parent: [`EPSv`]

Used by "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters. Set by "Glow" but ignored.

Observed value range: `1`..`1299`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`MB_filter_preview_tile_size`"

[`DCEv` "`MB_filter_preview_tile_size`"]: #dcev-mb-filter-preview-tile-size

Parent: [`EPSv`]

Values:

- `-1 -1`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`MaskSoftness`"

[`DCEv` "`MaskSoftness`"]: #dcev-masksoftness

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inner Glow", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Observed value range: `0`..`60`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`Opacity`"

[`DCEv` "`Opacity`"]: #dcev-opacity

Parent: [`EPSv`]

Used by "Color Fill" filter.

Value range: `0`..`100` (percent)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`OuterBevelColor`"

[`DCEv` "`OuterBevelColor`"]: #dcev-outerbevelcolor

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inner Glow", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

A colour in "#rrggbb" format. In "glow" mode, this sets the glow colour.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ShadowAngle`"

[`DCEv` "`ShadowAngle`"]: #dcev-shadowangle

Parent: [`EPSv`]

Used by "Drop Shadow", "Inner Shadow" filters.

Value range: `0`..`360` (degrees)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ShadowBlur`"

[`DCEv` "`ShadowBlur`"]: #dcev-shadowblur

Parent: [`EPSv`]

Used by "Drop Shadow", "Inner Shadow" filters.

Observed value range: `0`..`62`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ShadowColor`"

[`DCEv` "`ShadowColor`"]: #dcev-shadowcolor

Parent: [`EPSv`]

Used by "Drop Shadow", "Inner Bevel", "Inset Emboss", "Inner Shadow", "Outer Bevel", "Raised Emboss" filters. Set by "Glow" but ignored.

A colour in "#rrggbbaa" or "#rrggbb" format

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ShadowDistance`"

[`DCEv` "`ShadowDistance`"]: #dcev-shadowdistance

Parent: [`EPSv`]

Used by "Drop Shadow", "Inner Shadow" filters.

Observed value range: `0`..`122`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ShadowType`"

[`DCEv` "`ShadowType`"]: #dcev-shadowtype

Parent: [`EPSv`]

Used by "Drop Shadow", "Inner Shadow" filters.

Values:

- `0`: normal
- `1`: knockout

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ShowObject`"

[`DCEv` "`ShowObject`"]: #dcev-showobject

Parent: [`EPSv`]

Used by "Inset Emboss", "Raised Emboss" filters. Set by "Glow", "Inner Bevel", and "Outer Bevel" but ignored.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`SlopeMultiplier`"

[`DCEv` "`SlopeMultiplier`"]: #dcev-slopemultiplier

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Observed value range: `1`..`1`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`SlopeType`"

[`DCEv` "`SlopeType`"]: #dcev-slopetype

Parent: [`EPSv`]

Used by "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters. Set by "Glow" but ignored. Note that these transformations have different ranges; Fireworks maintains the maximum gradient as a constant between functions.

Values:

- `0`: flat (`0 1`)
- `1`: smooth (quadratic: `v * (1 - v / 2)`)
- `2`: smooth inverted (quadratic: `v * v / 2`)
- `3`: zigzag (0 &rarr; 0; &frac23; &rarr; &frac23;; 1 &rarr; &frac13;)
- `4`: zigzag 2 (0 &rarr; 0; 0.4 &rarr; 0.4; 0.7 &rarr; 0.4; 1 &rarr; 0.1)
- `5`: ring (`sin(v * pi) / pi`)
- `6`: ruffle (`abs(sin(v * 3 * pi)) / (3 * pi)`)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`add_noise_amount`"

[`DCEv` "`add_noise_amount`"]: #dcev-add-noise-amount

Parent: [`EPSv`]

Used by "Add Noise" filter.

Value range: `0`..`400` (percent)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`add_noise_use_color`"

[`DCEv` "`add_noise_use_color`"]: #dcev-add-noise-use-color

Parent: [`EPSv`]

Used by "Add Noise" filter.

Values:

- `false`: use grayscale noise
- `true`: use rgb noise

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`alrtmsg`"

[`DCEv` "`alrtmsg`"]: #dcev-alrtmsg

Parent: [`DTAv`]

Internal data used by Star autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`alrtmsg`"."`maxmsg`"

[`DCEv` "`alrtmsg`"."`maxmsg`"]: #dcev-alrtmsg-maxmsg

Parent: [`GDTv`]

Internal data used by Star autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`alrtmsg`"."`minmsg`"

[`DCEv` "`alrtmsg`"."`minmsg`"]: #dcev-alrtmsg-minmsg

Parent: [`GDTv`]

Internal data used by Star autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`angle`"

[`DCEv` "`angle`"]: #dcev-angle

Parent: [`EPSv`]

Used by "Solid Shadow" filter.

Value range: `0`..`360` (degrees)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`arrowLength`"

[`DCEv` "`arrowLength`"]: #dcev-arrowlength

Parent: [`DTAv`]

Internal data used by Arrow autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`arrowTip`"

[`DCEv` "`arrowTip`"]: #dcev-arrowtip

Parent: [`DTAv`]

Internal data used by Arrow autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`arrowWidth`"

[`DCEv` "`arrowWidth`"]: #dcev-arrowwidth

Parent: [`DTAv`]

Internal data used by Arrow autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`atMin`"

[`DCEv` "`atMin`"]: #dcev-atmin

Parent: [`DTAv`]

Internal data used by Arrow autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`awMin`"

[`DCEv` "`awMin`"]: #dcev-awmin

Parent: [`DTAv`]

Internal data used by Arrow autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`bevelEmboss`"

[`DCEv` "`bevelEmboss`"]: #dcev-bevelemboss

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Bevel and Emboss".

This is an "&"-separated string, for example:

```text
0&0&0&0&0&75.000000&75.000000&120.000000&30.000000&100.000000&5.000000&0.000000&screen&RGBColor;255.000000;255.000000;255.000000&multiply&RGBColor;0.000000;0.000000;0.000000&softMatte&innerBevel&stampIn&2$$0.000000;0.000000;1$255.000000;255.000000;1&noshape&notexture
```

Fields:

1. Unknown (`0` / `1`)
2. Unknown (always `0`)
3. Unknown (always `0`)
4. Unknown (always `0`)
5. Unknown (always `0`)
6. Unknown number
7. Unknown number
8. Angle (`-180.0`..`180.0`)
9. Unknown number (always `30.0`)
10. Depth (`1.0`..`1000.0`)
11. Size (`0.0`..`250.0`)
12. Soften (`0`..`16`)
13. Highlight: "normal" / "screen" / "multiply" / etc.
14. Highlight colour `RGBColor;<r>;<g>;<b>`
15. Shadow: "normal" / "screen" / "multiply" / etc.
16. Shadow colour `RGBColor;<r>;<g>;<b>`
17. Unknown "softMatte" / "preciseMatte"
18. Style "outerBevel" / "innerBevel" / [guessed: "emboss" / "pillowEmboss" / "strokeEmboss"]
19. Unknown "stampIn" / "stampOut"
20. Unknown; always `2$$0.000000;0.000000;1$255.000000;255.000000;1` - maybe colour space related?
21. Unknown; always "noshape"
22. Unknown; always "notexture"

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`blue_points`"

[`DCEv` "`blue_points`"]: #dcev-blue-points

Parent: [`EPSv`]

Used by "Curves" filter.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GPLv`] Grab Point List

### `DCEv` "`brightness_amount`"

[`DCEv` "`brightness_amount`"]: #dcev-brightness-amount

Parent: [`EPSv`]

Used by "Brightness/Contrast" filter. Though it looks like a percentage due to the range permitted in the UI, this is actually a raw value to add to the pixel values (meaning it has an effective range of -39%..+39%). The value is added to the red, green, and blue channels independently.

Value range: `-100`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`c2y`"

[`DCEv` "`c2y`"]: #dcev-c2y

Parent: [`DTAv`]

Internal data used by Spiral autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`category`"

[`DCEv` "`category`"]: #dcev-category

Parent: [`EPSv`]

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`clockwise`"

[`DCEv` "`clockwise`"]: #dcev-clockwise

Parent: [`DTAv`]

Internal data used by Spiral autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`cloud_color`"

[`DCEv` "`cloud_color`"]: #dcev-cloud-color

Parent: [`EPSv`]

Used by "Clouds" filter.

A colour in "#rrggbb" format

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`color`"

[`DCEv` "`color`"]: #dcev-color

Parent: [`EPSv`]

Used by "Solid Shadow" filter.

A colour in "#rrggbbaa" or "#rrggbb" format

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`constants`"

[`DCEv` "`constants`"]: #dcev-constants

Parent: [`DTAv`]

Internal data used by Star, Spiral autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`constants`"."`maxB`"

[`DCEv` "`constants`"."`maxB`"]: #dcev-constants-maxb

Parent: [`GDTv`]

Internal data used by Spiral autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`constants`"."`maxNodes`"

[`DCEv` "`constants`"."`maxNodes`"]: #dcev-constants-maxnodes

Parent: [`GDTv`]

Internal data used by Star, Polygon autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`constants`"."`minB`"

[`DCEv` "`constants`"."`minB`"]: #dcev-constants-minb

Parent: [`GDTv`]

Internal data used by Spiral autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`constants`"."`minNodes`"

[`DCEv` "`constants`"."`minNodes`"]: #dcev-constants-minnodes

Parent: [`GDTv`]

Internal data used by Star, Polygon autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`constants`"."`ppc`"

[`DCEv` "`constants`"."`ppc`"]: #dcev-constants-ppc

Parent: [`GDTv`]

Internal data used by Spiral autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`contrast_amount`"

[`DCEv` "`contrast_amount`"]: #dcev-contrast-amount

Parent: [`EPSv`]

Used by "Brightness/Contrast" filter. This is applied _after_ [`DCEv`."`brightness_amount`"], operating on each channel independently and using a centre-point of 112 rather than 128. This might be by splitting the input into 2 linear ranges, but can also be approximated by pre-applying a gamma of 0.842 and reversing it (with 1.187) afterwards.
The behaviour is quite linear, but has a few discontinuities:

- Between `-100` and `0` this linearly interpolates from 112 to the original colour.
- From `0` to `87.5` the input range is reduced linearly on each side of 112 (i.e. at 50%, the input ranges is `56`..`184`, mapped to `0`..`255`).
- From `87.5` to `99` the behaviour is the same but the range increases more slowly, reaching `98`..`130` at 99%.
- At `100` this has a discontinuity and switches to `v >= 112 ? 255 : 0`.

Value range: `-100`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`corner0`"

[`DCEv` "`corner0`"]: #dcev-corner0

Parent: [`DTAv`]

Internal data used by Rounded Rectangle autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`corner1`"

[`DCEv` "`corner1`"]: #dcev-corner1

Parent: [`DTAv`]

Internal data used by Rounded Rectangle, Connector Line autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`corner2`"

[`DCEv` "`corner2`"]: #dcev-corner2

Parent: [`DTAv`]

Internal data used by Rounded Rectangle, Connector Line autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`corner3`"

[`DCEv` "`corner3`"]: #dcev-corner3

Parent: [`DTAv`]

Internal data used by Rounded Rectangle autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`css`"

[`DCEv` "`css`"]: #dcev-css

Parent: [`DTAv`]

Values:

- ``: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ctype0`"

[`DCEv` "`ctype0`"]: #dcev-ctype0

Parent: [`DTAv`]

Values:

- `1`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ctype1`"

[`DCEv` "`ctype1`"]: #dcev-ctype1

Parent: [`DTAv`]

Values:

- `1`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ctype2`"

[`DCEv` "`ctype2`"]: #dcev-ctype2

Parent: [`DTAv`]

Values:

- `1`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ctype3`"

[`DCEv` "`ctype3`"]: #dcev-ctype3

Parent: [`DTAv`]

Values:

- `1`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`currentValues`"

[`DCEv` "`currentValues`"]: #dcev-currentvalues

Parent: [`DTAv`]

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value
- [`GVRv`]? Dictionary Value Array

### `DCEv` "`currentValues`"\[\]."`name`"

[`DCEv` "`currentValues`"\[\]."`name`"]: #dcev-currentvalues-name

Parent: [`GDTv`]

Values:

- `Color`: unknown - TODO
- `Cursor`: unknown - TODO
- `Fill Color`: unknown - TODO
- `Font`: unknown - TODO
- `Label`: unknown - TODO
- `MXML`: unknown - TODO
- `Show Close`: unknown - TODO
- `Show content`: unknown - TODO
- `State`: unknown - TODO
- `State (Down)`: unknown - TODO
- `State (Left)`: unknown - TODO
- `State (Right)`: unknown - TODO
- `State (Thumb)`: unknown - TODO
- `State (Track)`: unknown - TODO
- `State (Up)`: unknown - TODO
- `Thumb State`: unknown - TODO
- `Thumb Type`: unknown - TODO
- `borderColor`: unknown - TODO
- `buttonType`: unknown - TODO
- `color`: unknown - TODO
- `disabledColor`: unknown - TODO
- `editable`: unknown - TODO
- `enabled`: unknown - TODO
- `label`: unknown - TODO
- `selected`: unknown - TODO
- `text`: unknown - TODO
- `textFieldType`: unknown - TODO
- `textRollOverColor`: unknown - TODO
- `textSelectedColor`: unknown - TODO
- `title`: unknown - TODO
- `value`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`currentValues`"\[\]."`type`"

[`DCEv` "`currentValues`"\[\]."`type`"]: #dcev-currentvalues-type

Parent: [`GDTv`]

Values:

- `Boolean`: unknown - TODO
- `Color`: unknown - TODO
- `ComboBox`: unknown - TODO
- `MXML`: unknown - TODO
- `Text`: unknown - TODO
- `boolean`: unknown - TODO
- `color`: unknown - TODO
- `combobox`: unknown - TODO
- `font`: unknown - TODO
- `mxml`: unknown - TODO
- `number`: unknown - TODO
- `text`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`currentValues`"\[\]."`value`"

[`DCEv` "`currentValues`"\[\]."`value`"]: #dcev-currentvalues-value

Parent: [`GDTv`]

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`curvature`"

[`DCEv` "`curvature`"]: #dcev-curvature

Parent: [`DTAv`]

Observed value range: `6.9999956375149095`..`6.9999956375149095`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`curveRatio`"

[`DCEv` "`curveRatio`"]: #dcev-curveratio

Parent: [`DTAv`]

Observed value range: `0.3695652173913043`..`0.3695652173913043`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`custData`"

[`DCEv` "`custData`"]: #dcev-custdata

Parent: [`DTAv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`custData`"."`box`"

[`DCEv` "`custData`"."`box`"]: #dcev-custdata-box

Parent: [`GDTv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`custData`"."`head1`"

[`DCEv` "`custData`"."`head1`"]: #dcev-custdata-head1

Parent: [`GDTv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`custData`"."`head2`"

[`DCEv` "`custData`"."`head2`"]: #dcev-custdata-head2

Parent: [`GDTv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`custData`"."`none`"

[`DCEv` "`custData`"."`none`"]: #dcev-custdata-none

Parent: [`GDTv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`custData`"."`tail`"

[`DCEv` "`custData`"."`tail`"]: #dcev-custdata-tail

Parent: [`GDTv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dest_high_blue`"

[`DCEv` "`dest_high_blue`"]: #dcev-dest-high-blue

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dest_high_green`"

[`DCEv` "`dest_high_green`"]: #dcev-dest-high-green

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dest_high_red`"

[`DCEv` "`dest_high_red`"]: #dcev-dest-high-red

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dest_high_rgb`"

[`DCEv` "`dest_high_rgb`"]: #dcev-dest-high-rgb

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dest_low_blue`"

[`DCEv` "`dest_low_blue`"]: #dcev-dest-low-blue

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dest_low_green`"

[`DCEv` "`dest_low_green`"]: #dcev-dest-low-green

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dest_low_red`"

[`DCEv` "`dest_low_red`"]: #dcev-dest-low-red

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dest_low_rgb`"

[`DCEv` "`dest_low_rgb`"]: #dcev-dest-low-rgb

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`distance`"

[`DCEv` "`distance`"]: #dcev-distance

Parent: [`EPSv`]

Used by "Solid Shadow" filter.

Observed value range: `1`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`dropShadow`"

[`DCEv` "`dropShadow`"]: #dcev-dropshadow

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Drop Shadow".

This is an "&"-separated string, for example:

```text
0&75.000000&0&120.000000&0.000000&5.000000&5.000000&74.000000&0&1&multiply&RGBColor;0.000000;0.000000;0.000000&2$$0.000000;0.000000;1$255.000000;255.000000;1
```

Fields:

1. Unknown (`0` / `1`)
2. Unknown number (`0.0`..`100.0`)
3. Unknown (always `0`)
4. Angle (`-180.0`..`180.0`)
5. Spread (`0.0`..`100.0`)
6. Unknown number (`1.0`..`250.0`) - matches Size except min is 1.0
7. Size (`0.0`..`250.0`)
8. Unknown (always `0`)
9. Unknown (`0` / `1`)
10. Blend mode ("multiply")
11. Colour `RGBColor;<r>;<g>;<b>`
12. Unknown; always `2$$0.000000;0.000000;1$255.000000;255.000000;1` - maybe colour space related?

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_have_scripting_data`"

[`DCEv` "`external_filter_have_scripting_data`"]: #dcev-external-filter-have-scripting-data

Parent: [`EPSv`]

Values:

- `true`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__0x436c7220`"

[`DCEv` "`external_filter_key__0x436c7220`"]: #dcev-external-filter-key-0x436c7220

Parent: [`EPSv`]

Hex in key translates to `Clr `. Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__0x45646720`"

[`DCEv` "`external_filter_key__0x45646720`"]: #dcev-external-filter-key-0x45646720

Parent: [`EPSv`]

Hex in key translates to `Edg `.

Values:

- `false`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__0x46637320`"

[`DCEv` "`external_filter_key__0x46637320`"]: #dcev-external-filter-key-0x46637320

Parent: [`EPSv`]

Hex in key translates to `Fcs `.

Observed value range: `-60`..`40`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__0x466c2020`"

[`DCEv` "`external_filter_key__0x466c2020`"]: #dcev-external-filter-key-0x466c2020

Parent: [`EPSv`]

Hex in key translates to `Fl  `.

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BEvl`"

[`DCEv` "`external_filter_key__BEvl`"]: #dcev-external-filter-key-bevl

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BMbs`"

[`DCEv` "`external_filter_key__BMbs`"]: #dcev-external-filter-key-bmbs

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BMbv`"

[`DCEv` "`external_filter_key__BMbv`"]: #dcev-external-filter-key-bmbv

Parent: [`EPSv`]

Observed value range: `29`..`29`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BMde`"

[`DCEv` "`external_filter_key__BMde`"]: #dcev-external-filter-key-bmde

Parent: [`EPSv`]

Observed value range: `65`..`65`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BMdi`"

[`DCEv` "`external_filter_key__BMdi`"]: #dcev-external-filter-key-bmdi

Parent: [`EPSv`]

Observed value range: `336`..`336`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BMgd`"

[`DCEv` "`external_filter_key__BMgd`"]: #dcev-external-filter-key-bmgd

Parent: [`EPSv`]

Observed value range: `56`..`56`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BMgw`"

[`DCEv` "`external_filter_key__BMgw`"]: #dcev-external-filter-key-bmgw

Parent: [`EPSv`]

Observed value range: `39`..`39`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BMmo`"

[`DCEv` "`external_filter_key__BMmo`"]: #dcev-external-filter-key-bmmo

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__BMsm`"

[`DCEv` "`external_filter_key__BMsm`"]: #dcev-external-filter-key-bmsm

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Brgh`"

[`DCEv` "`external_filter_key__Brgh`"]: #dcev-external-filter-key-brgh

Parent: [`EPSv`]

Observed value range: `68`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Cntr`"

[`DCEv` "`external_filter_key__Cntr`"]: #dcev-external-filter-key-cntr

Parent: [`EPSv`]

Observed value range: `0`..`58`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Drct`"

[`DCEv` "`external_filter_key__Drct`"]: #dcev-external-filter-key-drct

Parent: [`EPSv`]

Observed value range: `0`..`180`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Drkn`"

[`DCEv` "`external_filter_key__Drkn`"]: #dcev-external-filter-key-drkn

Parent: [`EPSv`]

Observed value range: `0`..`0`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__FLsi`"

[`DCEv` "`external_filter_key__FLsi`"]: #dcev-external-filter-key-flsi

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__FRcl`"

[`DCEv` "`external_filter_key__FRcl`"]: #dcev-external-filter-key-frcl

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__FlCl`"

[`DCEv` "`external_filter_key__FlCl`"]: #dcev-external-filter-key-flcl

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__GLcl`"

[`DCEv` "`external_filter_key__GLcl`"]: #dcev-external-filter-key-glcl

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__GRsh`"

[`DCEv` "`external_filter_key__GRsh`"]: #dcev-external-filter-key-grsh

Parent: [`EPSv`]

Observed value range: `35`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__INcl`"

[`DCEv` "`external_filter_key__INcl`"]: #dcev-external-filter-key-incl

Parent: [`EPSv`]

Observed value range: `45`..`81.86989773939402`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Lngt`"

[`DCEv` "`external_filter_key__Lngt`"]: #dcev-external-filter-key-lngt

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Mask`"

[`DCEv` "`external_filter_key__Mask`"]: #dcev-external-filter-key-mask

Parent: [`EPSv`]

Values:

- `true`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__NLnl`"

[`DCEv` "`external_filter_key__NLnl`"]: #dcev-external-filter-key-nlnl

Parent: [`EPSv`]

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Opct`"

[`DCEv` "`external_filter_key__Opct`"]: #dcev-external-filter-key-opct

Parent: [`EPSv`]

Observed value range: `0`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__PSfo`"

[`DCEv` "`external_filter_key__PSfo`"]: #dcev-external-filter-key-psfo

Parent: [`EPSv`]

Observed value range: `49`..`49`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__PSmo`"

[`DCEv` "`external_filter_key__PSmo`"]: #dcev-external-filter-key-psmo

Parent: [`EPSv`]

Values:

- `false`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__PSob`"

[`DCEv` "`external_filter_key__PSob`"]: #dcev-external-filter-key-psob

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__PSpb`"

[`DCEv` "`external_filter_key__PSpb`"]: #dcev-external-filter-key-pspb

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__PSrs`"

[`DCEv` "`external_filter_key__PSrs`"]: #dcev-external-filter-key-psrs

Parent: [`EPSv`]

Values:

- `false`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__REfr`"

[`DCEv` "`external_filter_key__REfr`"]: #dcev-external-filter-key-refr

Parent: [`EPSv`]

Observed value range: `45`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__RPwi`"

[`DCEv` "`external_filter_key__RPwi`"]: #dcev-external-filter-key-rpwi

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__RndS`"

[`DCEv` "`external_filter_key__RndS`"]: #dcev-external-filter-key-rnds

Parent: [`EPSv`]

Observed value range: `1`..`243`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__RplS`"

[`DCEv` "`external_filter_key__RplS`"]: #dcev-external-filter-key-rpls

Parent: [`EPSv`]

Observed value range: `0`..`0`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__SHpa`"

[`DCEv` "`external_filter_key__SHpa`"]: #dcev-external-filter-key-shpa

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__SHpb`"

[`DCEv` "`external_filter_key__SHpb`"]: #dcev-external-filter-key-shpb

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__SHpc`"

[`DCEv` "`external_filter_key__SHpc`"]: #dcev-external-filter-key-shpc

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__SHpd`"

[`DCEv` "`external_filter_key__SHpd`"]: #dcev-external-filter-key-shpd

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__SHpe`"

[`DCEv` "`external_filter_key__SHpe`"]: #dcev-external-filter-key-shpe

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__SHpf`"

[`DCEv` "`external_filter_key__SHpf`"]: #dcev-external-filter-key-shpf

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__SHpg`"

[`DCEv` "`external_filter_key__SHpg`"]: #dcev-external-filter-key-shpg

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__SHph`"

[`DCEv` "`external_filter_key__SHph`"]: #dcev-external-filter-key-shph

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__STre`"

[`DCEv` "`external_filter_key__STre`"]: #dcev-external-filter-key-stre

Parent: [`EPSv`]

Observed value range: `100`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Shrp`"

[`DCEv` "`external_filter_key__Shrp`"]: #dcev-external-filter-key-shrp

Parent: [`EPSv`]

Observed value range: `25`..`99`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Smth`"

[`DCEv` "`external_filter_key__Smth`"]: #dcev-external-filter-key-smth

Parent: [`EPSv`]

Observed value range: `0`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Sppa`"

[`DCEv` "`external_filter_key__Sppa`"]: #dcev-external-filter-key-sppa

Parent: [`EPSv`]

Observed value range: `0.2060783638783466`..`0.2060783638783466`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Sppb`"

[`DCEv` "`external_filter_key__Sppb`"]: #dcev-external-filter-key-sppb

Parent: [`EPSv`]

Observed value range: `0.8093332915198681`..`0.8093332915198681`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Sppc`"

[`DCEv` "`external_filter_key__Sppc`"]: #dcev-external-filter-key-sppc

Parent: [`EPSv`]

Observed value range: `0.1525414702284726`..`0.1525414702284726`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Sppd`"

[`DCEv` "`external_filter_key__Sppd`"]: #dcev-external-filter-key-sppd

Parent: [`EPSv`]

Observed value range: `0.8099199043537173`..`0.8099199043537173`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Sppe`"

[`DCEv` "`external_filter_key__Sppe`"]: #dcev-external-filter-key-sppe

Parent: [`EPSv`]

Observed value range: `0.014812047740113002`..`0.014812047740113002`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Sppf`"

[`DCEv` "`external_filter_key__Sppf`"]: #dcev-external-filter-key-sppf

Parent: [`EPSv`]

Observed value range: `-0.015200676470588231`..`-0.015200676470588231`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Sppg`"

[`DCEv` "`external_filter_key__Sppg`"]: #dcev-external-filter-key-sppg

Parent: [`EPSv`]

Observed value range: `0.010748909113519809`..`0.010748909113519809`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Spph`"

[`DCEv` "`external_filter_key__Spph`"]: #dcev-external-filter-key-spph

Parent: [`EPSv`]

Observed value range: `-0.015817225285350095`..`-0.015817225285350095`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TApe`"

[`DCEv` "`external_filter_key__TApe`"]: #dcev-external-filter-key-tape

Parent: [`EPSv`]

Observed value range: `40`..`40`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEbr`"

[`DCEv` "`external_filter_key__TEbr`"]: #dcev-external-filter-key-tebr

Parent: [`EPSv`]

Observed value range: `0`..`0`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEcu`"

[`DCEv` "`external_filter_key__TEcu`"]: #dcev-external-filter-key-tecu

Parent: [`EPSv`]

Observed value range: `0`..`0`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEec`"

[`DCEv` "`external_filter_key__TEec`"]: #dcev-external-filter-key-teec

Parent: [`EPSv`]

Values:

- `false`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEgo`"

[`DCEv` "`external_filter_key__TEgo`"]: #dcev-external-filter-key-tego

Parent: [`EPSv`]

Observed value range: `0`..`44`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEgs`"

[`DCEv` "`external_filter_key__TEgs`"]: #dcev-external-filter-key-tegs

Parent: [`EPSv`]

Observed value range: `0`..`8`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEsc`"

[`DCEv` "`external_filter_key__TEsc`"]: #dcev-external-filter-key-tesc

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEss`"

[`DCEv` "`external_filter_key__TEss`"]: #dcev-external-filter-key-tess

Parent: [`EPSv`]

Observed value range: `5`..`15`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEst`"

[`DCEv` "`external_filter_key__TEst`"]: #dcev-external-filter-key-test

Parent: [`EPSv`]

Observed value range: `0`..`4`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEth`"

[`DCEv` "`external_filter_key__TEth`"]: #dcev-external-filter-key-teth

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TEvs`"

[`DCEv` "`external_filter_key__TEvs`"]: #dcev-external-filter-key-tevs

Parent: [`EPSv`]

Observed value range: `0`..`0`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TIna`"

[`DCEv` "`external_filter_key__TIna`"]: #dcev-external-filter-key-tina

Parent: [`EPSv`]

Observed value range: `40`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TInc`"

[`DCEv` "`external_filter_key__TInc`"]: #dcev-external-filter-key-tinc

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__TxtF`"

[`DCEv` "`external_filter_key__TxtF`"]: #dcev-external-filter-key-txtf

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__WAve`"

[`DCEv` "`external_filter_key__WAve`"]: #dcev-external-filter-key-wave

Parent: [`EPSv`]

Observed value range: `23`..`23`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__Wdth`"

[`DCEv` "`external_filter_key__Wdth`"]: #dcev-external-filter-key-wdth

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__blur`"

[`DCEv` "`external_filter_key__blur`"]: #dcev-external-filter-key-blur

Parent: [`EPSv`]

Observed value range: `0`..`0`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__bvlS`"

[`DCEv` "`external_filter_key__bvlS`"]: #dcev-external-filter-key-bvls

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__sdwC`"

[`DCEv` "`external_filter_key__sdwC`"]: #dcev-external-filter-key-sdwc

Parent: [`EPSv`]

Unknown data storage.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`external_filter_key__sdwO`"

[`DCEv` "`external_filter_key__sdwO`"]: #dcev-external-filter-key-sdwo

Parent: [`EPSv`]

Observed value range: `82`..`82`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`flexClassName`"

[`DCEv` "`flexClassName`"]: #dcev-flexclassname

Parent: [`DTAv`]

Values:

- `Accordion`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`focalLength`"

[`DCEv` "`focalLength`"]: #dcev-focallength

Parent: [`DTAv`]

Used internally by "3D Box" autoshape.

Observed value range: `300`..`300`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`gamma_blue`"

[`DCEv` "`gamma_blue`"]: #dcev-gamma-blue

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0.1`..`10`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`gamma_green`"

[`DCEv` "`gamma_green`"]: #dcev-gamma-green

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0.1`..`10`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`gamma_red`"

[`DCEv` "`gamma_red`"]: #dcev-gamma-red

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0.1`..`10`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`gamma_rgb`"

[`DCEv` "`gamma_rgb`"]: #dcev-gamma-rgb

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0.1`..`10`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`gaussian_blur_radius`"

[`DCEv` "`gaussian_blur_radius`"]: #dcev-gaussian-blur-radius

Parent: [`EPSv`]

Used by "Gaussian Blur" filter.

Observed value range: `0.1`..`250`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`gradientFill`"

[`DCEv` "`gradientFill`"]: #dcev-gradientfill

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Gradient Overlay".

This is an "&"-separated string, for example:

```text
0&0&1&100.000000&90.000000&100.000000&0.000000&0.000000&normal&linear&Two_Color,customStops,4096.000000$2$2,0$50$userStop$RGBColor;0.000000;0.000000;0.000000,4096$50$userStop$RGBColor;255.000000;255.000000;255.000000,100.000000$0$50,100.000000$4096$50
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`green_points`"

[`DCEv` "`green_points`"]: #dcev-green-points

Parent: [`EPSv`]

Used by "Curves" filter.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GPLv`] Grab Point List

### `DCEv` "`height`"

[`DCEv` "`height`"]: #dcev-height

Parent: [`DTAv`]

Internal data used by Connector Line autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`hls_colorize`"

[`DCEv` "`hls_colorize`"]: #dcev-hls-colorize

Parent: [`EPSv`]

Used by "Hue/Saturation" filter.

Values:

- `0`: adjust existing pixel hue
- `1`: replace pixel hue
- `false`: adjust existing pixel hue
- `true`: replace pixel hue

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`html`"

[`DCEv` "`html`"]: #dcev-html

Parent: [`DTAv`]

HTML to use in place of this symbol when exporting as a page.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`hue_amount`"

[`DCEv` "`hue_amount`"]: #dcev-hue-amount

Parent: [`EPSv`]

Used by "Hue/Saturation" filter.

Value range: `-180`..`180` (degrees), or `0`..`360` (degrees) if [`DCEv` "`hls_colorize`"] is `true`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`innerGlow`"

[`DCEv` "`innerGlow`"]: #dcev-innerglow

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Inner Glow".

This is an "&"-separated string, for example:

```text
0&0&screen&75.000000:0.000000:5.000000:0.000000:0.000000:50.000000&softMatte&RGBColor;255.000000;255.000000;189.996109&nogradient&2$$0.000000;0.000000;1$255.000000;255.000000;1&edgeGlow
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`innerRatio`"

[`DCEv` "`innerRatio`"]: #dcev-innerratio

Parent: [`DTAv`]

Observed value range: `0`..`0`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`innerShadow`"

[`DCEv` "`innerShadow`"]: #dcev-innershadow

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Inner Shadow".

This is an "&"-separated string, for example:

```text
0&75.000000&0&-135.000000&0.000000&5.000000&5.000000&0.000000&0&0&multiply&RGBColor;0.000000;0.000000;0.000000&2$$0.000000;0.000000;1$255.000000;255.000000;1
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`lastMouse`"

[`DCEv` "`lastMouse`"]: #dcev-lastmouse

Parent: [`DTAv`]

Used internally by "3D Box" autoshape.

A mouse coordinate recorded as `{x:0, y:0}`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`lastMouseAngle`"

[`DCEv` "`lastMouseAngle`"]: #dcev-lastmouseangle

Parent: [`DTAv`]

Used internally by "3D Box" autoshape.

Observed value range: `2.677945044588987`..`2.677945044588987`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`lightness_amount`"

[`DCEv` "`lightness_amount`"]: #dcev-lightness-amount

Parent: [`EPSv`]

Used by "Hue/Saturation" filter.

Value range: `-100`..`100` (percent)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`lineAngle`"

[`DCEv` "`lineAngle`"]: #dcev-lineangle

Parent: [`DTAv`]

Observed value range: `-0.26884042763972626`..`-0.26884042763972626`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`locX`"

[`DCEv` "`locX`"]: #dcev-locx

Parent: [`DTAv`]

Observed value range: `172`..`172`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`locY`"

[`DCEv` "`locY`"]: #dcev-locy

Parent: [`DTAv`]

Observed value range: `290`..`290`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`locked`"

[`DCEv` "`locked`"]: #dcev-locked

Parent: [`DTAv`]

Internal data used by Rounded Rectangle autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`maxNodes`"

[`DCEv` "`maxNodes`"]: #dcev-maxnodes

Parent: [`DTAv`]

Internal data used by Polygon autoshape (duplicated in [`DCEv` "`constants`"."`maxNodes`"]).

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`minNodes`"

[`DCEv` "`minNodes`"]: #dcev-minnodes

Parent: [`DTAv`]

Internal data used by Polygon autoshape (duplicated in [`DCEv` "`constants`"."`minNodes`"]).

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`mkbFile_WriteOnly_TemporaryEffectUiName`"

[`DCEv` "`mkbFile_WriteOnly_TemporaryEffectUiName`"]: #dcev-mkbfile-writeonly-temporaryeffectuiname

Parent: [`EPSv`]

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`mode`"

[`DCEv` "`mode`"]: #dcev-mode

Parent: [`DTAv`]

Internal data used by Connector Line autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`motion_blur_angle`"

[`DCEv` "`motion_blur_angle`"]: #dcev-motion-blur-angle

Parent: [`EPSv`]

Used by "Motion Blur" filter.

Value range: `0`..`360` (degrees)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`motion_blur_distance`"

[`DCEv` "`motion_blur_distance`"]: #dcev-motion-blur-distance

Parent: [`EPSv`]

Used by "Motion Blur" filter.

Observed value range: `1`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`mouse`"

[`DCEv` "`mouse`"]: #dcev-mouse

Parent: [`DTAv`]

Used internally by "3D Box" autoshape.

A mouse coordinate recorded as `{x:0, y:0}`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`name`"

[`DCEv` "`name`"]: #dcev-name

Parent: [`EPSv`]

Values:

- `Add Noise...`
- `Auto Levels`
- `Bevel Boss...`
- `Blur`
- `Blur More`
- `Brightness/Contrast...`
- `Brushed Metal...`
- `Chrome...`
- `Convert to Alpha`
- `Corona...`
- `Curves...`
- `Find Edges`
- `Gaussian Blur...`
- `Gaussian rozmazání...`
- `Glass...`
- `Hue/Saturation...`
- `Invert`
- `Jas/Kontrast...`
- `Levels...`
- `Luminosité/Contraste...`
- `Motion Blur...`
- `Motion Trail...`
- `Niveles...`
- `Odstín/Sytost...`
- `Perspective Shadow...`
- `Převrátit-invertovat`
- `Radial Blur...`
- `Sfocatura Gaussian...`
- `Sharpen`
- `Sharpen More`
- `Solid Shadow...`
- `Television...`
- `Unsharp Mask...`
- `Zoom Blur...`
- `ぼかし`
- `ぼかし（ガウス)...`
- `カーブ...`
- `ノイズの追加...`
- `レベル補正...`
- `曲线...`
- `查找边缘`
- `模糊`
- `自动色阶`
- `色相 / 彩度...`
- `色相 ・ 彩度...`
- `色相/饱和度...`
- `进一步锐化`
- `锐化`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`nodes`"

[`DCEv` "`nodes`"]: #dcev-nodes

Parent: [`DTAv`]

Internal data used by Star, Polygon autoshapes.

Observed value range: `5`..`25`

Also observed non-numeric values:

- `3; Alt/Opt-drag to split`
- `5; Alt/Opt-drag to split`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`offset1`"

[`DCEv` "`offset1`"]: #dcev-offset1

Parent: [`DTAv`]

Internal data used by Connector Line autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`offset2`"

[`DCEv` "`offset2`"]: #dcev-offset2

Parent: [`DTAv`]

Internal data used by Connector Line autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"

[`DCEv` "`origPoints3D`"]: #dcev-origpoints3d

Parent: [`DTAv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p0`"

[`DCEv` "`origPoints3D`"."`p0`"]: #dcev-origpoints3d-p0

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p0`"."`_x`"

[`DCEv` "`origPoints3D`"."`p0`"."`_x`"]: #dcev-origpoints3d-p0-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p0`"."`_y`"

[`DCEv` "`origPoints3D`"."`p0`"."`_y`"]: #dcev-origpoints3d-p0-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p0`"."`_z`"

[`DCEv` "`origPoints3D`"."`p0`"."`_z`"]: #dcev-origpoints3d-p0-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p1`"

[`DCEv` "`origPoints3D`"."`p1`"]: #dcev-origpoints3d-p1

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p1`"."`_x`"

[`DCEv` "`origPoints3D`"."`p1`"."`_x`"]: #dcev-origpoints3d-p1-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p1`"."`_y`"

[`DCEv` "`origPoints3D`"."`p1`"."`_y`"]: #dcev-origpoints3d-p1-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p1`"."`_z`"

[`DCEv` "`origPoints3D`"."`p1`"."`_z`"]: #dcev-origpoints3d-p1-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p2`"

[`DCEv` "`origPoints3D`"."`p2`"]: #dcev-origpoints3d-p2

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p2`"."`_x`"

[`DCEv` "`origPoints3D`"."`p2`"."`_x`"]: #dcev-origpoints3d-p2-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p2`"."`_y`"

[`DCEv` "`origPoints3D`"."`p2`"."`_y`"]: #dcev-origpoints3d-p2-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p2`"."`_z`"

[`DCEv` "`origPoints3D`"."`p2`"."`_z`"]: #dcev-origpoints3d-p2-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p3`"

[`DCEv` "`origPoints3D`"."`p3`"]: #dcev-origpoints3d-p3

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p3`"."`_x`"

[`DCEv` "`origPoints3D`"."`p3`"."`_x`"]: #dcev-origpoints3d-p3-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p3`"."`_y`"

[`DCEv` "`origPoints3D`"."`p3`"."`_y`"]: #dcev-origpoints3d-p3-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p3`"."`_z`"

[`DCEv` "`origPoints3D`"."`p3`"."`_z`"]: #dcev-origpoints3d-p3-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p4`"

[`DCEv` "`origPoints3D`"."`p4`"]: #dcev-origpoints3d-p4

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p4`"."`_x`"

[`DCEv` "`origPoints3D`"."`p4`"."`_x`"]: #dcev-origpoints3d-p4-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p4`"."`_y`"

[`DCEv` "`origPoints3D`"."`p4`"."`_y`"]: #dcev-origpoints3d-p4-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p4`"."`_z`"

[`DCEv` "`origPoints3D`"."`p4`"."`_z`"]: #dcev-origpoints3d-p4-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p5`"

[`DCEv` "`origPoints3D`"."`p5`"]: #dcev-origpoints3d-p5

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p5`"."`_x`"

[`DCEv` "`origPoints3D`"."`p5`"."`_x`"]: #dcev-origpoints3d-p5-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p5`"."`_y`"

[`DCEv` "`origPoints3D`"."`p5`"."`_y`"]: #dcev-origpoints3d-p5-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p5`"."`_z`"

[`DCEv` "`origPoints3D`"."`p5`"."`_z`"]: #dcev-origpoints3d-p5-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p6`"

[`DCEv` "`origPoints3D`"."`p6`"]: #dcev-origpoints3d-p6

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p6`"."`_x`"

[`DCEv` "`origPoints3D`"."`p6`"."`_x`"]: #dcev-origpoints3d-p6-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p6`"."`_y`"

[`DCEv` "`origPoints3D`"."`p6`"."`_y`"]: #dcev-origpoints3d-p6-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p6`"."`_z`"

[`DCEv` "`origPoints3D`"."`p6`"."`_z`"]: #dcev-origpoints3d-p6-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p7`"

[`DCEv` "`origPoints3D`"."`p7`"]: #dcev-origpoints3d-p7

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`origPoints3D`"."`p7`"."`_x`"

[`DCEv` "`origPoints3D`"."`p7`"."`_x`"]: #dcev-origpoints3d-p7-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p7`"."`_y`"

[`DCEv` "`origPoints3D`"."`p7`"."`_y`"]: #dcev-origpoints3d-p7-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`origPoints3D`"."`p7`"."`_z`"

[`DCEv` "`origPoints3D`"."`p7`"."`_z`"]: #dcev-origpoints3d-p7-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`outerGlow`"

[`DCEv` "`outerGlow`"]: #dcev-outerglow

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Outer Glow".

This is an "&"-separated string, for example:

```text
0&0&screen&75.000000:0.000000:5.000000:0.000000:0.000000:50.000000&softMatte&RGBColor;255.000000;255.000000;189.996109&nogradient&2$$0.000000;0.000000;1$255.000000;255.000000;1&
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`patternFill`"

[`DCEv` "`patternFill`"]: #dcev-patternfill

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Pattern Overlay".

This is an "&"-separated string, for example:

```text
0&1&100.000000&100.000000&0.000000&0.000000&normal&Bubbles&b7334da0-122f-11d4-8bb5-e27e45023b5f
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"

[`DCEv` "`points3D`"]: #dcev-points3d

Parent: [`DTAv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p0`"

[`DCEv` "`points3D`"."`p0`"]: #dcev-points3d-p0

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p0`"."`_x`"

[`DCEv` "`points3D`"."`p0`"."`_x`"]: #dcev-points3d-p0-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p0`"."`_y`"

[`DCEv` "`points3D`"."`p0`"."`_y`"]: #dcev-points3d-p0-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p0`"."`_z`"

[`DCEv` "`points3D`"."`p0`"."`_z`"]: #dcev-points3d-p0-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p1`"

[`DCEv` "`points3D`"."`p1`"]: #dcev-points3d-p1

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p1`"."`_x`"

[`DCEv` "`points3D`"."`p1`"."`_x`"]: #dcev-points3d-p1-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p1`"."`_y`"

[`DCEv` "`points3D`"."`p1`"."`_y`"]: #dcev-points3d-p1-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p1`"."`_z`"

[`DCEv` "`points3D`"."`p1`"."`_z`"]: #dcev-points3d-p1-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p2`"

[`DCEv` "`points3D`"."`p2`"]: #dcev-points3d-p2

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p2`"."`_x`"

[`DCEv` "`points3D`"."`p2`"."`_x`"]: #dcev-points3d-p2-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p2`"."`_y`"

[`DCEv` "`points3D`"."`p2`"."`_y`"]: #dcev-points3d-p2-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p2`"."`_z`"

[`DCEv` "`points3D`"."`p2`"."`_z`"]: #dcev-points3d-p2-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p3`"

[`DCEv` "`points3D`"."`p3`"]: #dcev-points3d-p3

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p3`"."`_x`"

[`DCEv` "`points3D`"."`p3`"."`_x`"]: #dcev-points3d-p3-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p3`"."`_y`"

[`DCEv` "`points3D`"."`p3`"."`_y`"]: #dcev-points3d-p3-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p3`"."`_z`"

[`DCEv` "`points3D`"."`p3`"."`_z`"]: #dcev-points3d-p3-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p4`"

[`DCEv` "`points3D`"."`p4`"]: #dcev-points3d-p4

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p4`"."`_x`"

[`DCEv` "`points3D`"."`p4`"."`_x`"]: #dcev-points3d-p4-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p4`"."`_y`"

[`DCEv` "`points3D`"."`p4`"."`_y`"]: #dcev-points3d-p4-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p4`"."`_z`"

[`DCEv` "`points3D`"."`p4`"."`_z`"]: #dcev-points3d-p4-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p5`"

[`DCEv` "`points3D`"."`p5`"]: #dcev-points3d-p5

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p5`"."`_x`"

[`DCEv` "`points3D`"."`p5`"."`_x`"]: #dcev-points3d-p5-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p5`"."`_y`"

[`DCEv` "`points3D`"."`p5`"."`_y`"]: #dcev-points3d-p5-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p5`"."`_z`"

[`DCEv` "`points3D`"."`p5`"."`_z`"]: #dcev-points3d-p5-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p6`"

[`DCEv` "`points3D`"."`p6`"]: #dcev-points3d-p6

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p6`"."`_x`"

[`DCEv` "`points3D`"."`p6`"."`_x`"]: #dcev-points3d-p6-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p6`"."`_y`"

[`DCEv` "`points3D`"."`p6`"."`_y`"]: #dcev-points3d-p6-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p6`"."`_z`"

[`DCEv` "`points3D`"."`p6`"."`_z`"]: #dcev-points3d-p6-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p7`"

[`DCEv` "`points3D`"."`p7`"]: #dcev-points3d-p7

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`points3D`"."`p7`"."`_x`"

[`DCEv` "`points3D`"."`p7`"."`_x`"]: #dcev-points3d-p7-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p7`"."`_y`"

[`DCEv` "`points3D`"."`p7`"."`_y`"]: #dcev-points3d-p7-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `50`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`points3D`"."`p7`"."`_z`"

[`DCEv` "`points3D`"."`p7`"."`_z`"]: #dcev-points3d-p7-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-50`..`-50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`pressMouse`"

[`DCEv` "`pressMouse`"]: #dcev-pressmouse

Parent: [`DTAv`]

Used internally by "3D Box" autoshape.

A mouse coordinate recorded as `{x:0, y:0}`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`radial`"

[`DCEv` "`radial`"]: #dcev-radial

Parent: [`DTAv`]

Values:

- `1`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`radial_blur_amount`"

[`DCEv` "`radial_blur_amount`"]: #dcev-radial-blur-amount

Parent: [`EPSv`]

Used by "Radial Blur" filter.

Observed value range: `1`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`radial_blur_quality`"

[`DCEv` "`radial_blur_quality`"]: #dcev-radial-blur-quality

Parent: [`EPSv`]

Used by "Radial Blur" filter.

Observed value range: `1`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`radius`"

[`DCEv` "`radius`"]: #dcev-radius

Parent: [`DTAv`]

Internal data used by Spiral autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`radius0`"

[`DCEv` "`radius0`"]: #dcev-radius0

Parent: [`DTAv`]

Internal data used by Polygon autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`radius1`"

[`DCEv` "`radius1`"]: #dcev-radius1

Parent: [`DTAv`]

Internal data used by Polygon autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`red_points`"

[`DCEv` "`red_points`"]: #dcev-red-points

Parent: [`EPSv`]

Used by "Curves" filter.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GPLv`] Grab Point List

### `DCEv` "`rgb_points`"

[`DCEv` "`rgb_points`"]: #dcev-rgb-points

Parent: [`EPSv`]

Used by "Curves" filter.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GPLv`] Grab Point List

### `DCEv` "`rotation`"

[`DCEv` "`rotation`"]: #dcev-rotation

Parent: [`DTAv`]

Internal data used by Polygon, 3D Box autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`]? Dictionary Entry String Value
- [`GDTv`]? Nested Dictionary

### `DCEv` "`rotation`"."`_x`"

[`DCEv` "`rotation`"."`_x`"]: #dcev-rotation-x

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `0.5599999999999999`..`0.5599999999999999`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`rotation`"."`_y`"

[`DCEv` "`rotation`"."`_y`"]: #dcev-rotation-y

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `-0.44`..`-0.44`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`rotation`"."`_z`"

[`DCEv` "`rotation`"."`_z`"]: #dcev-rotation-z

Parent: [`GDTv`]

Used internally by "3D Box" autoshape.

Observed value range: `0`..`0`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`round0`"

[`DCEv` "`round0`"]: #dcev-round0

Parent: [`DTAv`]

Internal data used by Star autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`round1`"

[`DCEv` "`round1`"]: #dcev-round1

Parent: [`DTAv`]

Internal data used by Star autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`roundness`"

[`DCEv` "`roundness`"]: #dcev-roundness

Parent: [`DTAv`]

Internal data used by Arrow autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`satin`"

[`DCEv` "`satin`"]: #dcev-satin

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Satin".

This is an "&"-separated string, for example:

```text
0&0&1&70.000000&19.000000&23.000000&15.000000&multiply&RGBColor;0.000000;0.000000;0.000000&9$$0.000000;0.000000;1$32.000000;7.000000;1$64.000000;38.000000;1$96.000000;101.000000;1$128.000000;166.000000;1$159.000000;209.000000;1$191.000000;235.000000;1$223.000000;248.000000;1$255.000000;255.000000;1
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`saturation_amount`"

[`DCEv` "`saturation_amount`"]: #dcev-saturation-amount

Parent: [`EPSv`]

Used by "Hue/Saturation" filter.

Observed value range: `-100`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`shapeName`"

[`DCEv` "`shapeName`"]: #dcev-shapename

Parent: [`DTAv`]

Internal data used by autoshapes.

Values:

- `arrow`
- `arrowtool`
- `connector`
- `doughnut`
- `lshape`
- `measure`
- `pie`
- `polygon`
- `rectangle`
- `spiral`
- `star`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`sides`"

[`DCEv` "`sides`"]: #dcev-sides

Parent: [`DTAv`]

Internal data used by Polygon autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`sky_color`"

[`DCEv` "`sky_color`"]: #dcev-sky-color

Parent: [`EPSv`]

Used by "Clouds" filter.

A colour in "#rrggbb" format

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`solidFill`"

[`DCEv` "`solidFill`"]: #dcev-solidfill

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Color Overlay".

This is an "&"-separated string, for example:

```text
0&100.000000&normal&RGBColor;255.000000;0.000000;0.000000
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`source_high_blue`"

[`DCEv` "`source_high_blue`"]: #dcev-source-high-blue

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `2`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`source_high_green`"

[`DCEv` "`source_high_green`"]: #dcev-source-high-green

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `2`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`source_high_red`"

[`DCEv` "`source_high_red`"]: #dcev-source-high-red

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`source_high_rgb`"

[`DCEv` "`source_high_rgb`"]: #dcev-source-high-rgb

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `2`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`source_low_blue`"

[`DCEv` "`source_low_blue`"]: #dcev-source-low-blue

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`253`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`source_low_green`"

[`DCEv` "`source_low_green`"]: #dcev-source-low-green

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`253`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`source_low_red`"

[`DCEv` "`source_low_red`"]: #dcev-source-low-red

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`253`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`source_low_rgb`"

[`DCEv` "`source_low_rgb`"]: #dcev-source-low-rgb

Parent: [`EPSv`]

Used by "Auto Levels", "Levels" filters.

Observed value range: `0`..`253`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`split`"

[`DCEv` "`split`"]: #dcev-split

Parent: [`DTAv`]

Internal data used by Polygon autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`stroke`"

[`DCEv` "`stroke`"]: #dcev-stroke

Parent: [`EPSv`]

Used by "Photoshop Live Effects" filter: "Stroke".

This is an "&"-separated string, for example:

```text
0&100.000000&3.000000&normal&RGBColor;255.000000;0.000000;0.000000&outsetFrame&solidColor&
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`style`"

[`DCEv` "`style`"]: #dcev-style

Parent: [`DTAv`]

Values:

- `0`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`t1`"

[`DCEv` "`t1`"]: #dcev-t1

Parent: [`DTAv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`t2`"

[`DCEv` "`t2`"]: #dcev-t2

Parent: [`DTAv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tags`"

[`DCEv` "`tags`"]: #dcev-tags

Parent: [`DTAv`]

Values:

- `[  ]`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value
- [`GVRv`] Dictionary Value Array

### `DCEv` "`text`"

[`DCEv` "`text`"]: #dcev-text

Parent: [`DTAv`]

Text to show in Annotation autoshape, in a JSON-like structure (without key quoting):

```javascript
{
  initialAttrs: {
    alignment:"left",
    antiAliasSharpness:200,
    antiAliasStrength:64,
    baselineShift:0,
    bold:false,
    face:"ArialMT",
    fillColor:"#000000",
    horizontalScale:1,
    italic:false,
    leading:1,
    leadingMode:"percentage",
    overSample:16,
    paragraphIndent:0,
    paragraphSpacingAfter:0,
    paragraphSpacingBefore:0,
    rangeKerning:0,
    size:"12pt",
    underline:false
  },
  textRuns: [
    {
      changedAttrs: {,
        alignment:"left",
        antiAliasSharpness:200,
        antiAliasStrength:64,
        baselineShift:0,
        bold:false,
        face:"ArialMT",
        fillColor:"#000000",
        horizontalScale:1,
        italic:false,
        leading:1,
        leadingMode:"percentage",
        overSample:16,
        paragraphIndent:0,
        paragraphSpacingAfter:0,
        paragraphSpacingBefore:0,
        rangeKerning:0,
        size:"12pt",
        underline:false
      },
      characters:"Edit this text using the Text or Subselection tools."
    }
  ]
}
```

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`thickness`"

[`DCEv` "`thickness`"]: #dcev-thickness

Parent: [`DTAv`]

Internal data used by Arrow Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`toolTips`"

[`DCEv` "`toolTips`"]: #dcev-tooltips

Parent: [`DTAv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`toolTips`"."`angle`"

[`DCEv` "`toolTips`"."`angle`"]: #dcev-tooltips-angle

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`toolTips`"."`drag`"

[`DCEv` "`toolTips`"."`drag`"]: #dcev-tooltips-drag

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`toolTips`"."`head`"

[`DCEv` "`toolTips`"."`head`"]: #dcev-tooltips-head

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`toolTips`"."`inch`"

[`DCEv` "`toolTips`"."`inch`"]: #dcev-tooltips-inch

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`toolTips`"."`length`"

[`DCEv` "`toolTips`"."`length`"]: #dcev-tooltips-length

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`toolTips`"."`of`"

[`DCEv` "`toolTips`"."`of`"]: #dcev-tooltips-of

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`toolTips`"."`px`"

[`DCEv` "`toolTips`"."`px`"]: #dcev-tooltips-px

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`toolTips`"."`resize`"

[`DCEv` "`toolTips`"."`resize`"]: #dcev-tooltips-resize

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"

[`DCEv` "`tooltips`"]: #dcev-tooltips

Parent: [`DTAv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`GDTv`] Nested Dictionary

### `DCEv` "`tooltips`"."`altopt`"

[`DCEv` "`tooltips`"."`altopt`"]: #dcev-tooltips-altopt

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`inner`"

[`DCEv` "`tooltips`"."`inner`"]: #dcev-tooltips-inner

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`openclose`"

[`DCEv` "`tooltips`"."`openclose`"]: #dcev-tooltips-openclose

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`points`"

[`DCEv` "`tooltips`"."`points`"]: #dcev-tooltips-points

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`radius`"

[`DCEv` "`tooltips`"."`radius`"]: #dcev-tooltips-radius

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`radius0`"

[`DCEv` "`tooltips`"."`radius0`"]: #dcev-tooltips-radius0

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`radius1`"

[`DCEv` "`tooltips`"."`radius1`"]: #dcev-tooltips-radius1

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`reset`"

[`DCEv` "`tooltips`"."`reset`"]: #dcev-tooltips-reset

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`roundness1`"

[`DCEv` "`tooltips`"."`roundness1`"]: #dcev-tooltips-roundness1

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`roundness2`"

[`DCEv` "`tooltips`"."`roundness2`"]: #dcev-tooltips-roundness2

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`scale`"

[`DCEv` "`tooltips`"."`scale`"]: #dcev-tooltips-scale

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`sections`"

[`DCEv` "`tooltips`"."`sections`"]: #dcev-tooltips-sections

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`sides`"

[`DCEv` "`tooltips`"."`sides`"]: #dcev-tooltips-sides

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`tooltips`"."`spirals`"

[`DCEv` "`tooltips`"."`spirals`"]: #dcev-tooltips-spirals

Parent: [`GDTv`]

Internal data used by autoshapes.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`type`"

[`DCEv` "`type`"]: #dcev-type

Parent: [`DTAv`]

Values:

- `Button`: unknown - TODO
- `TextField`: unknown - TODO

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`unsharp_mask_amount`"

[`DCEv` "`unsharp_mask_amount`"]: #dcev-unsharp-mask-amount

Parent: [`EPSv`]

Used by "Unsharp Mask" filter.

Observed value range: `1`..`500`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`unsharp_mask_radius`"

[`DCEv` "`unsharp_mask_radius`"]: #dcev-unsharp-mask-radius

Parent: [`EPSv`]

Used by "Unsharp Mask" filter.

Observed value range: `0.1`..`250`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`unsharp_mask_threshold`"

[`DCEv` "`unsharp_mask_threshold`"]: #dcev-unsharp-mask-threshold

Parent: [`EPSv`]

Used by "Unsharp Mask" filter.

Observed value range: `0`..`255`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`usecolor`"

[`DCEv` "`usecolor`"]: #dcev-usecolor

Parent: [`EPSv`]

Used by "Solid Shadow" filter.

Values:

- `false`: shadow colour is extension of edge colour
- `true`: shadow colour is set by [`DCEv` "`color`"]

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`wavelength`"

[`DCEv` "`wavelength`"]: #dcev-wavelength

Parent: [`DTAv`]

Observed value range: `33.00001272903228`..`33.00001272903228`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`width`"

[`DCEv` "`width`"]: #dcev-width

Parent: [`DTAv`]

Internal data used by Connector Line autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`x1`"

[`DCEv` "`x1`"]: #dcev-x1

Parent: [`DTAv`]

Internal data used by Measure Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`x2`"

[`DCEv` "`x2`"]: #dcev-x2

Parent: [`DTAv`]

Internal data used by Measure Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`y1`"

[`DCEv` "`y1`"]: #dcev-y1

Parent: [`DTAv`]

Internal data used by Measure Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`y2`"

[`DCEv` "`y2`"]: #dcev-y2

Parent: [`DTAv`]

Internal data used by Measure Tool autoshape.

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`zoom_blur_amount`"

[`DCEv` "`zoom_blur_amount`"]: #dcev-zoom-blur-amount

Parent: [`EPSv`]

Used by "Zoom Blur" filter.

Observed value range: `1`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`zoom_blur_quality`"

[`DCEv` "`zoom_blur_quality`"]: #dcev-zoom-blur-quality

Parent: [`EPSv`]

Used by "Zoom Blur" filter.

Observed value range: `1`..`100`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

## `DCKs` **D**i**c**tionary Entry **K**ey

[`DCKs`]: #dcks-dictionary-entry-key

Parent: [`DCEv`]

The key name for a key-value pair.

## `DCVs` **D**i**c**tionary Entry String **V**alue

[`DCVs`]: #dcvs-dictionary-entry-string-value

Parent: [`DCEv`]

A string value for a key-value pair.

## `DF1i` **D**ash O**f**f **1**

[`DF1i`]: #df1i-dash-off-1

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DF2i` **D**ash O**f**f **2**

[`DF2i`]: #df2i-dash-off-2

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DF3i` **D**ash O**f**f **3**

[`DF3i`]: #df3i-dash-off-3

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DISb` **Dis**play

[`DISb`]: #disb-display

Parent: [`LAYv`] / [`LSLv`] / [`MPLv`]

Values:

- `false`: the node is collapsed in the layer list
- `true`: the node is open in the layer list

## `DO1i` **D**ash **O**n **1**

[`DO1i`]: #do1i-dash-on-1

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DO2i` **D**ash **O**n **2**

[`DO2i`]: #do2i-dash-on-2

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DO3i` **D**ash **O**n **3**

[`DO3i`]: #do3i-dash-on-3

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DSUb` HTML **D**rop Un-**S**liced Areas

[`DSUb`]: #dsub-html-drop-un-sliced-areas

Parent: [`EXPv`]

Values:

- `false`: include areas without slice objects
- `true`: omit areas without slice objects

## `DTAv` **D**a**ta**

[`DTAv`]: #dtav-data

Parent: [`ALSv`] / [`CSGv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`URLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Stores arbitrary, possibly nested, data for JavaScript scripts, as set on `smartShape.elem.customData`.

Contains:

- [`DCEv` "`Frame2_SS_MarginID`"]?
- [`DCEv` "`Frame2_SS_OverhangID`"]?
- [`DCEv` "`Frame2_SS_WidthID`"]?
- [`DCEv` "`Frame3_SS_MarginID`"]?
- [`DCEv` "`Frame3_SS_OverhangID`"]?
- [`DCEv` "`Frame3_SS_WidthID`"]?
- [`DCEv` "`Frame_SS_FillPattern`"]?
- [`DCEv` "`Frame_SS_WidthID`"]?
- [`DCEv` "`alrtmsg`"]?
- [`DCEv` "`arrowLength`"]?
- [`DCEv` "`arrowTip`"]?
- [`DCEv` "`arrowWidth`"]?
- [`DCEv` "`atMin`"]?
- [`DCEv` "`awMin`"]?
- [`DCEv` "`c2y`"]?
- [`DCEv` "`clockwise`"]?
- [`DCEv` "`constants`"]?
- [`DCEv` "`corner0`"]?
- [`DCEv` "`corner1`"]?
- [`DCEv` "`corner2`"]?
- [`DCEv` "`corner3`"]?
- [`DCEv` "`css`"]?
- [`DCEv` "`ctype0`"]?
- [`DCEv` "`ctype1`"]?
- [`DCEv` "`ctype2`"]?
- [`DCEv` "`ctype3`"]?
- [`DCEv` "`currentValues`"]?
- [`DCEv` "`curvature`"]?
- [`DCEv` "`curveRatio`"]?
- [`DCEv` "`custData`"]?
- [`DCEv` "`flexClassName`"]?
- [`DCEv` "`focalLength`"]?
- [`DCEv` "`height`"]?
- [`DCEv` "`html`"]?
- [`DCEv` "`innerRatio`"]?
- [`DCEv` "`lastMouse`"]?
- [`DCEv` "`lastMouseAngle`"]?
- [`DCEv` "`lineAngle`"]?
- [`DCEv` "`locX`"]?
- [`DCEv` "`locY`"]?
- [`DCEv` "`locked`"]?
- [`DCEv` "`maxNodes`"]?
- [`DCEv` "`minNodes`"]?
- [`DCEv` "`mode`"]?
- [`DCEv` "`mouse`"]?
- [`DCEv` "`nodes`"]?
- [`DCEv` "`offset1`"]?
- [`DCEv` "`offset2`"]?
- [`DCEv` "`origPoints3D`"]?
- [`DCEv` "`points3D`"]?
- [`DCEv` "`pressMouse`"]?
- [`DCEv` "`radial`"]?
- [`DCEv` "`radius`"]?
- [`DCEv` "`radius0`"]?
- [`DCEv` "`radius1`"]?
- [`DCEv` "`rotation`"]?
- [`DCEv` "`round0`"]?
- [`DCEv` "`round1`"]?
- [`DCEv` "`roundness`"]?
- [`DCEv` "`shapeName`"]?
- [`DCEv` "`sides`"]?
- [`DCEv` "`split`"]?
- [`DCEv` "`style`"]?
- [`DCEv` "`t1`"]?
- [`DCEv` "`t2`"]?
- [`DCEv` "`tags`"]?
- [`DCEv` "`text`"]?
- [`DCEv` "`thickness`"]?
- [`DCEv` "`toolTips`"]?
- [`DCEv` "`tooltips`"]?
- [`DCEv` "`type`"]?
- [`DCEv` "`wavelength`"]?
- [`DCEv` "`width`"]?
- [`DCEv` "`x1`"]?
- [`DCEv` "`x2`"]?
- [`DCEv` "`y1`"]?
- [`DCEv` "`y2`"]?

## `DURi` **Dur**ation

[`DURi`]: #duri-duration

Parent: [`PPTv`]

Observed value range: `0x00000000`..`0x00000000` (`0`..`0`)

## `DVLb`

[`DVLb`]: #dvlb

Parent: [`ALSv`] / [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `ECSi` HTML **E**xternal **CS**S

[`ECSi`]: #ecsi-html-external-css

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX 2005 - Adobe Fireworks CS6

Values:

- `0`: use inline CSS
- `1`: use external file for CSS

## `EFBs` Last **E**xport **F**ilename

[`EFBs`]: #efbs-last-export-filename

Parent: [`EXPv`]

Last filename used for export (excluding path and extension)

## `EFDv` **Ef**fect **D**efinitions

[`EFDv`]: #efdv-effect-definitions

Parent: [`MKBv`] / [`PDCv`]

Preset effects / defaults offered in the UI

Contains:

- [`EFLv`]\* Effect List

## `EFLv` **Ef**fect **L**ist

[`EFLv`]: #eflv-effect-list

Parent: [`ALSv`] / [`CSGv`] / [`EFDv`] / [`GRPv`] / [`IMGv`] / [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

Contains:

- [`CATs`] Category Name
- [`INMs`] Internal Name
- [`EPSv`]\* Effect Properties
- [`UNMs`]? User-facing Name

## `EFXs` **E**xport **F**ile Filter.

[`EFXs`]: #efxs-export-file-filter

Parent: [`EXPv`]

Values:

- ``
- `*.bmp;*.dib;*.rle`
- `*.gif`
- `*.jpg`
- `*.pdf`
- `*.png`
- `*.psd`
- `*.swf`
- `*.tif;*.tiff`
- `.htm`
- `.html`
- `.lbi`
- `.mxml`

## `ELMv` **El**e**m**ents

[`ELMv`]: #elmv-elements

Parent: [`CELv`] / [`CSGv`] / [`GRPv`]

A list of individual elements to render within a layer or group, ordered from front to back.

Contains:

- [`ALSv`]\* Symbol Instance
- [`CSGv`]\* CS6 Group
- [`GRPv`]\* Group
- [`IMGv`]\* Image
- [`LSLv`]\* Layer Sub-Layer
- [`PTHv`]\* Path
- [`TXTv`]\* Text
- [`URLv`]\* Image Slice / Hotspot

## `ENCi` HTML **Enc**oding

[`ENCi`]: #enci-html-encoding

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Values:

- `0`: ASCII
- `1`: UTF-8
- `2`: unknown - TODO
- `7`: unknown - TODO

## `EOFb` **E**ven-**O**dd **F**ill Rule

[`EOFb`]: #eofb-even-odd-fill-rule

Parent: [`PTHv`]

Observed in versions: Macromedia Fireworks MX 2005 - Adobe Fireworks CS6

Values:

- `false`: nonzero fill rule
- `true`: even-odd fill rule

## `EPSv` **E**ffect **P**ropertie**s**

[`EPSv`]: #epsv-effect-properties

Parent: [`EFLv`]

Defines an effect (such as a drop-shadow). See [`DCEv` "`EffectMoaID`"] for the type of effect applied.

Contains:

- [`DCEv` "`EffectMoaID`"]
- [`DCEv` "`mkbFile_WriteOnly_TemporaryEffectUiName`"]
- [`DCEv` "`AngleSoftness`"]?
- [`DCEv` "`BevelContrast`"]?
- [`DCEv` "`BevelType`"]?
- [`DCEv` "`BevelWidth`"]?
- [`DCEv` "`Blendmode`"]?
- [`DCEv` "`ButtonState`"]?
- [`DCEv` "`Color`"]?
- [`DCEv` "`Dict`"]?
- [`DCEv` "`DownBlendColor`"]?
- [`DCEv` "`EdgeThreshold`"]?
- [`DCEv` "`EffectIsVisible`"]?
- [`DCEv` "`EmbossFaceColor`"]?
- [`DCEv` "`GlowStartDistance`"]?
- [`DCEv` "`GlowWidth`"]?
- [`DCEv` "`HiliteColor`"]?
- [`DCEv` "`HitBlendColor`"]?
- [`DCEv` "`LightAngle`"]?
- [`DCEv` "`LightDistance`"]?
- [`DCEv` "`MB_filter_preview_tile_size`"]?
- [`DCEv` "`MaskSoftness`"]?
- [`DCEv` "`Opacity`"]?
- [`DCEv` "`OuterBevelColor`"]?
- [`DCEv` "`ShadowAngle`"]?
- [`DCEv` "`ShadowBlur`"]?
- [`DCEv` "`ShadowColor`"]?
- [`DCEv` "`ShadowDistance`"]?
- [`DCEv` "`ShadowType`"]?
- [`DCEv` "`ShowObject`"]?
- [`DCEv` "`SlopeMultiplier`"]?
- [`DCEv` "`SlopeType`"]?
- [`DCEv` "`add_noise_amount`"]?
- [`DCEv` "`add_noise_use_color`"]?
- [`DCEv` "`angle`"]?
- [`DCEv` "`bevelEmboss`"]?
- [`DCEv` "`blue_points`"]?
- [`DCEv` "`brightness_amount`"]?
- [`DCEv` "`category`"]?
- [`DCEv` "`cloud_color`"]?
- [`DCEv` "`color`"]?
- [`DCEv` "`contrast_amount`"]?
- [`DCEv` "`dest_high_blue`"]?
- [`DCEv` "`dest_high_green`"]?
- [`DCEv` "`dest_high_red`"]?
- [`DCEv` "`dest_high_rgb`"]?
- [`DCEv` "`dest_low_blue`"]?
- [`DCEv` "`dest_low_green`"]?
- [`DCEv` "`dest_low_red`"]?
- [`DCEv` "`dest_low_rgb`"]?
- [`DCEv` "`distance`"]?
- [`DCEv` "`dropShadow`"]?
- [`DCEv` "`external_filter_have_scripting_data`"]?
- [`DCEv` "`external_filter_key__0x436c7220`"]?
- [`DCEv` "`external_filter_key__0x45646720`"]?
- [`DCEv` "`external_filter_key__0x46637320`"]?
- [`DCEv` "`external_filter_key__0x466c2020`"]?
- [`DCEv` "`external_filter_key__BEvl`"]?
- [`DCEv` "`external_filter_key__BMbs`"]?
- [`DCEv` "`external_filter_key__BMbv`"]?
- [`DCEv` "`external_filter_key__BMde`"]?
- [`DCEv` "`external_filter_key__BMdi`"]?
- [`DCEv` "`external_filter_key__BMgd`"]?
- [`DCEv` "`external_filter_key__BMgw`"]?
- [`DCEv` "`external_filter_key__BMmo`"]?
- [`DCEv` "`external_filter_key__BMsm`"]?
- [`DCEv` "`external_filter_key__Brgh`"]?
- [`DCEv` "`external_filter_key__Cntr`"]?
- [`DCEv` "`external_filter_key__Drct`"]?
- [`DCEv` "`external_filter_key__Drkn`"]?
- [`DCEv` "`external_filter_key__FLsi`"]?
- [`DCEv` "`external_filter_key__FRcl`"]?
- [`DCEv` "`external_filter_key__FlCl`"]?
- [`DCEv` "`external_filter_key__GLcl`"]?
- [`DCEv` "`external_filter_key__GRsh`"]?
- [`DCEv` "`external_filter_key__INcl`"]?
- [`DCEv` "`external_filter_key__Lngt`"]?
- [`DCEv` "`external_filter_key__Mask`"]?
- [`DCEv` "`external_filter_key__NLnl`"]?
- [`DCEv` "`external_filter_key__Opct`"]?
- [`DCEv` "`external_filter_key__PSfo`"]?
- [`DCEv` "`external_filter_key__PSmo`"]?
- [`DCEv` "`external_filter_key__PSob`"]?
- [`DCEv` "`external_filter_key__PSpb`"]?
- [`DCEv` "`external_filter_key__PSrs`"]?
- [`DCEv` "`external_filter_key__REfr`"]?
- [`DCEv` "`external_filter_key__RPwi`"]?
- [`DCEv` "`external_filter_key__RndS`"]?
- [`DCEv` "`external_filter_key__RplS`"]?
- [`DCEv` "`external_filter_key__SHpa`"]?
- [`DCEv` "`external_filter_key__SHpb`"]?
- [`DCEv` "`external_filter_key__SHpc`"]?
- [`DCEv` "`external_filter_key__SHpd`"]?
- [`DCEv` "`external_filter_key__SHpe`"]?
- [`DCEv` "`external_filter_key__SHpf`"]?
- [`DCEv` "`external_filter_key__SHpg`"]?
- [`DCEv` "`external_filter_key__SHph`"]?
- [`DCEv` "`external_filter_key__STre`"]?
- [`DCEv` "`external_filter_key__Shrp`"]?
- [`DCEv` "`external_filter_key__Smth`"]?
- [`DCEv` "`external_filter_key__Sppa`"]?
- [`DCEv` "`external_filter_key__Sppb`"]?
- [`DCEv` "`external_filter_key__Sppc`"]?
- [`DCEv` "`external_filter_key__Sppd`"]?
- [`DCEv` "`external_filter_key__Sppe`"]?
- [`DCEv` "`external_filter_key__Sppf`"]?
- [`DCEv` "`external_filter_key__Sppg`"]?
- [`DCEv` "`external_filter_key__Spph`"]?
- [`DCEv` "`external_filter_key__TApe`"]?
- [`DCEv` "`external_filter_key__TEbr`"]?
- [`DCEv` "`external_filter_key__TEcu`"]?
- [`DCEv` "`external_filter_key__TEec`"]?
- [`DCEv` "`external_filter_key__TEgo`"]?
- [`DCEv` "`external_filter_key__TEgs`"]?
- [`DCEv` "`external_filter_key__TEsc`"]?
- [`DCEv` "`external_filter_key__TEss`"]?
- [`DCEv` "`external_filter_key__TEst`"]?
- [`DCEv` "`external_filter_key__TEth`"]?
- [`DCEv` "`external_filter_key__TEvs`"]?
- [`DCEv` "`external_filter_key__TIna`"]?
- [`DCEv` "`external_filter_key__TInc`"]?
- [`DCEv` "`external_filter_key__TxtF`"]?
- [`DCEv` "`external_filter_key__WAve`"]?
- [`DCEv` "`external_filter_key__Wdth`"]?
- [`DCEv` "`external_filter_key__blur`"]?
- [`DCEv` "`external_filter_key__bvlS`"]?
- [`DCEv` "`external_filter_key__sdwC`"]?
- [`DCEv` "`external_filter_key__sdwO`"]?
- [`DCEv` "`gamma_blue`"]?
- [`DCEv` "`gamma_green`"]?
- [`DCEv` "`gamma_red`"]?
- [`DCEv` "`gamma_rgb`"]?
- [`DCEv` "`gaussian_blur_radius`"]?
- [`DCEv` "`gradientFill`"]?
- [`DCEv` "`green_points`"]?
- [`DCEv` "`hls_colorize`"]?
- [`DCEv` "`hue_amount`"]?
- [`DCEv` "`innerGlow`"]?
- [`DCEv` "`innerShadow`"]?
- [`DCEv` "`lightness_amount`"]?
- [`DCEv` "`motion_blur_angle`"]?
- [`DCEv` "`motion_blur_distance`"]?
- [`DCEv` "`name`"]?
- [`DCEv` "`outerGlow`"]?
- [`DCEv` "`patternFill`"]?
- [`DCEv` "`radial_blur_amount`"]?
- [`DCEv` "`radial_blur_quality`"]?
- [`DCEv` "`red_points`"]?
- [`DCEv` "`rgb_points`"]?
- [`DCEv` "`satin`"]?
- [`DCEv` "`saturation_amount`"]?
- [`DCEv` "`sky_color`"]?
- [`DCEv` "`solidFill`"]?
- [`DCEv` "`source_high_blue`"]?
- [`DCEv` "`source_high_green`"]?
- [`DCEv` "`source_high_red`"]?
- [`DCEv` "`source_high_rgb`"]?
- [`DCEv` "`source_low_blue`"]?
- [`DCEv` "`source_low_green`"]?
- [`DCEv` "`source_low_red`"]?
- [`DCEv` "`source_low_rgb`"]?
- [`DCEv` "`stroke`"]?
- [`DCEv` "`unsharp_mask_amount`"]?
- [`DCEv` "`unsharp_mask_radius`"]?
- [`DCEv` "`unsharp_mask_threshold`"]?
- [`DCEv` "`usecolor`"]?
- [`DCEv` "`zoom_blur_amount`"]?
- [`DCEv` "`zoom_blur_quality`"]?

## `EXPv` **Exp**ort Options

[`EXPv`]: #expv-export-options

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`] / [`URLv`]

Contains:

- [`AACb`] Export GIF Animation Crop
- [`AADb`] Export GIF Animation Diff
- [`APLb`]
- [`APSb`]
- [`ASTi`] Websnap Tolerance
- [`CLRi`] Colour Mode
- [`FLPi`] Frame Loop
- [`FMTi`] Format
- [`GFIb`] Interlaced
- [`GLTi`] GIF Loss
- [`JPOi`] JPEG Colour
- [`JPPb`] JPEG Progressive
- [`JPQi`] JPEG Quality
- [`JPSi`] JPEG Smoothing
- [`JSBb`]
- [`JSEb`]
- [`JSQi`]
- [`JSTb`]
- [`PALv`] Palette
- [`PLDi`] Palette Dither Level
- [`PLNi`] Palette Number of entries
- [`PLOb`] Palette Pruning
- [`PLRi`] Palette Remaining Colours
- [`PLTi`] Palette Type
- [`PTNi`] Palette Transparency Type
- [`CBAi`]? Cell Background (Slice) Attachment
- [`CBRi`]? Cell Background (Slice) Repeat
- [`CBUs`]? Cell Background URL
- [`CDAi`]? HTML Page Alignment
- [`CDMv`]?
- [`CLPi`]? Export Scale Propotion
- [`CLSb`]? Export Scale Constrained
- [`CNSb`]? Export Scale
- [`CSMb`]? HTML CSS Menus
- [`CXBb`]?
- [`DSUb`]? HTML Drop Un-Sliced Areas
- [`ECSi`]? HTML External CSS
- [`EFBs`]? Last Export Filename
- [`EFXs`]? Export File Filter.
- [`ENCi`]? HTML Encoding
- [`EXPv`.`FCLi`]? Matte Colour
- [`FNLv`]? Frame Configuration List
- [`GSLb`]?
- [`HTMb`]? Export HTML
- [`HTMi`]? Export HTML Layout
- [`HTTs`]? HTML Style
- [`IMDs`]? Image Directory
- [`LRBi`]? Export Area Bottom
- [`LRLi`]? Export Area Left
- [`LRRi`]? Export Area Right
- [`LRTi`]? Export Area Top
- [`LSDb`]? HTML Multiple Nav Bars
- [`LSSi`]? HTML Slice Spacing
- [`LSUb`]?
- [`LXDs`]? Last Export Directory
- [`MCCi`]?
- [`MCTi`]?
- [`NM4v`]? HTML Slice Export Names
- [`NMFv`]? HTML Slice Export Names Frame
- [`NS0s`]?
- [`NS1s`]?
- [`NS2s`]?
- [`NS3s`]?
- [`NYSb`]?
- [`TALi`]?
- [`TPWi`]?
- [`TRMb`]? Export Trimmed Images
- [`XDAb`]?
- [`XFSi`]? Export Format Selection
- [`XMDi`]?
- [`XSZi`]? Export X Size
- [`XTMi`]? XHTML
- [`YSZi`]? Export Y Size

## `EXPv`.`FCLi` Matte **C**o**l**our

[`EXPv`.`FCLi`]: #expv-fcli-matte-colour

Parent: [`EXPv`]

ARGB format colour.

Value range: `0x00000000`..`0xffffffff`

## `FABi`

[`FABi`]: #fabi

Parent: [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

A **signed** 32-bit number, relating to Bottom.

## `FALi`

[`FALi`]: #fali

Parent: [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

A **signed** 32-bit number, relating to Left.

## `FARi`

[`FARi`]: #fari

Parent: [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

A **signed** 32-bit number, relating to Right.

## `FATi`

[`FATi`]: #fati

Parent: [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

A **signed** 32-bit number, relating to Top.

## `FCLi` **F**ill **C**o**l**our

[`FCLi`]: #fcli-fill-colour

Parent: [`PALv`] / [`PATv`] / [`TFSv`] / [`URLv`]

ARGB format colour.

Value range: `0x00000000`..`0xffffffff`

## `FD1i` **F**ill **D**ither Colour **1**

[`FD1i`]: #fd1i-fill-dither-colour-1

Parent: [`FPLv`]

Top-left pixel colour for web dither fill

Value range: `0x00000000`..`0xffffffff`

## `FD2i` **F**ill **D**ither Colour **2**

[`FD2i`]: #fd2i-fill-dither-colour-2

Parent: [`FPLv`]

Top-right pixel colour for web dither fill

Value range: `0x00000000`..`0xffffffff`

## `FD3i` **F**ill **D**ither Colour **3**

[`FD3i`]: #fd3i-fill-dither-colour-3

Parent: [`FPLv`]

Bottom-left pixel colour for web dither fill

Value range: `0x00000000`..`0xffffffff`

## `FD4i` **F**ill **D**ither Colour **4**

[`FD4i`]: #fd4i-fill-dither-colour-4

Parent: [`FPLv`]

Bottom-right pixel colour for web dither fill

Value range: `0x00000000`..`0xffffffff`

## `FDTb` **F**ill **D**ither **T**ransparent

[`FDTb`]: #fdtb-fill-dither-transparent

Parent: [`FPLv`]

If `true`, sets the top left and bottom right pixels ([`FD1i`] and [`FD4i`]) of web dither fill to transparent.

## `FEFi` **Fe**ather **F**ill Amount

[`FEFi`]: #fefi-feather-fill-amount

Parent: [`FPLv`]

Observed value range: `0x00000000`..`0x0000006c` (`0`..`108`)

## `FG0v` **F**ill **G**radient **0** (RGB)

[`FG0v`]: #fg0v-fill-gradient-0-rgb

Parent: [`FGYv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Contains:

- [`FGIv`] (x2 +) Fill Gradient Control Point
- [`FNCi`] Fill Gradient Number of Control Points

## `FG1v` **F**ill **G**radient **1** (Alpha)

[`FG1v`]: #fg1v-fill-gradient-1-alpha

Parent: [`FGYv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Contains:

- [`FGIv`] (x2 +) Fill Gradient Control Point
- [`FNCi`] Fill Gradient Number of Control Points

## `FGCi` **F**ill **G**radient Control Point **C**olour

[`FGCi`]: #fgci-fill-gradient-control-point-colour

Parent: [`FGIv`]

Value range: `0x00000000`..`0xffffffff`

## `FGDb`

[`FGDb`]: #fgdb

Parent: [`FGYv`]

Observed in versions: Adobe Fireworks CS5 - Adobe Fireworks CS6

Values:

- `false`: unknown - TODO

## `FGIv` **F**ill **G**radient Control Point

[`FGIv`]: #fgiv-fill-gradient-control-point

Parent: [`FG0v`] / [`FG1v`] / [`FGVv`]

Contains:

- [`FGCi`] Fill Gradient Control Point Colour
- [`FGPf`] Fill Gradient Control Point Position

## `FGLv` **F**ill **G**radient

[`FGLv`]: #fglv-fill-gradient

Parent: [`FPLv`] / [`GLDv`]

Contains:

- [`CATs`] Category Name
- [`FGVv`] Fill Gradient Vertices
- [`INMs`] Internal Name
- [`FGYv`]? Fill Gradient RGB + Alpha
- [`UNMs`]? User-facing Name

## `FGPf` **F**ill **G**radient Control Point **P**osition

[`FGPf`]: #fgpf-fill-gradient-control-point-position

Parent: [`FGIv`]

Observed value range: `0`..`1`

## `FGVv` **F**ill **G**radient **V**ertices

[`FGVv`]: #fgvv-fill-gradient-vertices

Parent: [`FGLv`]

Used by old versions; has a single list of stops with RGBA values at each stop. Ignored if [`FGYv`] is present.

Contains:

- [`FGIv`] (x2 +) Fill Gradient Control Point
- [`FNCi`] Fill Gradient Number of Control Points

## `FGYv` **F**ill **G**radient RGB + Alpha

[`FGYv`]: #fgyv-fill-gradient-rgb-alpha

Parent: [`FGLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Used by newer versions; has separate RGB and Alpha gradients. Replaces [`FGVv`].

Contains:

- [`FG0v`] Fill Gradient 0 (RGB)
- [`FG1v`] Fill Gradient 1 (Alpha)
- [`FGDb`]?

## `FILs` **L**abel

[`FILs`]: #fils-label

Parent: [`ALSv`] / [`ISSv`] / [`MSTv`] / [`URLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5

## `FLDv` **F**i**l**l Type **D**efinitions

[`FLDv`]: #fldv-fill-type-definitions

Parent: [`MKBv`] / [`PDCv`]

Fill styles which are offered in the UI (e.g. linear gradient, radial gradient).

Contains:

- [`FPLv`]+ Fill Pattern Properties

## `FLPi` **F**rame **L**oo**p**

[`FLPi`]: #flpi-frame-loop

Parent: [`EXPv`]

Number of times to repeat the animation. `0` = infinite, `4294967295` (`-1`) = no loop

## `FMTi` **F**or**m**a**t**

[`FMTi`]: #fmti-format

Parent: [`EXPv`]

Values:

- `0`: gif
- `1`: jpeg
- `2`: png
- `3`: bitmap / pict / tiff / wbmp (disambiguated by [`MCTi`])
- `4`: animated gif

## `FNCi` **F**ill Gradient **N**umber of **C**ontrol Points

[`FNCi`]: #fnci-fill-gradient-number-of-control-points

Parent: [`FG0v`] / [`FG1v`] / [`FGVv`]

## `FNDi` **F**rame **D**uration

[`FNDi`]: #fndi-frame-duration

Parent: [`FNMv`]

Value range: `0`..`100` (hundredths of a second)

## `FNLv` **F**rame Configuration **L**ist

[`FNLv`]: #fnlv-frame-configuration-list

Parent: [`EXPv`]

Contains:

- [`FNMv`]\* Frame Configuration

## `FNMv` **F**ra**m**e Configuration

[`FNMv`]: #fnmv-frame-configuration

Parent: [`FNLv`]

Contains:

- [`FNDi`] Frame Duration
- [`FNPi`]
- [`VISb`] Visible
- [`OBNs`]? Object Name

## `FNPi`

[`FNPi`]: #fnpi

Parent: [`FNMv`]

Values:

- `0`: unknown - TODO
- `1`: unknown - TODO

## `FOAb`

[`FOAb`]: #foab

Parent: [`TXTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `FONs` **Fon**t Family

[`FONs`]: #fons-font-family

Parent: [`BEHv`] / [`TFSv`] / [`TXTv`] / [`ZSTv`]

e.g. "Arial Black"

## `FOTb` **F**ill **O**n **T**op

[`FOTb`]: #fotb-fill-on-top

Parent: [`PTHv`] / [`TXTv`] / [`ZSTv`]

Values:

- `false`: stroke over fill
- `true`: fill over stroke

## `FPLv` **F**ill **P**attern Properties

[`FPLv`]: #fplv-fill-pattern-properties

Parent: [`FLDv`] / [`PATv`]

Contains:

- [`CATs`] Category Name
- [`FEFi`] Feather Fill Amount
- [`FPLv`.`FETi`] Fill Edge Anti-alias
- [`FRDb`]
- [`FRRi`]
- [`FSHi`] Fill Shape
- [`FSMi`] Fill Stamping Mode
- [`FTBi`] Fill Texture Blend
- [`INMs`] Internal Name
- [`RDOb`] Read-Only
- [`UNMs`] User-facing Name
- [`FD1i`]? Fill Dither Colour 1
- [`FD2i`]? Fill Dither Colour 2
- [`FD3i`]? Fill Dither Colour 3
- [`FD4i`]? Fill Dither Colour 4
- [`FDTb`]? Fill Dither Transparent
- [`FGLv`]? Fill Gradient
- [`FPTv`]? Fill Pattern Tile
- [`FSXi`]? Fill Shape Extended

## `FPLv`.`FETi` **F**ill **E**dge An**t**i-alias

[`FPLv`.`FETi`]: #fplv-feti-fill-edge-anti-alias

Parent: [`FPLv`]

Values:

- `0`: hard edges (no anti-aliasing)
- `1`: anti-aliased edges

## `FPTv` **F**ill **P**attern **T**ile

[`FPTv`]: #fptv-fill-pattern-tile

Parent: [`FPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Contains:

- [`IMGv`] Image
- [`INMs`] Internal Name
- [`UNMs`]? User-facing Name

## `FRCi` **Fr**ame **C**ount

[`FRCi`]: #frci-frame-count

Parent: [`BEHv`] / [`MKBv`] / [`MSTv`] / [`PDCv`]

The number of animation frames. It is not clear why this node is duplicated. In [`BEHv`], this is used as a frame reference.

## `FRDb`

[`FRDb`]: #frdb

Parent: [`FPLv`]

Values:

- `false`: unknown - TODO - observed in all files

## `FRRi`

[`FRRi`]: #frri

Parent: [`FPLv`]

Values:

- `0`: unknown - TODO - observed in all files

## `FRTi` Over While Down state number

[`FRTi`]: #frti-over-while-down-state-number

Parent: [`BEHv`]

Observed in version: Adobe Fireworks CS4

Frame/state number to use as the over-while-down ("hit") state.

## `FSHi` **F**ill **Sh**ape

[`FSHi`]: #fshi-fill-shape

Parent: [`FPLv`]

This is for backwards compatibility; [`FSXi`] is preferred if available

Values:

- `0`: solid
- `2`: linear
- `3`: radial or contour
- `4`: conical
- `5`: satin
- `7`: pinch
- `8`: folds
- `9`: elliptical
- `10`: rectangular
- `12`: bars
- `13`: ripple
- `14`: waves
- `15`: pattern
- `16`: web dither

## `FSMi` **F**ill **S**tamping **M**ode

[`FSMi`]: #fsmi-fill-stamping-mode

Parent: [`FPLv`]

Values:

- `1`: transparent ("blend")
- `2`: white ("blend opaque")

## `FSXi` **F**ill **S**hape E**x**tended

[`FSXi`]: #fsxi-fill-shape-extended

Parent: [`FPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Values:

- `0`: solid
- `2`: linear
- `3`: radial
- `4`: conical
- `5`: satin
- `7`: pinch
- `8`: folds
- `9`: elliptical
- `10`: rectangular
- `12`: bars
- `13`: ripple
- `14`: waves
- `15`: pattern
- `16`: web dither
- `17`: contour grad

## `FTBi` **F**ill **T**exture **B**lend

[`FTBi`]: #ftbi-fill-texture-blend

Parent: [`FPLv`]

Value range: `0`..`1000` (per mille)

## `GCLi` **G**rid **C**o**l**our

[`GCLi`]: #gcli-grid-colour

Parent: [`GRDv`]

ARGB format colour.

Value range: `0x00000000`..`0xffffffff`

## `GDCf` **G**ui**d**e **C**oordinate

[`GDCf`]: #gdcf-guide-coordinate

Parent: [`GDHv`] / [`GDVv`]

## `GDHv` **G**ui**d**es **H**orizontal

[`GDHv`]: #gdhv-guides-horizontal

Parent: [`GDSv`]

Contains:

- [`GDCf`]\* Guide Coordinate

## `GDKi` **G**ui**d**es Colour

[`GDKi`]: #gdki-guides-colour

Parent: [`GDSv`]

ARGB format colour.

Value range: `0x00000000`..`0xffffffff`

## `GDLb` **G**ui**d**es **L**ocked

[`GDLb`]: #gdlb-guides-locked

Parent: [`GDSv`]

## `GDSv` **G**ui**d**e**s**

[`GDSv`]: #gdsv-guides

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`]

Contains:

- [`GDHv`] Guides Horizontal
- [`GDVv`] Guides Vertical
- [`GDKi`]? Guides Colour
- [`GDLb`]? Guides Locked

## `GDTv` Nested **D**ic**t**ionary

[`GDTv`]: #gdtv-nested-dictionary

Parent: [`DCEv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS5

Contains:

- [`DCEv` "`alrtmsg`"."`maxmsg`"]?
- [`DCEv` "`alrtmsg`"."`minmsg`"]?
- [`DCEv` "`constants`"."`maxB`"]?
- [`DCEv` "`constants`"."`maxNodes`"]?
- [`DCEv` "`constants`"."`minB`"]?
- [`DCEv` "`constants`"."`minNodes`"]?
- [`DCEv` "`constants`"."`ppc`"]?
- [`DCEv` "`currentValues`"\[\]."`name`"]?
- [`DCEv` "`currentValues`"\[\]."`type`"]?
- [`DCEv` "`currentValues`"\[\]."`value`"]?
- [`DCEv` "`custData`"."`box`"]?
- [`DCEv` "`custData`"."`head1`"]?
- [`DCEv` "`custData`"."`head2`"]?
- [`DCEv` "`custData`"."`none`"]?
- [`DCEv` "`custData`"."`tail`"]?
- [`DCEv` "`origPoints3D`"."`p0`"]?
- [`DCEv` "`origPoints3D`"."`p0`"."`_x`"]?
- [`DCEv` "`origPoints3D`"."`p0`"."`_y`"]?
- [`DCEv` "`origPoints3D`"."`p0`"."`_z`"]?
- [`DCEv` "`origPoints3D`"."`p1`"]?
- [`DCEv` "`origPoints3D`"."`p1`"."`_x`"]?
- [`DCEv` "`origPoints3D`"."`p1`"."`_y`"]?
- [`DCEv` "`origPoints3D`"."`p1`"."`_z`"]?
- [`DCEv` "`origPoints3D`"."`p2`"]?
- [`DCEv` "`origPoints3D`"."`p2`"."`_x`"]?
- [`DCEv` "`origPoints3D`"."`p2`"."`_y`"]?
- [`DCEv` "`origPoints3D`"."`p2`"."`_z`"]?
- [`DCEv` "`origPoints3D`"."`p3`"]?
- [`DCEv` "`origPoints3D`"."`p3`"."`_x`"]?
- [`DCEv` "`origPoints3D`"."`p3`"."`_y`"]?
- [`DCEv` "`origPoints3D`"."`p3`"."`_z`"]?
- [`DCEv` "`origPoints3D`"."`p4`"]?
- [`DCEv` "`origPoints3D`"."`p4`"."`_x`"]?
- [`DCEv` "`origPoints3D`"."`p4`"."`_y`"]?
- [`DCEv` "`origPoints3D`"."`p4`"."`_z`"]?
- [`DCEv` "`origPoints3D`"."`p5`"]?
- [`DCEv` "`origPoints3D`"."`p5`"."`_x`"]?
- [`DCEv` "`origPoints3D`"."`p5`"."`_y`"]?
- [`DCEv` "`origPoints3D`"."`p5`"."`_z`"]?
- [`DCEv` "`origPoints3D`"."`p6`"]?
- [`DCEv` "`origPoints3D`"."`p6`"."`_x`"]?
- [`DCEv` "`origPoints3D`"."`p6`"."`_y`"]?
- [`DCEv` "`origPoints3D`"."`p6`"."`_z`"]?
- [`DCEv` "`origPoints3D`"."`p7`"]?
- [`DCEv` "`origPoints3D`"."`p7`"."`_x`"]?
- [`DCEv` "`origPoints3D`"."`p7`"."`_y`"]?
- [`DCEv` "`origPoints3D`"."`p7`"."`_z`"]?
- [`DCEv` "`points3D`"."`p0`"]?
- [`DCEv` "`points3D`"."`p0`"."`_x`"]?
- [`DCEv` "`points3D`"."`p0`"."`_y`"]?
- [`DCEv` "`points3D`"."`p0`"."`_z`"]?
- [`DCEv` "`points3D`"."`p1`"]?
- [`DCEv` "`points3D`"."`p1`"."`_x`"]?
- [`DCEv` "`points3D`"."`p1`"."`_y`"]?
- [`DCEv` "`points3D`"."`p1`"."`_z`"]?
- [`DCEv` "`points3D`"."`p2`"]?
- [`DCEv` "`points3D`"."`p2`"."`_x`"]?
- [`DCEv` "`points3D`"."`p2`"."`_y`"]?
- [`DCEv` "`points3D`"."`p2`"."`_z`"]?
- [`DCEv` "`points3D`"."`p3`"]?
- [`DCEv` "`points3D`"."`p3`"."`_x`"]?
- [`DCEv` "`points3D`"."`p3`"."`_y`"]?
- [`DCEv` "`points3D`"."`p3`"."`_z`"]?
- [`DCEv` "`points3D`"."`p4`"]?
- [`DCEv` "`points3D`"."`p4`"."`_x`"]?
- [`DCEv` "`points3D`"."`p4`"."`_y`"]?
- [`DCEv` "`points3D`"."`p4`"."`_z`"]?
- [`DCEv` "`points3D`"."`p5`"]?
- [`DCEv` "`points3D`"."`p5`"."`_x`"]?
- [`DCEv` "`points3D`"."`p5`"."`_y`"]?
- [`DCEv` "`points3D`"."`p5`"."`_z`"]?
- [`DCEv` "`points3D`"."`p6`"]?
- [`DCEv` "`points3D`"."`p6`"."`_x`"]?
- [`DCEv` "`points3D`"."`p6`"."`_y`"]?
- [`DCEv` "`points3D`"."`p6`"."`_z`"]?
- [`DCEv` "`points3D`"."`p7`"]?
- [`DCEv` "`points3D`"."`p7`"."`_x`"]?
- [`DCEv` "`points3D`"."`p7`"."`_y`"]?
- [`DCEv` "`points3D`"."`p7`"."`_z`"]?
- [`DCEv` "`rotation`"."`_x`"]?
- [`DCEv` "`rotation`"."`_y`"]?
- [`DCEv` "`rotation`"."`_z`"]?
- [`DCEv` "`toolTips`"."`angle`"]?
- [`DCEv` "`toolTips`"."`drag`"]?
- [`DCEv` "`toolTips`"."`head`"]?
- [`DCEv` "`toolTips`"."`inch`"]?
- [`DCEv` "`toolTips`"."`length`"]?
- [`DCEv` "`toolTips`"."`of`"]?
- [`DCEv` "`toolTips`"."`px`"]?
- [`DCEv` "`toolTips`"."`resize`"]?
- [`DCEv` "`tooltips`"."`altopt`"]?
- [`DCEv` "`tooltips`"."`inner`"]?
- [`DCEv` "`tooltips`"."`openclose`"]?
- [`DCEv` "`tooltips`"."`points`"]?
- [`DCEv` "`tooltips`"."`radius`"]?
- [`DCEv` "`tooltips`"."`radius0`"]?
- [`DCEv` "`tooltips`"."`radius1`"]?
- [`DCEv` "`tooltips`"."`reset`"]?
- [`DCEv` "`tooltips`"."`roundness1`"]?
- [`DCEv` "`tooltips`"."`roundness2`"]?
- [`DCEv` "`tooltips`"."`scale`"]?
- [`DCEv` "`tooltips`"."`sections`"]?
- [`DCEv` "`tooltips`"."`sides`"]?
- [`DCEv` "`tooltips`"."`spirals`"]?

## `GDVv` **G**ui**d**es **V**ertical

[`GDVv`]: #gdvv-guides-vertical

Parent: [`GDSv`]

Contains:

- [`GDCf`]\* Guide Coordinate

## `GFIb` **I**nterlaced

[`GFIb`]: #gfib-interlaced

Parent: [`EXPv`]

Values:

- `false`: exported image loads from top to bottom
- `true`: exported image uses interlacing

## `GLDv` **G**radient **L**ist **D**efinitions

[`GLDv`]: #gldv-gradient-list-definitions

Parent: [`MKBv`] / [`PDCv`]

Gradients which are offered in the UI as "presets".

Contains:

- [`FGLv`]+ Fill Gradient

## `GLTi` **G**IF **L**oss

[`GLTi`]: #glti-gif-loss

Parent: [`EXPv`]

Observed value range: `0x00000000`..`0x00000064` (`0`..`100`)

## `GOXf` **G**rid **O**ffset **X**

[`GOXf`]: #goxf-grid-offset-x

Parent: [`GRDv`]

## `GOYf` **G**rid **O**ffset **Y**

[`GOYf`]: #goyf-grid-offset-y

Parent: [`GRDv`]

## `GPLv` **G**rab **P**oint **L**ist

[`GPLv`]: #gplv-grab-point-list

Parent: [`DCEv` "`blue_points`"] / [`DCEv` "`green_points`"] / [`DCEv` "`red_points`"] / [`DCEv` "`rgb_points`"]

Contains:

- [`GPTv`] (x2 +) Grab Point

## `GPTv` **G**rab **P**oin**t**

[`GPTv`]: #gptv-grab-point

Parent: [`GPLv`]

A grabble point of a colour transform curve.

Contains:

- [`XLCf`] X Location
- [`YLCf`] Y Location

## `GRDv` **Gr**i**d**

[`GRDv`]: #grdv-grid

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`]

Contains:

- [`GCLi`] Grid Colour
- [`GOXf`] Grid Offset X
- [`GOYf`] Grid Offset Y
- [`GSXf`] Grid Size X
- [`GSYf`] Grid Size Y

## `GRPv` **Gr**ou**p**

[`GRPv`]: #grpv-group

Parent: [`ELMv`] / [`MRMv`]

Contains:

- [`ELMv`] Elements
- [`GRTi`] Group Type
- [`BLDi`]? Blend Mode
- [`DTAv`]? Data
- [`EFLv`]? Effect List
- [`IMGv`]? Image
- [`ISSv`]? Smart Shape
- [`LCKb`]? Lock
- [`LNKb`]? Linked
- [`MNAb`]? Mask Not Appear
- [`MRMv`]?
- [`MRXb`]?
- [`OBNs`]? Object Name
- [`OPAi`]? Opacity
- [`VISb`]? Visible
- [`ZSNs`]? Saved Style Name

## `GRTi` **Gr**oup **T**ype

[`GRTi`]: #grti-group-type

Parent: [`CSGv`] / [`GRPv`]

Values:

- `0`: regular
- `1`: grayscale mask (first element in parent node's [`ELMv`] = mask, second = masked). Note this uses white for transparent and black for opaque.
- `2`: shape mask (first element in parent node's [`ELMv`] = mask, second = masked)

## `GSLb`

[`GSLb`]: #gslb

Parent: [`EXPv`]

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `GSXf` **G**rid **S**ize **X**

[`GSXf`]: #gsxf-grid-size-x

Parent: [`GRDv`]

## `GSYf` **G**rid **S**ize **Y**

[`GSYf`]: #gsyf-grid-size-y

Parent: [`GRDv`]

## `GVRv` Dictionary **V**alue **A**rray

[`GVRv`]: #gvrv-dictionary-value-array

Parent: [`DCEv` "`currentValues`"] / [`DCEv` "`tags`"]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

Contains:

- [`GDTv`]\* Nested Dictionary

## `HICi` **Hi**ghlight **C**olour

[`HICi`]: #hici-highlight-colour

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

An ARGB colour for the popup menu border highlight.

Values:

- `4294967295`: unknown - TODO

## `HIMb`

[`HIMb`]: #himb

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Values:

- `true`: unknown - TODO

## `HITf` **H**e**i**gh**t**

[`HITf`]: #hitf-height

Parent: [`MKBv`] / [`PDCv`]

The height of the document (pixels).

## `HPXi` **H**eight **P**i**x**els

[`HPXi`]: #hpxi-height-pixels

Parent: [`IMGv`] / [`MSKv`]

The height of a raster image.

## `HSCf` **H**orizontal **Sc**ale

[`HSCf`]: #hscf-horizontal-scale

Parent: [`TFSv`] / [`TXTv`] / [`ZSTv`]

Observed value range: `0.135`..`16.352`

## `HTMb` Export **HTM**L

[`HTMb`]: #htmb-export-html

Parent: [`EXPv`]

When exporting a whole page, this controls whether it will generate a HTML document.

## `HTMi` Export **HTM**L Layout

[`HTMi`]: #htmi-export-html-layout

Parent: [`EXPv`]

Values:

- `0`: HTML and images together
- `1`: Put images in a subfolder
- `2`: unknown - TODO
- `3`: Copy HTML to clipboard

## `HTMs` Export **HTM**L Content

[`HTMs`]: #htms-export-html-content

Parent: [`URLv`]

Observed in versions: Macromedia Fireworks 4.0 - Macromedia Fireworks MX 2004

HTML content to include in place of this slice when generating a HTML document.

## `HTTs` **HT**ML S**t**yle

[`HTTs`]: #htts-html-style

Parent: [`EXPv`]

Values:

- ``
- `AIR`
- `Dreamweaver`
- `FrontPage`
- `Generic`
- `GoLive`
- `StuntAction`

## `IDSb`

[`IDSb`]: #idsb

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `ILLb`

[`ILLb`]: #illb

Parent: [`MKBv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

Observed in all Fireworks CS4 files, not seen in Fireworks 8 files. Always seems to be `false`.

Values:

- `false`: unknown

## `IMDs` **Im**age **D**irectory

[`IMDs`]: #imds-image-directory

Parent: [`EXPv`]

Directory where image was last exported, as a URI beginning with "file://"

## `IMGv` **Im**a**g**e

[`IMGv`]: #imgv-image

Parent: [`ALSv`] / [`CSGv`] / [`ELMv`] / [`FPTv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

A raster image, composed of one or more [`mkBT`] tiles. This is typically a "cached" render of vector data (e.g. rendered text)

Contains:

- [`HPXi`] Height Pixels
- [`TILv`] Tile ID List
- [`TSZi`] Tile Size
- [`WPXi`] Width Pixels
- [`XLCf`] X Location
- [`XOFf`] X Offset
- [`YLCf`] Y Location
- [`YOFf`] Y Offset
- [`BLDi`]? Blend Mode
- [`DTAv`]? Data
- [`EFLv`]? Effect List
- [`IMGv`]? Image
- [`LCKb`]? Lock
- [`OBNs`]? Object Name
- [`OPAi`]? Opacity
- [`VISb`]? Visible

## `IMPb` **I**s **M**aster **P**age

[`IMPb`]: #impb-is-master-page

Parent: [`MKBv`] / [`PDCv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

One page can be marked as the "Master Page", which is then referenced by [`MPLv`] nodes in each page (using [`PIDs`])

## `INMs` **I**nternal **N**a**m**e

[`INMs`]: #inms-internal-name

Parent: [`ALSv`] / [`BPLv`] / [`EFLv`] / [`FGLv`] / [`FPLv`] / [`FPTv`] / [`MSTv`] / [`TXBv`] / [`TXFv`] / [`URLv`]

## `IODb`

[`IODb`]: #iodb

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `ISCb` **Is** **C**losed

[`ISCb`]: #iscb-is-closed

Parent: [`PBPv`] / [`PPLv`]

Values:

- `false`: path is open
- `true`: path is closed (last point links to first)

## `ISPb` **Is** **P**rimary

[`ISPb`]: #ispb-is-primary

Parent: [`LSAv`] / [`LSEv`]

Observed in version: Adobe Fireworks CS4

Values:

- `false`: this is a reference to an element defined elsewhere, based on the [`UIDs`] value (an [`LSAv`])
- `true`: this is the primary definition of the element (an [`LSEv`])

## `ISSv` **S**mart **S**hape

[`ISSv`]: #issv-smart-shape

Parent: [`GRPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

Contains:

- [`CPSv`] Control Points
- [`FILs`] Label
- [`JSVv`] JavaScript Script
- [`MTXv`] Matrix
- [`CRSv`]?

## `ITLb` **It**a**l**ic

[`ITLb`]: #itlb-italic

Parent: [`BEHv`] / [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `false`: end italic
- `true`: begin italic

## `JPOi` **JP**EG C**o**lour

[`JPOi`]: #jpoi-jpeg-colour

Parent: [`EXPv`]

Values:

- `0`: sharp colour edges
- `1`: smooth colour edges

## `JPPb` **JP**EG **P**rogressive

[`JPPb`]: #jppb-jpeg-progressive

Parent: [`EXPv`]

Values:

- `false`: exported JPEG loads in full resolution from top to bottom
- `true`: exported JPEG is arranged to load in low quality first then gain resolution

## `JPQi` **JP**EG **Q**uality

[`JPQi`]: #jpqi-jpeg-quality

Parent: [`EXPv`]

Value range: `0`..`100` (percent)

## `JPSi` **JP**EG **S**moothing

[`JPSi`]: #jpsi-jpeg-smoothing

Parent: [`EXPv`]

Value range: `0`..`8`

## `JSBb`

[`JSBb`]: #jsbb

Parent: [`EXPv`]

Values:

- `false`: unknown - TODO - observed in all files

## `JSEb`

[`JSEb`]: #jseb

Parent: [`EXPv`]

Values:

- `false`: unknown - TODO - observed in all files

## `JSQi`

[`JSQi`]: #jsqi

Parent: [`EXPv`]

Values:

- `40`: unknown - TODO
- `90`: unknown - TODO

## `JSSs` **J**ava**S**cript **S**ubstring

[`JSSs`]: #jsss-javascript-substring

Parent: [`JSVv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

A fragment of a JavaScript script.

## `JSTb`

[`JSTb`]: #jstb

Parent: [`EXPv`]

Values:

- `true`: unknown - TODO - observed in all files

## `JSTi` **J**u**st**ification

[`JSTi`]: #jsti-justification

Parent: [`BEHv`] / [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `0`: left
- `1`: centre
- `2`: right
- `3`: fully justified
- `4`: unknown - TODO

## `JSVv` **J**ava**S**cript Script

[`JSVv`]: #jsvv-javascript-script

Parent: [`ISSv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

A JavaScript script, potentially split into multiple [`JSSs`] pieces which must be concatenated together (this is to avoid the 65535-byte string length limit of the data format). Used for calculating changes to smart shapes.

Contains:

- [`JSSs`]\* JavaScript Substring

## `KRNf`

[`KRNf`]: #krnf

Parent: [`TFSv`] / [`TXTv`]

Observed value range: `-1`..`0.14`

## `LAYv` **Lay**er

[`LAYv`]: #layv-layer

Parent: [`LSEv`] / [`LYLv`]

An individual top-level layer. Nested layers use [`LSLv`].

Contains:

- [`BKGb`]
- [`CLLv`] Animation Cell List
- [`LNMs`] Layer Name
- [`MSLb`] Special Layer
- [`URLb`]
- [`DISb`]? Display
- [`LLLi`]? Layer Nesting Level
- [`MCLb`]? Frame Changing Layer
- [`VIFv`]? Visibility per Frame

## `LCKb` **L**o**ck**

[`LCKb`]: #lckb-lock

Parent: [`ALSv`] / [`CELv`] / [`CSGv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`URLv`]

Values:

- `false`: the parent node is not locked and can be manipulated
- `true`: the parent node is locked and cannot be manipulated in the editor

## `LDMi` **L**ea**d**ing **M**ode

[`LDMi`]: #ldmi-leading-mode

Parent: [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `0`: em
- `1`: pixels

## `LEDf` **Le**a**d**ing (Line Height)

[`LEDf`]: #ledf-leading-line-height

Parent: [`TFSv`] / [`TXTv`] / [`ZSTv`]

Line height, in units defined by [`LDMi`]

Observed value range: `0`..`40`

## `LFAf` **L**e**f**t **A**nchor

[`LFAf`]: #lfaf-left-anchor

Parent: [`TXTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

This is the location of the text anchor point, which for left-aligned text or text with an explicit width is typically the same as [`LFTf`]. For centred and right-aligned text without an explicit width, `LFTf` will be set to the left bounds of the text, making it less than `LFAf`. This property is also independent of paragraph indents (see [`PINf`])

## `LFNs` **F**ile **N**ame

[`LFNs`]: #lfns-file-name

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Some file path (as a URI) related to the symbol, perhaps a Linked File Name?

## `LFTf` **L**e**ft**

[`LFTf`]: #lftf-left

Parent: [`CDMv`] / [`MSVv`] / [`NGMv`] / [`NGVv`] / [`OSSv`] / [`RCTv`] / [`TXTv`] / [`URLv`]

Distance (pixels) from left of container to left of entity.

## `LLLi` **L**ayer Nesting **L**evel

[`LLLi`]: #llli-layer-nesting-level

Parent: [`LAYv`] / [`LSLv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

Appears to be the indentation level for the layer, counting from `0` for root-level layers.

## `LMNi`

[`LMNi`]: #lmni

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Observed value range: `0x00000000`..`0x7f5fad00` (`0`..`2136976640`)

## `LNKb` **L**i**nk**ed

[`LNKb`]: #lnkb-linked

Parent: [`GRPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

For mask groups, this controls whether the mask moves when the content is moved. Note that this node is never present with a value of `true`; `true` is implied by its absence.

Values:

- `false`: Content moves independently of mask

## `LNMs` **L**ayer **N**a**m**e

[`LNMs`]: #lnms-layer-name

Parent: [`LAYv`] / [`LSLv`] / [`MPLv`]

## `LRBi` Export A**r**ea **B**ottom

[`LRBi`]: #lrbi-export-area-bottom

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Y coordinate of bottom of export area (or not present if entire image is to be exported).

## `LRLi` Export A**r**ea **L**eft

[`LRLi`]: #lrli-export-area-left

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

X coordinate of left of export area (or not present if entire image is to be exported).

## `LRRi` Export A**r**ea **R**ight

[`LRRi`]: #lrri-export-area-right

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

X coordinate of right of export area (or not present if entire image is to be exported).

## `LRTi` Export A**r**ea **T**op

[`LRTi`]: #lrti-export-area-top

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Y coordinate of top of export area (or not present if entire image is to be exported).

## `LSAv` **L**ayer **S**ource Link

[`LSAv`]: #lsav-layer-source-link

Parent: [`LYLv`]

Observed in version: Adobe Fireworks CS4

Links to an [`LSEv`] from the [`LSMv`] list in [`MKBv`].

Contains:

- [`ISPb`] Is Primary
- [`UIDs`] Unique ID

## `LSDb` HTML Multiple Nav Bars

[`LSDb`]: #lsdb-html-multiple-nav-bars

Parent: [`EXPv`]

"Export multiple nav bar HTML files (for use without frame sets)".

## `LSEv` **L**ayer **S**hared Definition

[`LSEv`]: #lsev-layer-shared-definition

Parent: [`LSMv`]

Observed in version: Adobe Fireworks CS4

Same as [`LAYv`] but defines a layer for future reference by [`LSAv`] rather than to display.

Contains:

- [`ISPb`] Is Primary
- [`LAYv`] Layer
- [`UIDs`] Unique ID

## `LSLv` **L**ayer **S**ub-**L**ayer

[`LSLv`]: #lslv-layer-sub-layer

Parent: [`ELMv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

A layer nested inside another layer. Shares the same structure as [`LAYv`].

Contains:

- [`BKGb`]
- [`CLLv`] Animation Cell List
- [`DISb`] Display
- [`LLLi`] Layer Nesting Level
- [`LNMs`] Layer Name
- [`MCLb`] Frame Changing Layer
- [`MSLb`] Special Layer
- [`URLb`]
- [`VIFv`] Visibility per Frame

## `LSMv` **L**ayer **S**hared Definitions

[`LSMv`]: #lsmv-layer-shared-definitions

Parent: [`MKBv`] / [`PDCv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

Contains definitions of layers which are shared between pages and can be referenced by [`LSAv`] nodes. Appears to always be empty in [`PDCv`] nodes.

Contains:

- [`LSEv`]\* Layer Shared Definition

## `LSSi` HTML **S**lice **S**pacing

[`LSSi`]: #lssi-html-slice-spacing

Parent: [`EXPv`]

Values:

- `0`: Single Table - No Spacers
- `1`: 1-Pixel Transparent Spacer
- `3`: Nested Tables - No Spacers

## `LSUb`

[`LSUb`]: #lsub

Parent: [`EXPv`]

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `LUTs` **L**ast **U**pdate **T**ime

[`LUTs`]: #luts-last-update-time

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Last update time for this symbol, in `d/M/yy HH:mm` format.

## `LXDs` **L**ast E**x**port **D**irectory

[`LXDs`]: #lxds-last-export-directory

Parent: [`EXPv`] / [`MKBv`] / [`PDCv`]

The last directory where the file was exported. The copy in [`MKBv`] / [`PDCv`] is presumably for backwards compatibility.

## `LXFs` **L**ast E**x**port **F**ilename

[`LXFs`]: #lxfs-last-export-filename

Parent: [`MKBv`] / [`PDCv`]

## `LYLv` **L**a**y**er **L**ist

[`LYLv`]: #lylv-layer-list

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`]

A list of layers, ordered from back to front.

Contains:

- [`LAYv`]+ Layer
- [`LSAv`]\* Layer Source Link
- [`MPLv`]? Master Page Link

## `M00f` **M**atrix Element **0**, **0**

[`M00f`]: #m00f-matrix-element-0-0

Parent: [`ATMv`] / [`MTXv`]

## `M01f` **M**atrix Element **0**, **1**

[`M01f`]: #m01f-matrix-element-0-1

Parent: [`ATMv`] / [`MTXv`]

## `M02f` **M**atrix Element **0**, **2**

[`M02f`]: #m02f-matrix-element-0-2

Parent: [`ATMv`] / [`MTXv`]

## `M10f` **M**atrix Element **1**, **0**

[`M10f`]: #m10f-matrix-element-1-0

Parent: [`ATMv`] / [`MTXv`]

## `M11f` **M**atrix Element **1**, **1**

[`M11f`]: #m11f-matrix-element-1-1

Parent: [`ATMv`] / [`MTXv`]

## `M12f` **M**atrix Element **1**, **2**

[`M12f`]: #m12f-matrix-element-1-2

Parent: [`ATMv`] / [`MTXv`]

## `M20f` **M**atrix Element **2**, **0**

[`M20f`]: #m20f-matrix-element-2-0

Parent: [`ATMv`] / [`MTXv`]

## `M21f` **M**atrix Element **2**, **1**

[`M21f`]: #m21f-matrix-element-2-1

Parent: [`ATMv`] / [`MTXv`]

## `M22f` **M**atrix Element **2**, **2**

[`M22f`]: #m22f-matrix-element-2-2

Parent: [`ATMv`] / [`MTXv`]

## `MCCi`

[`MCCi`]: #mcci

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5

Appears to represent a 4-character ASCII string.

Values:

- `1296777817`: "MKBY"

## `MCLb` Fra**m**e **C**hanging **L**ayer

[`MCLb`]: #mclb-frame-changing-layer

Parent: [`LAYv`] / [`LSLv`]

Values:

- `false`: layer is shared across all frames; only the first [`CELv`] has content; the rest are stubs
- `true`: layer has unique content for each frame

## `MCTi`

[`MCTi`]: #mcti

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5

Image format disambiguation if [`FMTi`] is `3`. Represents a 4-character ASCII string.

Values:

- `1112363040`: "BMP "
- `1346978644`: "PICT"
- `1414088262`: "TIFF"
- `1463962960`: "WBMP"

## `MIDi` Text **C**olour Hover

[`MIDi`]: #midi-text-colour-hover

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

A BGRA (?) colour for the text of highlighted menu items.

Value range: `0x00000000`..`0xffffffff`

## `MIHi` **M**enu **I**tem **H**eight

[`MIHi`]: #mihi-menu-item-height

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

## `MITi` **M**enu **I**ndent **T**ext

[`MITi`]: #miti-menu-indent-text

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

## `MIVb` **M**enu **I**tems **V**ertical

[`MIVb`]: #mivb-menu-items-vertical

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Values:

- `false`: menu is arranged horizontally
- `true`: menu is arranged vertically

## `MIWi` **M**enu **I**tem **W**idth

[`MIWi`]: #miwi-menu-item-width

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

## `MKBv` Document

[`MKBv`]: #mkbv-document

Parent: [Root]

Defines any layer content which is shared between pages (in [`LSMv`] as [`LSEv`] nodes with a [`UIDs`] for individual pages to reference), and includes a slightly reduced copy of page 1 (first [`PDCv`]), including a copy of the master page's layers (if set). This is possibly for backwards compatibility. The `mkBS` chunk (Fireworks attribution) _only_ defines [`MKBv`] and does not include any [`PDCv`] chunks; this may be a glimpse of an old file structure.

Contains:

- [`BGCi`] Background Colour
- [`FRCi`]+ Frame Count
- [`HITf`] Height
- [`LYLv`] Layer List
- [`RESf`] Resolution
- [`RSUi`] Resolution Unit
- [`WIDf`] Width
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`EFDv`]? Effect Definitions
- [`EXPv`]? Export Options
- [`FLDv`]? Fill Type Definitions
- [`GDSv`]? Guides
- [`GLDv`]? Gradient List Definitions
- [`GRDv`]? Grid
- [`ILLb`]?
- [`IMPb`]? Is Master Page
- [`LSMv`]? Layer Shared Definitions
- [`LXDs`]? Last Export Directory
- [`LXFs`]? Last Export Filename
- [`MNFv`]?
- [`MSLv`]? Symbol Definition List
- [`MSVv`]?
- [`OSAi`]? Onion Skinning After Frames
- [`OSBi`]? Onion Skinning Before Frames
- [`PATv`]? Pattern
- [`PGNs`]? Page Name
- [`PIDs`]? Page ID
- [`PILb`]? Page Is Linked
- [`PLLv`]? Brush Definitions
- [`RQNi`]?
- [`VRMi`]?
- [`VRSi`]?
- [`ZSLv`]? Saved Style List

## `MNAb` **M**ask **N**ot **A**ppear

[`MNAb`]: #mnab-mask-not-appear

Parent: [`GRPv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

For mask groups, this controls whether the mask image itself is visible (toggled in Fireworks via "Show fill and stroke"). Note that this node is never present with a value of `false`; `false` is implied by its absence.

Values:

- `true`: Mask is hidden.

## `MNDs` **D**efault ALT Tag

[`MNDs`]: #mnds-default-alt-tag

Parent: [`MNFv`]

## `MNFv`

[`MNFv`]: #mnfv

Parent: [`MKBv`] / [`PDCv`]

Contains:

- [`MNDs`]? Default ALT Tag
- [`MNTi`]?
- [`URLv`]? Image Slice / Hotspot

## `MNTi`

[`MNTi`]: #mnti

Parent: [`MNFv`]

Observed in version: Macromedia Fireworks 4.0

Values:

- `1`: unknown - TODO

## `MOXf`

[`MOXf`]: #moxf

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Observed value range: `0`..`0`

## `MOYf`

[`MOYf`]: #moyf

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

Observed value range: `0`..`0`

## `MPLv` **M**aster **P**age **L**ink

[`MPLv`]: #mplv-master-page-link

Parent: [`LYLv`]

Observed in versions: Adobe Fireworks CS3 - Adobe Fireworks CS4

References all layers from another [`PDCv`] (the "Master Page"), by [`PIDs`]. The referenced layers are atomic, but the whole structure can be displayed / hidden for this specific page as part of the reference.

Contains:

- [`DISb`] Display
- [`LNMs`] Layer Name
- [`PIDs`] Page ID
- [`VIFv`] Visibility per Frame

## `MRMv`

[`MRMv`]: #mrmv

Parent: [`GRPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Grayscale mask definition ?

Contains:

- [`GRPv`]? Group
- [`PTHv`]? Path

## `MRXb`

[`MRXb`]: #mrxb

Parent: [`GRPv`]

Observed in versions: Macromedia Fireworks 4.0 - Macromedia Fireworks MX 2004

Values:

- `true`: unknown - TODO

## `MSGs` **M**e**s**sa**g**e

[`MSGs`]: #msgs-message

Parent: [`MSTv`]

Observed in version: Macromedia Fireworks 4.0

## `MSKv` **M**a**sk**

[`MSKv`]: #mskv-mask

Parent: [`MSVv`] / [`OSSv`] / [`TXBv`] / [`TXFv`]

A raster mask, composed of one or more [`mkBT`] tiles.

Contains:

- [`HPXi`] Height Pixels
- [`TILv`] Tile ID List
- [`TSZi`] Tile Size
- [`WPXi`] Width Pixels

## `MSLb` **S**pecial **L**ayer

[`MSLb`]: #mslb-special-layer

Parent: [`LAYv`] / [`LSLv`]

Values:

- `false`: regular layer
- `true`: special layer (currently: "Web Layer") - presumably blocks actions like deletion

## `MSLv` **S**ymbol Definition **L**ist

[`MSLv`]: #mslv-symbol-definition-list

Parent: [`MKBv`] / [`PDCv`]

Contains:

- [`MSTv`]\* Symbol Definition

## `MSNi` **S**ymbol Unique **N**umber

[`MSNi`]: #msni-symbol-unique-number

Parent: [`ALSv`] / [`BEHv`] / [`MSTv`] / [`URLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

A 32-bit number which uniquely defines a symbol / entity in the document. Used to link [`ALSv`] instances to [`MSTv`] definitions, and [`BEHv`] actions to [`URLv`] slices.

Observed value range: `0x00000000`..`0x7ffddba1` (`0`..`2147343265`)

## `MSSv`

[`MSSv`]: #mssv

Parent: [`PDCv`]

Observed in version: Adobe Fireworks CS4

Contains:

- [`OSSv`]

## `MSTv` **S**ymbol Definition

[`MSTv`]: #mstv-symbol-definition

Parent: [`MSLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5.1

A node containing many of the same elements as a page ([`PDCv`]), defining a symbol which can be referenced multiple times in the document by [`ALSv`] nodes with [`MSNi`] IDs.

Contains:

- [`ATSb`]
- [`BGCi`] Background Colour
- [`DVLb`]
- [`FRCi`] Frame Count
- [`GDSv`] Guides
- [`GRDv`] Grid
- [`IDSb`]
- [`IODb`]
- [`LUTs`] Last Update Time
- [`LYLv`] Layer List
- [`MOXf`]
- [`MOYf`]
- [`MSNi`] Symbol Unique Number
- [`OSAi`] Onion Skinning After Frames
- [`OSBi`] Onion Skinning Before Frames
- [`UNMs`] User-facing Name
- [`A2Ts`]? Anchor Link Alt Text
- [`ALTs`]? Anchor Link Target
- [`BEVv`]? Behaviour List
- [`EXPv`]? Export Options
- [`FILs`]? Label
- [`INMs`]? Internal Name
- [`LFNs`]? File Name
- [`LMNi`]?
- [`MSGs`]? Message
- [`MSYi`]? Symbol Type
- [`NGSv`]? Nine Slice Guide
- [`WJSs`]? Widget JavaScript

## `MSVv`

[`MSVv`]: #msvv

Parent: [`MKBv`] / [`PDCv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Contains:

- [`LFTf`] Left
- [`MSKv`] Mask
- [`TOPf`] Top

## `MSYi` **S**ymbol T**y**pe

[`MSYi`]: #msyi-symbol-type

Parent: [`MSTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Graphic symbols omit this node rather than setting it to 0.

Values:

- `1`: button
- `2`: animation

## `MTXv` **M**a**t**ri**x**

[`MTXv`]: #mtxv-matrix

Parent: [`ALSv`] / [`ISSv`] / [`PRIv`] / [`TXTv`]

A 3&times;3 matrix.

Contains:

- [`M00f`] Matrix Element 0, 0
- [`M01f`] Matrix Element 0, 1
- [`M02f`] Matrix Element 0, 2
- [`M10f`] Matrix Element 1, 0
- [`M11f`] Matrix Element 1, 1
- [`M12f`] Matrix Element 1, 2
- [`M20f`] Matrix Element 2, 0
- [`M21f`] Matrix Element 2, 1
- [`M22f`] Matrix Element 2, 2

## `NDIi` **N**umber of **D**ashes

[`NDIi`]: #ndii-number-of-dashes

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Defines which of [`DO1i`] / [`DF1i`] .. [`DO3i`] / [`DF3i`] are used

Value range: `0`..`3`

## `NGCf` **N**ine Slice **G**uide **C**ontrol

[`NGCf`]: #ngcf-nine-slice-guide-control

Parent: [`NGSv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

A set of 4 ordered control points for the 9-slice guide: top, bottom, left, right

## `NGKi` **N**ine Slice **G**uide Colour

[`NGKi`]: #ngki-nine-slice-guide-colour

Parent: [`NGSv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

An ARGB (or BGRA?) colour for the 9-slice guide-lines.

Value range: `0x00000000`..`0xffffffff`

## `NGLb` **N**ine Slice **G**uide **L**ocked

[`NGLb`]: #nglb-nine-slice-guide-locked

Parent: [`NGSv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

## `NGMv` **N**ine Slice **G**uide Shape Bounds

[`NGMv`]: #ngmv-nine-slice-guide-shape-bounds

Parent: [`NGSv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

Bounds of the symbol's content, relative to the symbol origin.

Contains:

- [`BOTf`] Bottom
- [`LFTf`] Left
- [`RITf`] Right
- [`TOPf`] Top

## `NGSv` **N**ine **S**lice Guide

[`NGSv`]: #ngsv-nine-slice-guide

Parent: [`MSTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

Contains:

- [`NGCf`] (x4) Nine Slice Guide Control
- [`NGKi`] Nine Slice Guide Colour
- [`NGLb`] Nine Slice Guide Locked
- [`NGMv`] Nine Slice Guide Shape Bounds
- [`NGVv`] Nine Slice Guide Limits

## `NGVv` **N**ine Slice **G**uide Limits

[`NGVv`]: #ngvv-nine-slice-guide-limits

Parent: [`NGSv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

Bounds of the space available for the 9-slice guide, relative to the symbol origin (defines a space a few pixels larger than the canvas).

Contains:

- [`BOTf`] Bottom
- [`LFTf`] Left
- [`RITf`] Right
- [`TOPf`] Top

## `NM4i` HTML Slice Export **N**a**m**e Part

[`NM4i`]: #nm4i-html-slice-export-name-part

Parent: [`NM4v`]

Values:

- `0`: None
- `1`: Row Column (r3_c2, r4_c7...)
- `2`: Slice # (A,B,C...)
- `3`: Slice # (a,b,c...)
- `4`: Slice # (1, 2, 3...)
- `5`: Slice # (01, 02, 03...)
- `6`: doc.name (filename without path or extension)
- `7`: "slice"
- `15`: "_"
- `16`: "."
- `17`: " "
- `18`: "-"

## `NM4v` HTML Slice Export **N**a**m**es

[`NM4v`]: #nm4v-html-slice-export-names

Parent: [`EXPv`]

6 name parts which are concatenated together to form a filename when exporting HTML slices.

Contains:

- [`NM4i`] (x6) HTML Slice Export Name Part

## `NMFi` HTML Slice Export **N**a**m**e **F**rame Part

[`NMFi`]: #nmfi-html-slice-export-name-frame-part

Parent: [`NMFv`]

Values:

- `0`: None
- `1`: State # (f2, f3, f4...)
- `2`: State # (2, 3, 4...)
- `3`: Rollover (over, down, overdown)
- `4`: Abbreviated (o, d, od)
- `5`: "_"
- `6`: "."
- `7`: " "
- `8`: "-"

## `NMFv` HTML Slice Export **N**a**m**es **F**rame

[`NMFv`]: #nmfv-html-slice-export-names-frame

Parent: [`EXPv`]

2 name parts which are concatenated together (and combined with [`NM4v`]) to form a filename when exporting HTML slices with states.

Contains:

- [`NMFi`] (x2) HTML Slice Export Name Frame Part

## `NMSs`

[`NMSs`]: #nmss

Parent: [`OSSv`]

Observed in version: Adobe Fireworks CS4

Values:

- `Default`: unknown - TODO

## `NS0s`

[`NS0s`]: #ns0s

Parent: [`EXPv`]

Observed in versions: Adobe Fireworks CS5 - Adobe Fireworks CS6

Values:

- ``: unknown - TODO

## `NS1s`

[`NS1s`]: #ns1s

Parent: [`EXPv`]

Observed in versions: Adobe Fireworks CS5 - Adobe Fireworks CS6

Values:

- ``: unknown - TODO

## `NS2s`

[`NS2s`]: #ns2s

Parent: [`EXPv`]

Observed in versions: Adobe Fireworks CS5 - Adobe Fireworks CS6

Values:

- ``: unknown - TODO

## `NS3s`

[`NS3s`]: #ns3s

Parent: [`EXPv`]

Observed in versions: Adobe Fireworks CS5 - Adobe Fireworks CS6

Values:

- ``: unknown - TODO

## `NSDf` **N**ext **S**egment **D**istance

[`NSDf`]: #nsdf-next-segment-distance

Parent: [`PBTv`]

Cached length (in pixels) of the upcoming curve segment. Omitted if the segment has a length of 0 or is the last in the path (and the path is not closed).

## `NYSb`

[`NYSb`]: #nysb

Parent: [`EXPv`]

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `OBNs` **Ob**ject **N**ame

[`OBNs`]: #obns-object-name

Parent: [`ALSv`] / [`CPTv`] / [`CSGv`] / [`FNMv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`URLv`]

## `ONCb` **On** **C**ontrol Point

[`ONCb`]: #oncb-on-control-point

Parent: [`PPTv`]

Values:

- `false`: point is an interpolation between control points
- `true`: point is exactly on a control point

## `OPAi` **Opa**city

[`OPAi`]: #opai-opacity

Parent: [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`]

Value range: `0` (transparent) .. `1000` (opaque)

## `OPQb`

[`OPQb`]: #opqb

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `ORIi` **Ori**entation

[`ORIi`]: #orii-orientation

Parent: [`TXTv`]

Values:

- `0`: left-to-right
- `1`: top-to-bottom
- `3`: top-to-bottom (TODO: unknown distinction from `1`)

## `OSAi` **O**nion **S**kinning **A**fter Frames

[`OSAi`]: #osai-onion-skinning-after-frames

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`]

Number of frames after the current frame to display for onion skinning.

Value range: `0`..inf

## `OSBi` **O**nion **S**kinning **B**efore Frames

[`OSBi`]: #osbi-onion-skinning-before-frames

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`]

Number of frames before the current frame to display for onion skinning.

Value range: `0`..inf

## `OSSv`

[`OSSv`]: #ossv

Parent: [`MSSv`]

Observed in version: Adobe Fireworks CS4

Contains:

- [`LFTf`] Left
- [`MSKv`] Mask
- [`NMSs`]
- [`TOPf`] Top

## `OVHb` **Ov**erride **H**eight

[`OVHb`]: #ovhb-override-height

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Values:

- `false`: cell height is calculated automatically
- `true`: cell height is set manually

## `OVWb` **Ov**erride **W**idth

[`OVWb`]: #ovwb-override-width

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Values:

- `false`: cell width is calculated automatically
- `true`: cell width is set manually

## `PALv` **Pal**ette

[`PALv`]: #palv-palette

Parent: [`EXPv`]

Contains multiple colours, each beginning with [`FCLi`] and followed by zero or more attributes

Contains:

- [`BCLi`]? Brush Colour
- [`CLLb`]\* Colour Locked
- [`CLMb`]? Colour Mapped
- [`CLTb`]\* Colour Transparent
- [`FCLi`]\* Fill Colour

## `PATv` **Pat**tern

[`PATv`]: #patv-pattern

Parent: [`MKBv`] / [`PDCv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

Contains:

- [`BCLi`] Brush Colour
- [`FCLi`] Fill Colour
- [`BPLv`]? Brush Property List
- [`FPLv`]? Fill Pattern Properties
- [`TXBv`]? Texture Brush
- [`TXFv`]? Texture Fill

## `PBLv` **P**ath **B**ezier **L**ist

[`PBLv`]: #pblv-path-bezier-list

Parent: [`PTHv`]

Contains:

- [`PBPv`]+ Path Bezier Points

## `PBPv` **P**ath **B**ezier **P**oints

[`PBPv`]: #pbpv-path-bezier-points

Parent: [`PBLv`] / [`URLv`]

Contains:

- [`BSLf`]
- [`ISCb`] Is Closed
- [`PPCi`] Path Point Count
- [`PBTv`]\* Path Bezier Point

## `PBTv` **P**ath **B**ezier Poin**t**

[`PBTv`]: #pbtv-path-bezier-point

Parent: [`PBPv`]

Contains:

- [`BZLv`] Bezier Sub-Points List
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`CRVb`]? Is Curve
- [`NSDf`]? Next Segment Distance
- [`PPLv`]? Path Point List
- [`RNDi`]? Random Seed
- [`XPCf`]? X Primary Control
- [`XSCf`]? X Secondary Control
- [`YPCf`]? Y Primary Control
- [`YSCf`]? Y Secondary Control

## `PCFb`

[`PCFb`]: #pcfb

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`]

Values:

- `true`: unknown - TODO

## `PCLv` **P**ath **C**ontour **L**ist

[`PCLv`]: #pclv-path-contour-list

Parent: [`PTHv`]

List of interpolated paths. The source of truth for this is a [`PBLv`].

Contains:

- [`PPLv`]\* Path Point List

## `PDCv` **P**age

[`PDCv`]: #pdcv-page

Parent: [Root]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

An individual page. Contains frames ("states") and layers. Layers shared to all pages reference a source defined in [`MKBv`].

Contains:

- [`BGCi`] Background Colour
- [`EFDv`] Effect Definitions
- [`EXPv`] Export Options
- [`FLDv`] Fill Type Definitions
- [`FRCi`] (x2) Frame Count
- [`GDSv`] Guides
- [`GLDv`] Gradient List Definitions
- [`HITf`] Height
- [`IMPb`] Is Master Page
- [`LSMv`] Layer Shared Definitions
- [`LYLv`] Layer List
- [`MNFv`]
- [`OSAi`] Onion Skinning After Frames
- [`OSBi`] Onion Skinning Before Frames
- [`PATv`] Pattern
- [`PGNs`] Page Name
- [`PIDs`] Page ID
- [`PLLv`] Brush Definitions
- [`RESf`] Resolution
- [`RQNi`]
- [`RSUi`] Resolution Unit
- [`VRMi`]
- [`VRSi`]
- [`WIDf`] Width
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`GRDv`]? Grid
- [`LXDs`]? Last Export Directory
- [`LXFs`]? Last Export Filename
- [`MSLv`]? Symbol Definition List
- [`MSSv`]?
- [`MSVv`]?
- [`PILb`]? Page Is Linked

## `PEXf` Fill **P**oint 2 (**E**) **X**

[`PEXf`]: #pexf-fill-point-2-e-x

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

## `PEYf` Fill **P**oint 2 (**E**) **Y**

[`PEYf`]: #peyf-fill-point-2-e-y

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

## `PFXf` Fill **P**oint 3 (**F**) **X**

[`PFXf`]: #pfxf-fill-point-3-f-x

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

## `PFYf` Fill **P**oint 3 (**F**) **Y**

[`PFYf`]: #pfyf-fill-point-3-f-y

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

## `PGNs` **P**a**g**e **N**ame

[`PGNs`]: #pgns-page-name

Parent: [`MKBv`] / [`PDCv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

## `PIDs` **P**age **ID**

[`PIDs`]: #pids-page-id

Parent: [`MKBv`] / [`MPLv`] / [`PDCv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

A UUID for the page.

## `PILb` **P**age **I**s **L**inked

[`PILb`]: #pilb-page-is-linked

Parent: [`MKBv`] / [`PDCv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

Marks page as "linked" to the "Master Page". Linked pages are automatically updated with new properties set on the master page (e.g. background colour).

## `PINf` **P**aragraph **In**dent

[`PINf`]: #pinf-paragraph-indent

Parent: [`TFSv`] / [`TXTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Amount to indent the first line of the paragraph by. This indent is relative to [`LFAf`] and may cause the bounds ([`LFTf`]) to change.

Value range: `0`..inf (pixels)

## `PLDi` **P**a**l**ette **D**ither Level

[`PLDi`]: #pldi-palette-dither-level

Parent: [`EXPv`]

Value range: `0` (none) .. `100` (full)

## `PLLv` Brush Definitions

[`PLLv`]: #pllv-brush-definitions

Parent: [`MKBv`] / [`PDCv`]

Preset brushes offered in the UI

Contains:

- [`BPLv`] (x2 +) Brush Property List

## `PLNi` **P**a**l**ette **N**umber of entries

[`PLNi`]: #plni-palette-number-of-entries

Parent: [`EXPv`]

## `PLOb` **P**a**l**ette Pruning

[`PLOb`]: #plob-palette-pruning

Parent: [`EXPv`]

Values:

- `false`: unused colours remain in palette
- `true`: unused colours are removed

## `PLRi` **P**a**l**ette **R**emaining Colours

[`PLRi`]: #plri-palette-remaining-colours

Parent: [`EXPv`]

Number of colours actually used in palette.

Observed value range: `0x00000000`..`0x00000100` (`0`..`256`)

## `PLTi` **P**a**l**e**t**te **T**ype

[`PLTi`]: #plti-palette-type

Parent: [`EXPv`]

Values:

- `0`: none
- `1`: adaptive
- `2`: uniform
- `3`: black & white
- `4`: macintosh
- `5`: windows
- `6`: exact
- `7`: web 216

## `POPi`

[`POPi`]: #popi

Parent: [`PTHv`]

Observed in versions: Adobe Fireworks CS5 - Adobe Fireworks CS6

Values:

- `1`: unknown - TODO
- `3`: unknown - TODO
- `17605`: unknown - TODO
- `6553632`: unknown - TODO
- `7471221`: unknown - TODO
- `287513044`: unknown - TODO
- `1862288896`: unknown - TODO
- `4294967295`: unknown - TODO

## `PPCi` **P**ath **P**oint **C**ount

[`PPCi`]: #ppci-path-point-count

Parent: [`PBPv`] / [`PPLv`]

Equal to the number of [`PBTv`] nodes contained in the parent node

## `PPLv` **P**ath **P**oint **L**ist

[`PPLv`]: #pplv-path-point-list

Parent: [`PBTv`] / [`PCLv`]

List of points defining an interpolated path. The source of truth for this path will be a [`PBPv`].

Contains:

- [`PPTv`]+ Path Point
- [`ISCb`]? Is Closed
- [`PPCi`]? Path Point Count

## `PPTv` **P**ath **P**oin**t**

[`PPTv`]: #pptv-path-point

Parent: [`PPLv`]

Contains:

- [`PRSf`] Pressure
- [`VELf`] Velocity
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`DURi`]? Duration
- [`ONCb`]? On Control Point
- [`RNDi`]? Random Seed

## `PREb` **Pre**load

[`PREb`]: #preb-preload

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

If true, target images will be preloaded when the page loads.

## `PRIv` **Pri**mitive

[`PRIv`]: #priv-primitive

Parent: [`PTHv`]

The source shape and transformation which created the current path. Allows modifying properties such as corner radius.

Contains:

- [`MTXv`] Matrix
- [`PCFb`]
- [`PEXf`] Fill Point 2 (E) X
- [`PEYf`] Fill Point 2 (E) Y
- [`PFXf`] Fill Point 3 (F) X
- [`PFYf`] Fill Point 3 (F) Y
- [`PSXf`] Fill Point 1 (S) X
- [`PSYf`] Fill Point 1 (S) Y
- [`RCTv`] Rectangle
- [`EFLv`]? Effect List
- [`RDMb`]? Border Radius Maintain

## `PRPb`

[`PRPb`]: #prpb

Parent: [`PTHv`]

Observed in version: Adobe Fireworks CS6

Values:

- `true`: unknown - TODO

## `PRSf` **Pr**e**s**sure

[`PRSf`]: #prsf-pressure

Parent: [`BAZv`] / [`PPTv`]

Value range: `0`..`1`

## `PSAf` **P**aragraph **S**pace **A**fter

[`PSAf`]: #psaf-paragraph-space-after

Parent: [`TFSv`] / [`TXTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Paragraph bottom margin (pixels)

## `PSBf` **P**aragraph **S**pace **B**efore

[`PSBf`]: #psbf-paragraph-space-before

Parent: [`TFSv`] / [`TXTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Paragraph top margin (pixels)

## `PSXf` Fill **P**oint 1 (**S**) **X**

[`PSXf`]: #psxf-fill-point-1-s-x

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

## `PSYf` Fill **P**oint 1 (**S**) **Y**

[`PSYf`]: #psyf-fill-point-1-s-y

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

## `PTHv` **P**a**th**

[`PTHv`]: #pthv-path

Parent: [`CSGv`] / [`ELMv`] / [`MRMv`] / [`TAPv`]

Contains:

- [`BRPi`] Brush Placement
- [`FOTb`] Fill On Top
- [`PATv`] Pattern
- [`PBLv`] Path Bezier List
- [`PCFb`]
- [`PCLv`] Path Contour List
- [`PEXf`] Fill Point 2 (E) X
- [`PEYf`] Fill Point 2 (E) Y
- [`PFXf`] Fill Point 3 (F) X
- [`PFYf`] Fill Point 3 (F) Y
- [`PSXf`] Fill Point 1 (S) X
- [`PSYf`] Fill Point 1 (S) Y
- [`PTTi`] Path Templated
- [`RNDi`] Random Seed
- [`TOXf`] Texture Offset X
- [`TOYf`] Texture Offset Y
- [`AGMb`]?
- [`BLDi`]? Blend Mode
- [`DTAv`]? Data
- [`EFLv`]? Effect List
- [`EOFb`]? Even-Odd Fill Rule
- [`IMGv`]? Image
- [`LCKb`]? Lock
- [`OBNs`]? Object Name
- [`OPAi`]? Opacity
- [`POPi`]?
- [`PRIv`]? Primitive
- [`PRPb`]?
- [`VISb`]? Visible
- [`ZSNs`]? Saved Style Name

## `PTNi` **P**alette **T**ra**n**sparency Type

[`PTNi`]: #ptni-palette-transparency-type

Parent: [`EXPv`]

Values:

- `0`: none
- `1`: index
- `2`: alpha
- `3`: alpha (TODO: what is distinction from `2`?)

## `PTSf` Font **P**oin**t** **S**ize

[`PTSf`]: #ptsf-font-point-size

Parent: [`BEHv`] / [`TFSv`] / [`TXTv`] / [`ZSTv`]

## `PTTi` **P**a**t**h **T**emplated

[`PTTi`]: #ptti-path-templated

Parent: [`PTHv`] / [`TXTv`]

Values:

- `0`: Path is not defined by a template (e.g. freehand or modified)
- `1`: Path is defined by a template (e.g. ellipse, rectangle). If the shape is a rounded rectangle, it is defined in [`PRIv`].

## `RCTv` **R**e**ct**angle

[`RCTv`]: #rctv-rectangle

Parent: [`PRIv`]

Contains:

- [`BOTf`] Bottom
- [`LFTf`] Left
- [`RDSf`] Border Radius
- [`RITf`] Right
- [`TOPf`] Top

## `RDMb` Border **R**a**d**ius **M**aintain

[`RDMb`]: #rdmb-border-radius-maintain

Parent: [`PRIv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

[`RDSf`] is always measured as a percentage (0-100), but if this is `true`, it will be recalculated when the shape changes size to maintain an absolute radius size.

Values:

- `false`: [`RDSf`] remains constant; radius is proportional to shape size
- `true`: [`RDSf`] is recalculated when the shape is resized to maintain a constant absolute radius

## `RDOb` **R**ea**d**-**O**nly

[`RDOb`]: #rdob-read-only

Parent: [`BPLv`] / [`FPLv`]

## `RDSf` Border **R**a**d**iu**s**

[`RDSf`]: #rdsf-border-radius

Parent: [`RCTv`]

This is always measured as a percentage (0-100), but if [`RDMb`] is set on the parent, it will be recalculated when the shape changes size to maintain an absolute radius size.

Value range: `0`..`100` (percent)

## `RELb`

[`RELb`]: #relb

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Values:

- `true`: unknown - TODO

## `RESf` **Res**olution

[`RESf`]: #resf-resolution

Parent: [`MKBv`] / [`PDCv`]

The resolution of the image. Units are specified in [`RSUi`].

## `RIAf`

[`RIAf`]: #riaf

Parent: [`TXTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

`0` if [`ATEb`] is `true` (i.e. if the text box auto-resizes to its content). Otherwise this is a positive integer of unknown meaning (TODO).

Observed value range: `0`..`1022`

## `RITf` **Ri**gh**t**

[`RITf`]: #ritf-right

Parent: [`CDMv`] / [`NGMv`] / [`NGVv`] / [`RCTv`] / [`TXTv`] / [`URLv`]

Distance (pixels) from left of container to right of entity.

## `RKNf` **K**er**n**ing

[`RKNf`]: #rknf-kerning

Parent: [`TFSv`] / [`TXTv`] / [`ZSTv`]

Observed value range: `-1`..`5`

## `RMOb` **R**evert on **M**ouse **O**ut

[`RMOb`]: #rmob-revert-on-mouse-out

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

If true, swapped images will automatically be reverted on mouse out.

## `RNDi` **R**a**nd**om Seed

[`RNDi`]: #rndi-random-seed

Parent: [`PBTv`] / [`PPTv`] / [`PTHv`] / [`TXTv`]

Value range: `0x00000000`..`0xffffffff`

## `ROLi` **Rol**l Behaviour

[`ROLi`]: #roli-roll-behaviour

Parent: [`BEHv`]

Observed in version: Adobe Fireworks CS4

Used by Set Nav Bar behaviour.

Values:

- `0`: over (state 2) + down (state 3)
- `1`: over (state 2) + down (state 3) + over-while-down (state 4)
- `2`: down (state 3)
- `3`: down (state 3) + over-while-down (state 4)

## `RQNi`

[`RQNi`]: #rqni

Parent: [`MKBv`] / [`PDCv`]

Observed value range: `0x0001184a`..`0x7fef22d7` (`71754`..`2146378455`)

## `RSUi` **R**e**s**olution **U**nit

[`RSUi`]: #rsui-resolution-unit

Parent: [`MKBv`] / [`PDCv`]

The units for [`RESf`]

Values:

- `0`: pixels per inch
- `1`: pixels per centimeter

## `SHAi` **S**ensitivity to **H**orizontal on **A**ngle

[`SHAi`]: #shai-sensitivity-to-horizontal-on-angle

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SHBi` **S**ensitivity to **H**orizontal on **B**lackness

[`SHBi`]: #shbi-sensitivity-to-horizontal-on-blackness

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SHHi` **S**ensitivity to **H**orizontal on **H**ue

[`SHHi`]: #shhi-sensitivity-to-horizontal-on-hue

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SHLi` **S**ensitivity to **H**orizontal on **L**ightness

[`SHLi`]: #shli-sensitivity-to-horizontal-on-lightness

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SHOi` **S**ensitivity to **H**orizontal on **O**pacity

[`SHOi`]: #shoi-sensitivity-to-horizontal-on-opacity

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SHRi` **S**ensitivity to **H**orizontal on Scatte**r**

[`SHRi`]: #shri-sensitivity-to-horizontal-on-scatter

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SHSi` **S**ensitivity to **H**orizontal on **S**aturation

[`SHSi`]: #shsi-sensitivity-to-horizontal-on-saturation

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SHZi` **S**ensitivity to **H**orizontal on Si**z**e

[`SHZi`]: #shzi-sensitivity-to-horizontal-on-size

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SPAi` **S**ensitivity to **P**ressure on **A**ngle

[`SPAi`]: #spai-sensitivity-to-pressure-on-angle

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SPBi` **S**ensitivity to **P**ressure on **B**lackness

[`SPBi`]: #spbi-sensitivity-to-pressure-on-blackness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SPHi` **S**ensitivity to **P**ressure on **H**ue

[`SPHi`]: #sphi-sensitivity-to-pressure-on-hue

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SPLi` **S**ensitivity to **P**ressure on **L**ightness

[`SPLi`]: #spli-sensitivity-to-pressure-on-lightness

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SPOi` **S**ensitivity to **P**ressure on **O**pacity

[`SPOi`]: #spoi-sensitivity-to-pressure-on-opacity

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SPRi` **S**ensitivity to **P**ressure on Scatte**r**

[`SPRi`]: #spri-sensitivity-to-pressure-on-scatter

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SPSi` **S**ensitivity to **P**ressure on **S**aturation

[`SPSi`]: #spsi-sensitivity-to-pressure-on-saturation

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SPZi` **S**ensitivity to **P**ressure on Si**z**e

[`SPZi`]: #spzi-sensitivity-to-pressure-on-size

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SRAi` **S**ensitivity to **R**andom on **A**ngle

[`SRAi`]: #srai-sensitivity-to-random-on-angle

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SRBi` **S**ensitivity to **R**andom on **B**lackness

[`SRBi`]: #srbi-sensitivity-to-random-on-blackness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SRHi` **S**ensitivity to **R**andom on **H**ue

[`SRHi`]: #srhi-sensitivity-to-random-on-hue

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SRLi` **S**ensitivity to **R**andom on **L**ightness

[`SRLi`]: #srli-sensitivity-to-random-on-lightness

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SROi` **S**ensitivity to **R**andom on **O**pacity

[`SROi`]: #sroi-sensitivity-to-random-on-opacity

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SRRi` **S**ensitivity to **R**andom on Scatte**r**

[`SRRi`]: #srri-sensitivity-to-random-on-scatter

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SRSi` **S**ensitivity to **R**andom on **S**aturation

[`SRSi`]: #srsi-sensitivity-to-random-on-saturation

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SRZi` **S**ensitivity to **R**andom on Si**z**e

[`SRZi`]: #srzi-sensitivity-to-random-on-size

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SSAi` **S**ensitivity to **S**peed on **A**ngle

[`SSAi`]: #ssai-sensitivity-to-speed-on-angle

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SSBi` **S**ensitivity to **S**peed on **B**lackness

[`SSBi`]: #ssbi-sensitivity-to-speed-on-blackness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SSHi` **S**ensitivity to **S**peed on **H**ue

[`SSHi`]: #sshi-sensitivity-to-speed-on-hue

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SSLi` **S**ensitivity to **S**peed on **L**ightness

[`SSLi`]: #ssli-sensitivity-to-speed-on-lightness

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SSOi` **S**ensitivity to **S**peed on **O**pacity

[`SSOi`]: #ssoi-sensitivity-to-speed-on-opacity

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SSRi` **S**ensitivity to **S**peed on Scatte**r**

[`SSRi`]: #ssri-sensitivity-to-speed-on-scatter

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SSSi` **S**ensitivity to **S**peed on **S**aturation

[`SSSi`]: #sssi-sensitivity-to-speed-on-saturation

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SSZi` **S**ensitivity to **S**peed on Si**z**e

[`SSZi`]: #sszi-sensitivity-to-speed-on-size

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVAi` **S**ensitivity to **V**ertical on **A**ngle

[`SVAi`]: #svai-sensitivity-to-vertical-on-angle

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SVBi` **S**ensitivity to **V**ertical on **B**lackness

[`SVBi`]: #svbi-sensitivity-to-vertical-on-blackness

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SVHi` **S**ensitivity to **V**ertical on **H**ue

[`SVHi`]: #svhi-sensitivity-to-vertical-on-hue

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SVLi` **S**ensitivity to **V**ertical on **L**ightness

[`SVLi`]: #svli-sensitivity-to-vertical-on-lightness

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SVOi` **S**ensitivity to **V**ertical on **O**pacity

[`SVOi`]: #svoi-sensitivity-to-vertical-on-opacity

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SVRi` **S**ensitivity to **V**ertical on Scatte**r**

[`SVRi`]: #svri-sensitivity-to-vertical-on-scatter

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SVSi` **S**ensitivity to **V**ertical on **S**aturation

[`SVSi`]: #svsi-sensitivity-to-vertical-on-saturation

Parent: [`BPLv`]

Observed in version: Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `SVZi` **S**ensitivity to **V**ertical on Si**z**e

[`SVZi`]: #svzi-sensitivity-to-vertical-on-size

Parent: [`BPLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Value range: `0`..`1000` (per mille)

## `TA1i` **T**ext **A**nti-Aliasing Sharpness

[`TA1i`]: #ta1i-text-anti-aliasing-sharpness

Parent: [`TXTv`] / [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Value range: `0`..`255`

## `TA2i` **T**ext **A**nti-Aliasing Strength

[`TA2i`]: #ta2i-text-anti-aliasing-strength

Parent: [`TXTv`] / [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Value range: `0`..`255`

## `TAAi` **T**ext **A**nti-**A**lias

[`TAAi`]: #taai-text-anti-alias

Parent: [`TXTv`] / [`ZSTv`]

Values:

- `0`: smooth / none
- `1`: crisp
- `2`: strong
- `3`: system
- `4`: custom

## `TALi`

[`TALi`]: #tali

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Values:

- `0`: unknown - TODO
- `1`: unknown - TODO

## `TAMi` **T**ext **A**lign**m**ent

[`TAMi`]: #tami-text-alignment

Parent: [`TAPv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Controls text orientation when following a path.

Values:

- `0`: rotate
- `1`: no rotate
- `2`: skew vertical
- `3`: skew horizontal

## `TAPv` **T**ext **A**long **P**ath

[`TAPv`]: #tapv-text-along-path

Parent: [`TXTv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS4

Contains:

- [`CHOf`] Character Offset
- [`PTHv`] Path
- [`TAMi`] Text Alignment

## `TDTs` Cell (**TD**) **T**ext

[`TDTs`]: #tdts-cell-td-text

Parent: [`URLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

## `TFSv` **T**ext **F**ormatted **S**tring

[`TFSv`]: #tfsv-text-formatted-string

Parent: [`TXTv`]

Contains a list of formatting operations and text runs.

Contains:

- [`BLSf`]\* Baseline Shift
- [`BOLb`]\* Bold
- [`FCLi`]\* Fill Colour
- [`FONs`]\* Font Family
- [`HSCf`]\* Horizontal Scale
- [`ITLb`]\* Italic
- [`JSTi`]\* Justification
- [`KRNf`]\*
- [`LDMi`]\* Leading Mode
- [`LEDf`]\* Leading (Line Height)
- [`PINf`]\* Paragraph Indent
- [`PSAf`]\* Paragraph Space After
- [`PSBf`]\* Paragraph Space Before
- [`PTSf`]\* Font Point Size
- [`RKNf`]\* Kerning
- [`TRNs`]\* Text Run
- [`UNDb`]\* Underline

## `TFTi` **T**ext **F**low

[`TFTi`]: #tfti-text-flow

Parent: [`TXTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Values:

- `0`: normal
- `1`: fit to width (defined in [`BOAf`])
- `2`: follow path
- `3`: fit inside shape

## `TIAb`

[`TIAb`]: #tiab

Parent: [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Values:

- `true`: unknown - TODO

## `TIDi` **T**ile **ID**

[`TIDi`]: #tidi-tile-id

Parent: [`TILv`]

References a [`mkBT`] chunk tile by its ID

## `TILv` **T**ile **I**D **L**ist

[`TILv`]: #tilv-tile-id-list

Parent: [`IMGv`] / [`MSKv`]

An ordered list of tiles (or matte blocks) which combine to make the image or mask. The tiles are arranged left-to-right, top-to-bottom. The number of tiles per row can be calculated from the [`WPXi`] and [`TSZi`] values of the parent node. [`WPXi`] and [`HPXi`] can also be used to clip the right column and bottom row of tiles to the correct size.

Contains:

- [`TIDi`]\* Tile ID
- [`TMCi`]\* Tile Matte Colour
- [`TMMi`]?

## `TMCi` **T**ile **M**atte **C**olour

[`TMCi`]: #tmci-tile-matte-colour

Parent: [`TILv`]

Substitute for [`TIDi`] if only a solid colour is required for the tile area. Represents an ARGB colour.

Value range: `0x00000000`..`0xffffffff`

## `TMMi`

[`TMMi`]: #tmmi

Parent: [`TILv`]

Observed in version: Macromedia Fireworks MX 2004

Values:

- `0`: unknown - TODO

## `TMOi` Menu Delay

[`TMOi`]: #tmoi-menu-delay

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Menu delay in milliseconds

## `TOAf`

[`TOAf`]: #toaf

Parent: [`TXTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Observed value range: `-82.365051`..`997`

## `TOPf` **Top**

[`TOPf`]: #topf-top

Parent: [`CDMv`] / [`MSVv`] / [`NGMv`] / [`NGVv`] / [`OSSv`] / [`RCTv`] / [`TXTv`] / [`URLv`]

Distance (pixels) from top of container to top of entity.

## `TOSi` **T**ext Anti-Aliasing **O**ver-**S**ample

[`TOSi`]: #tosi-text-anti-aliasing-over-sample

Parent: [`TXTv`] / [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Values:

- `4`
- `8`
- `16`

## `TOXf` **T**exture **O**ffset **X**

[`TOXf`]: #toxf-texture-offset-x

Parent: [`PTHv`] / [`TXTv`]

## `TOYf` **T**exture **O**ffset **Y**

[`TOYf`]: #toyf-texture-offset-y

Parent: [`PTHv`] / [`TXTv`]

## `TPWi`

[`TPWi`]: #tpwi

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Not seen in Fireworks MX files. In Fireworks 8+, this seems to always be `0`

Values:

- `0`: unknown

## `TRMb` Export **Tr**i**m**med Images

[`TRMb`]: #trmb-export-trimmed-images

Parent: [`EXPv`]

## `TRNs` **T**ext **R**u**n**

[`TRNs`]: #trns-text-run

Parent: [`BEHv`] / [`TFSv`]

Used for parts of text which share formatting options, and also used by [`BEHv`] for defining popup menus.

## `TSLi` **T**ype of **Sl**ice

[`TSLi`]: #tsli-type-of-slice

Parent: [`URLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5

Values:

- `0`: foreground
- `2`: background
- `3`: unknown - TODO

## `TSZi` **T**ile **S**i**z**e

[`TSZi`]: #tszi-tile-size

Parent: [`IMGv`] / [`MSKv`]

The size (width and height) of the [`mkBT`] tiles used in this image.

Values:

- `128`: tile is ARGB 128x128
- `256`: tile is grayscale 256x256

## `TTDb` **T**ooltip **T**racks **D**rag

[`TTDb`]: #ttdb-tooltip-tracks-drag

Parent: [`CPTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

Grab handle config controlled by `toolTipTracksDrag` in JavaScript.

Values:

- `false`: Tooltip disappears when the handle is dragged
- `true`: Tooltip remains visible while the handle is dragged, and updates its contents live

## `TTPs` **T**ool**t**i**p**

[`TTPs`]: #ttps-tooltip

Parent: [`CPTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS5

## `TXBv` **T**e**x**ture **B**rush

[`TXBv`]: #txbv-texture-brush

Parent: [`PATv`]

Contains:

- [`INMs`] Internal Name
- [`MSKv`] Mask

## `TXFv` **T**e**x**ture **F**ill

[`TXFv`]: #txfv-texture-fill

Parent: [`PATv`]

Contains:

- [`INMs`] Internal Name
- [`MSKv`] Mask
- [`UNMs`]? User-facing Name

## `TXTv` **T**e**xt**

[`TXTv`]: #txtv-text

Parent: [`ELMv`]

A text entity. The formatted text itself is defined in the [`TFSv`] subnode.

Contains:

- [`ATEb`] Auto-Enlarge
- [`ATKb`] Auto-Kern
- [`BLSf`] Baseline Shift
- [`BOLb`] Bold
- [`BOTf`] Bottom
- [`BRPi`] Brush Placement
- [`FONs`] Font Family
- [`FOTb`] Fill On Top
- [`HSCf`] Horizontal Scale
- [`ITLb`] Italic
- [`JSTi`] Justification
- [`KRNf`]
- [`LDMi`] Leading Mode
- [`LEDf`] Leading (Line Height)
- [`LFTf`] Left
- [`ORIi`] Orientation
- [`PATv`] Pattern
- [`PTSf`] Font Point Size
- [`PTTi`] Path Templated
- [`RITf`] Right
- [`RKNf`] Kerning
- [`RNDi`] Random Seed
- [`TAAi`] Text Anti-Alias
- [`TFSv`] Text Formatted String
- [`TOPf`] Top
- [`TOXf`] Texture Offset X
- [`TOYf`] Texture Offset Y
- [`UNDb`] Underline
- [`XFMi`]
- [`AIDi`]?
- [`BLDi`]? Blend Mode
- [`BOAf`]? Bounds
- [`CFTs`]? Font Typeface
- [`DTAv`]? Data
- [`EFLv`]? Effect List
- [`FOAb`]?
- [`IMGv`]? Image
- [`LCKb`]? Lock
- [`LFAf`]? Left Anchor
- [`MTXv`]? Matrix
- [`OBNs`]? Object Name
- [`OPAi`]? Opacity
- [`PCFb`]?
- [`PEXf`]? Fill Point 2 (E) X
- [`PEYf`]? Fill Point 2 (E) Y
- [`PFXf`]? Fill Point 3 (F) X
- [`PFYf`]? Fill Point 3 (F) Y
- [`PINf`]? Paragraph Indent
- [`PSAf`]? Paragraph Space After
- [`PSBf`]? Paragraph Space Before
- [`PSXf`]? Fill Point 1 (S) X
- [`PSYf`]? Fill Point 1 (S) Y
- [`RIAf`]?
- [`TA1i`]? Text Anti-Aliasing Sharpness
- [`TA2i`]? Text Anti-Aliasing Strength
- [`TAPv`]? Text Along Path
- [`TFTi`]? Text Flow
- [`TOAf`]?
- [`TOSi`]? Text Anti-Aliasing Over-Sample
- [`VISb`]? Visible
- [`ZSNs`]? Saved Style Name

## `UIDs` **U**nique **ID**

[`UIDs`]: #uids-unique-id

Parent: [`LSAv`] / [`LSEv`]

Observed in version: Adobe Fireworks CS4

A UUID which is unique within the file. [`LSAv`] uses this to reference shared content defined in [`LSEv`] nodes.

## `UNDb` **Und**erline

[`UNDb`]: #undb-underline

Parent: [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `false`: end underline
- `true`: begin underline

## `UNMs` **U**ser-facing **N**a**m**e

[`UNMs`]: #unms-user-facing-name

Parent: [`BEHv`] / [`BPLv`] / [`EFLv`] / [`FGLv`] / [`FPLv`] / [`FPTv`] / [`MSTv`] / [`TXFv`]

## `URLb`

[`URLb`]: #urlb

Parent: [`LAYv`] / [`LSLv`]

Values:

- `false`: Regular layer
- `true`: Web Layer (slices)

## `URLv` Image Slice / Hotspot

[`URLv`]: #urlv-image-slice-hotspot

Parent: [`ELMv`] / [`MNFv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5

Contains:

- [`BOTf`] Bottom
- [`FCLi`] Fill Colour
- [`LFTf`] Left
- [`RITf`] Right
- [`TOPf`] Top
- [`URSi`] URL Hotspot Shape
- [`A2Ts`]? Anchor Link Alt Text
- [`ALTs`]? Anchor Link Target
- [`BEVv`]? Behaviour List
- [`CBAi`]? Cell Background (Slice) Attachment
- [`CBHi`]? Cell Background (Slice) Horizontal Position
- [`CBRi`]? Cell Background (Slice) Repeat
- [`CBTb`]?
- [`CBVi`]? Cell Background (Slice) Vertical Position
- [`CHVi`]? Cell Horizontal Value
- [`CVVi`]? Cell Vertical Value
- [`DTAv`]? Data
- [`EXPv`]? Export Options
- [`FILs`]? Label
- [`HTMs`]? Export HTML Content
- [`INMs`]? Internal Name
- [`LCKb`]? Lock
- [`MSNi`]? Symbol Unique Number
- [`OBNs`]? Object Name
- [`PBPv`]? Path Bezier Points
- [`TDTs`]? Cell (TD) Text
- [`TSLi`]? Type of Slice

## `URSi` **UR**L Hotspot **S**hape

[`URSi`]: #ursi-url-hotspot-shape

Parent: [`URLv`]

Observed in versions: Macromedia Fireworks 4.0 - Adobe Fireworks CS5

Values:

- `0`: rectangle
- `1`: ellipse
- `2`: polygon

## `VELf` **Vel**ocity

[`VELf`]: #velf-velocity

Parent: [`BAZv`] / [`PPTv`]

Observed value range: `0`..`3.644531`

## `VERi`

[`VERi`]: #veri

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Values:

- `1`: unknown - TODO

## `VIFv` **Vi**sibility per **F**rame

[`VIFv`]: #vifv-visibility-per-frame

Parent: [`LAYv`] / [`LSLv`] / [`MPLv`]

An ordered list of [`VISb`] nodes controlling this layer's visibility in each frame.

Contains:

- [`VISb`]+ Visible

## `VISb` **Vis**ible

[`VISb`]: #visb-visible

Parent: [`ALSv`] / [`CELv`] / [`CPTv`] / [`CSGv`] / [`FNMv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`VIFv`]

## `VRMi`

[`VRMi`]: #vrmi

Parent: [`MKBv`] / [`PDCv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

Not seen in Fireworks 8 files.

Values:

- `1`: unknown - TODO

## `VRSi`

[`VRSi`]: #vrsi

Parent: [`MKBv`] / [`PDCv`]

Observed in versions: Macromedia Fireworks 8 - Adobe Fireworks CS6

Not seen in Fireworks 8 files.

Values:

- `9`: unknown - TODO
- `10`: unknown - TODO

## `WIDf` **Wid**th

[`WIDf`]: #widf-width

Parent: [`MKBv`] / [`PDCv`]

The width of the document (pixels).

## `WJSs` **W**idget **J**ava**S**cript

[`WJSs`]: #wjss-widget-javascript

Parent: [`MSTv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

## `WPVs` **W**idget **P**arameter **V**alues

[`WPVs`]: #wpvs-widget-parameter-values

Parent: [`ALSv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS4

Possibly a legacy version of [`DTAv`], using the format `name1&|&value1&|&type1&;&name2&|&value2&|&type2` (i.e. `&;&` separates fields, `&|&` separates properties within a field, and each field is defined by a name, value, and type).

## `WPXi` **W**idth **P**i**x**els

[`WPXi`]: #wpxi-width-pixels

Parent: [`IMGv`] / [`MSKv`]

The width of a raster image.

## `XDAb`

[`XDAb`]: #xdab

Parent: [`EXPv`]

Something to do with the latest export settings (TODO)

Values:

- `false`: unknown - TODO
- `true`: unknown - TODO

## `XFMi`

[`XFMi`]: #xfmi

Parent: [`ALSv`] / [`TXTv`]

Values:

- `0`: unknown - TODO
- `1`: unknown - TODO

## `XFSi` E**x**port **F**ormat **S**election

[`XFSi`]: #xfsi-export-format-selection

Parent: [`EXPv`]

The last used format for exporting.

Values:

- `0`: PDF
- `1`: HTML and Images
- `2`: Images
- `4`: Director
- `5`: CSS and Images
- `6`: Layers
- `7`: States
- `8`: Pages
- `9`: MXML and Images
- `10`: Lotus Domino Designer

## `XLCf` **X** **L**o**c**ation

[`XLCf`]: #xlcf-x-location

Parent: [`BEHv`] / [`CPTv`] / [`GPTv`] / [`IMGv`] / [`MKBv`] / [`PBTv`] / [`PDCv`] / [`PPTv`]

## `XMDi`

[`XMDi`]: #xmdi

Parent: [`EXPv`]

Something to do with the latest export settings (TODO)

Values:

- `0`: unknown - TODO
- `1`: unknown - TODO
- `2`: unknown - TODO

## `XOFf` **X** **Of**fset

[`XOFf`]: #xoff-x-offset

Parent: [`IMGv`]

Value range: `0`..`100` (hundredths of a pixel?)

## `XPCf` **X** **P**rimary **C**ontrol

[`XPCf`]: #xpcf-x-primary-control

Parent: [`PBTv`]

## `XSCf` **X** **S**econdary **C**ontrol

[`XSCf`]: #xscf-x-secondary-control

Parent: [`PBTv`]

## `XSLf`

[`XSLf`]: #xslf

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Observed value range: `-134`..`-5`

## `XSZi` Export **X** **S**i**z**e

[`XSZi`]: #xszi-export-x-size

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Width (in pixels) of the exported image, if [`CNSb`] is `true`.

## `XTMi` **X**H**TM**L

[`XTMi`]: #xtmi-xhtml

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Values:

- `0`: Export with HTML syntax
- `1`: Export with XHTML syntax

## `YLCf` **Y** **L**o**c**ation

[`YLCf`]: #ylcf-y-location

Parent: [`BEHv`] / [`CPTv`] / [`GPTv`] / [`IMGv`] / [`MKBv`] / [`PBTv`] / [`PDCv`] / [`PPTv`]

## `YOFf` **Y** **Of**fset

[`YOFf`]: #yoff-y-offset

Parent: [`IMGv`]

Value range: `0`..`100` (hundredths of a pixel?)

## `YPCf` **Y** **P**rimary **C**ontrol

[`YPCf`]: #ypcf-y-primary-control

Parent: [`PBTv`]

## `YSCf` **Y** **S**econdary **C**ontrol

[`YSCf`]: #yscf-y-secondary-control

Parent: [`PBTv`]

## `YSLf`

[`YSLf`]: #yslf

Parent: [`BEHv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Observed value range: `7`..`28`

## `YSZi` Export **Y** **S**i**z**e

[`YSZi`]: #yszi-export-y-size

Parent: [`EXPv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS4

Height (in pixels) of the exported image, if [`CNSb`] is `true`.

## `ZSFi`

[`ZSFi`]: #zsfi

Parent: [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Values:

- `432`: unknown - TODO
- `447`: unknown - TODO
- `508`: unknown - TODO
- `511`: unknown - TODO

## `ZSLv` Saved **S**tyle **L**ist

[`ZSLv`]: #zslv-saved-style-list

Parent: [`MKBv`]

Observed in versions: Adobe Fireworks - Adobe Fireworks CS6

Contains:

- [`ZSTv`]\* Saved Style

## `ZSNs` Saved **S**tyle **N**ame

[`ZSNs`]: #zsns-saved-style-name

Parent: [`GRPv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

## `ZSOi`

[`ZSOi`]: #zsoi

Parent: [`ZSTv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Values:

- `0`: unknown - TODO
- `8`: unknown - TODO
- `31`: unknown - TODO

## `ZSTv` Saved **St**yle

[`ZSTv`]: #zstv-saved-style

Parent: [`BEHv`] / [`ZSLv`]

Observed in versions: Macromedia Fireworks MX - Adobe Fireworks CS6

Contains:

- [`ATKb`] Auto-Kern
- [`BOLb`] Bold
- [`BRPi`] Brush Placement
- [`FABi`]
- [`FALi`]
- [`FARi`]
- [`FATi`]
- [`FONs`] Font Family
- [`FOTb`] Fill On Top
- [`HSCf`] Horizontal Scale
- [`IMGv`] (x2) Image
- [`ITLb`] Italic
- [`JSTi`] Justification
- [`LDMi`] Leading Mode
- [`LEDf`] Leading (Line Height)
- [`PATv`] Pattern
- [`PEXf`] Fill Point 2 (E) X
- [`PEYf`] Fill Point 2 (E) Y
- [`PFXf`] Fill Point 3 (F) X
- [`PFYf`] Fill Point 3 (F) Y
- [`PSXf`] Fill Point 1 (S) X
- [`PSYf`] Fill Point 1 (S) Y
- [`PTSf`] Font Point Size
- [`RKNf`] Kerning
- [`TAAi`] Text Anti-Alias
- [`TIAb`]
- [`UNDb`] Underline
- [`ZSFi`]
- [`ZSNs`] Saved Style Name
- [`ZSOi`]
- [`CFTs`]? Font Typeface
- [`EFLv`]? Effect List
- [`TA1i`]? Text Anti-Aliasing Sharpness
- [`TA2i`]? Text Anti-Aliasing Strength
- [`TOSi`]? Text Anti-Aliasing Over-Sample

[`mkBT`]: ./Fireworks.md#mkbt
