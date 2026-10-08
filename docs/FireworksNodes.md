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

Parent: [`URLv`]

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

Final opacity for animation-type symbol. Defaults to 1000.

Value range: `0` (transparent) .. `1000` (opaque)

## `AGMb`

[`AGMb`]: #agmb

Parent: [`PTHv`]

Seen this set to `false` in one file, but it's usually `true`; seems to have no impact on rendering.

Values:

- `false`: unknown - TODO
- `true`: normal (TODO)

## `ALNi`

[`ALNi`]: #alni

Parent: [`ALSv`]

Appears to be some sort of randomly-generated ID

## `ALSv` **S**ymbol Instance

[`ALSv`]: #alsv-symbol-instance

Parent: [`ELMv`]

References a [`MSTv`] symbol definition with a matching [`MSNi`] ID.

Contains:

- [`MSNi`] Symbol Unique Number
- [`MTXv`] Matrix
- [`LCKb`] Lock
- [`XFMi`]
- [`OBNs`]? Object Name
- [`DTAv`] Data
- [`ANNi`] Animation Number of Frames
- [`ANXf`] Animation X Shift
- [`ANYf`] Animation Y Shift
- [`ASCf`] Animation Scaling
- [`ATMv`] Symbol Transform Matrix
- [`ALNi`]?
- [`ANRi`]? Animation Rotation
- [`ASOi`]? Animation Start Opacity
- [`AEOi`]? Animation End Opacity
- [`IMGv`]? Image

## `ALTs` **A**nchor **L**ink **T**arget

[`ALTs`]: #alts-anchor-link-target

Parent: [`URLv`]

## `ANNi` **An**imation **N**umber of Frames

[`ANNi`]: #anni-animation-number-of-frames

Parent: [`ALSv`]

Number of frames of animation to generate for the animation-type symbol (this generates a smooth transition using [`ANRi`], [`ASCf`], [`ASOi`], [`AEOi`], [`ANXf`], and [`ANYf`]).

Value range: `1`..inf

## `ANRi` **An**imation **R**otation

[`ANRi`]: #anri-animation-rotation

Parent: [`ALSv`]

Number of degrees of clockwise rotation to apply to an animation-type symbol. Uses a **signed** 32-bit value. Negative numbers are counter-clockwise.

Value range: `-360`..`360` (degrees)

## `ANXf` **An**imation **X** Shift

[`ANXf`]: #anxf-animation-x-shift

Parent: [`ALSv`]

Amount of x translation (pixels) to apply to an animation-type symbol. Uses a **signed** 32-bit value.

## `ANYf` **An**imation **Y** Shift

[`ANYf`]: #anyf-animation-y-shift

Parent: [`ALSv`]

Amount of y translation (pixels) to apply to an animation-type symbol. Uses a **signed** 32-bit value.

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

Scaling to apply to an animation-type symbol

Value range: `0`..`250` (percent)

## `ASOi` **A**nimation **S**tart **O**pacity

[`ASOi`]: #asoi-animation-start-opacity

Parent: [`ALSv`]

Initial opacity for animation-type symbol.

Value range: `0` (transparent) .. `1000` (opaque)

## `ASTi`

[`ASTi`]: #asti

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

Values:

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

- [`VELf`]? Velocity
- [`PRSf`]? Pressure

## `BBKi` **B**rush **B**lac**k**ness

[`BBKi`]: #bbki-brush-blackness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `BBLi`

[`BBLi`]: #bbli

Parent: [`BPLv`]

Values:

- `0`: unknown - TODO - observed in all files

## `BCLi` **B**rush **C**o**l**our

[`BCLi`]: #bcli-brush-colour

Parent: [`PALv`] / [`PATv`]

ABGR format colour.

Value range: `0x00000000`..`0xffffffff`

## `BCNi` **B**rush **C**o**n**centration

[`BCNi`]: #bcni-brush-concentration

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `BDIi` **B**rush **Di**ameter

[`BDIi`]: #bdii-brush-diameter

Parent: [`BPLv`]

Value range: `0`..inf (pixels)

## `BEEi`

[`BEEi`]: #beei

Parent: [`BEHv`]

Values:

- `0`: unknown - TODO

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

Used for popup menus. Possibly for other behaviours too.

For popup menus, [`TRNs`] contains the menu definition in the format:

```text
{{"Item 1","link","target",{{"Nested 1","nested link","nested target",{}}{"Nested 2","","",{{"Sub-nested","","",{}}}}}}{"Item 2","","",{}}}
```

Contains:

- [`BETi`] Behaviour Type
- [`BEEi`]
- [`CDTs`]
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`TRNs`] Text Run
- [`BEHv`.`FCLi`] Menu Item Text Colour
- [`BEHv`.`FETi`]
- [`JSTi`] Justification
- [`VERi`]
- [`TMOi`] Menu Delay
- [`XSLf`]
- [`YSLf`]
- [`RELb`]
- [`CSPi`] Menu Item Cell Spacing
- [`CPDi`] Menu Item Cell Padding
- [`OPQb`]
- [`HICi`] Highlight Colour
- [`CSHi`] Colour Shadow
- [`BOCi`] Border Colour
- [`BOSi`] Border Size
- [`OVWb`] Override Width
- [`OVHb`] Override Height
- [`MITi`] Menu Indent Text
- [`MIVb`] Menu Items Vertical
- [`MIDi`] Text Colour Hover
- [`MIWi`] Menu Item Width
- [`MIHi`] Menu Item Height
- [`HIMb`]
- [`BOLb`] Bold
- [`ITLb`] Italic
- [`FONs`] Font Family
- [`PTSf`] Font Point Size
- [`ATEb`] Auto-Enlarge
- [`BEHv`.`BCLi`] Background Colour
- [`BEHv`.`BCMi`] Background Colour Hover
- [`ZSTv`]\*

## `BEHv`.`BCLi` **B**ackground **C**o**l**our

[`BEHv`.`BCLi`]: #behv-bcli-background-colour

Parent: [`BEHv`]

ABGR format colour.

Value range: `0x00000000`..`0xffffffff`

## `BEHv`.`BCMi` **B**ackground **C**olour Hover

[`BEHv`.`BCMi`]: #behv-bcmi-background-colour-hover

Parent: [`BEHv`]

A BGRA colour for the background of highlighted menu items.

Value range: `0x00000000`..`0xffffffff`

## `BEHv`.`FCLi` **M**enu **I**tem **T**ext Colour

[`BEHv`.`FCLi`]: #behv-fcli-menu-item-text-colour

Parent: [`BEHv`]

ABGR (?) format colour for the text of highlighted menu items.

Value range: `0x00000000`..`0xffffffff`

## `BEHv`.`FETi`

[`BEHv`.`FETi`]: #behv-feti

Parent: [`BEHv`]

Values:

- `4294967295`: unknown - TODO

## `BETi` **Be**haviour **T**ype

[`BETi`]: #beti-behaviour-type

Parent: [`BEHv`]

Values:

- `9`: popup menu

## `BEVv` **Be**haviour List

[`BEVv`]: #bevv-behaviour-list

Parent: [`URLv`]

Contains:

- [`BEHv`] Behaviour

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

ABGR format colour.

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

Parent: [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`]

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

Values:

- `-10`: subscript
- `0`: normal
- `10`: superscript

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

Width to fit text to, if [`TFTi`] is `1`.

## `BOCi` **Bo**rder **C**olour

[`BOCi`]: #boci-border-colour

Parent: [`BEHv`]

An ABGR colour for the popup menu border.

Values:

- `4283782485`: unknown - TODO

## `BOLb` **Bol**d

[`BOLb`]: #bolb-bold

Parent: [`BEHv`] / [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `false`: end bold
- `true`: begin bold

## `BOSi` **Bo**rder **S**ize

[`BOSi`]: #bosi-border-size

Parent: [`BEHv`]

Size (in pixels) of the popup menu border.

## `BOTf` **Bot**tom

[`BOTf`]: #botf-bottom

Parent: [`CDMv`] / [`NGMv`] / [`NGVv`] / [`RCTv`] / [`TXTv`] / [`URLv`]

Distance (pixels) from top of container to bottom of entity.

## `BPLv` **B**rush **P**roperty **L**ist

[`BPLv`]: #bplv-brush-property-list

Parent: [`PATv`] / [`PLLv`]

Contains:

- [`CATs`] Category
- [`INMs`] Internal Name
- [`RDOb`]
- [`BANi`] Brush Angle
- [`BASi`] Brush Aspect
- [`BDIi`] Brush Diameter
- [`BMMi`] Brush Max Count
- [`BMSi`] Brush Min Size
- [`BSEi`] Brush Soft Edges
- [`BSFi`] Brush Soft Edges Function
- [`BSHi`] Brush Shape
- [`BBLi`]
- [`BBKi`] Brush Blackness
- [`BCNi`] Brush Concentration
- [`BEFi`] Brush Edge Function
- [`BRTi`] Brush Type
- [`BFBi`] Brush Feedback
- [`BFRi`] Brush Flow Rate
- [`BNTi`] Brush Number of Tips
- [`BSPi`] Brush Spacing
- [`BTBi`] Brush Texture Blend
- [`BTEi`] Brush Texture Edge
- [`BTSi`] Brush Tip Spacing
- [`BSMi`] Brush Tip Spacing Mode
- [`BPLv`.`BCMi`] Brush Tip Colouring Mode
- [`BIAb`] Brush Is Anti-Aliased
- [`NDIi`]? Number of Dashes
- [`DO1i`]? Dash On 1
- [`DO2i`]? Dash On 2
- [`DO3i`]? Dash On 3
- [`DF1i`]? Dash Off 1
- [`DF2i`]? Dash Off 2
- [`DF3i`]? Dash Off 3
- [`SPZi`]? Sensitivity to Pressure on Size
- [`SSZi`]? Sensitivity to Speed on Size
- [`SPOi`]? Sensitivity to Pressure on Opacity
- [`SSOi`]? Sensitivity to Speed on Opacity
- [`SPBi`]? Sensitivity to Pressure on Blackness
- [`SSBi`]? Sensitivity to Speed on Blackness
- [`SRZi`]? Sensitivity to Random on Size
- [`SRBi`]? Sensitivity to Random on Blackness
- [`SRHi`]? Sensitivity to Random on Hue
- [`SRAi`]? Sensitivity to Random on Angle
- [`SRSi`]? Sensitivity to Random on Saturation
- [`SRRi`]? Sensitivity to Random on Scatter
- [`SROi`]? Sensitivity to Random on Opacity
- [`SPRi`]? Sensitivity to Pressure on Scatter
- [`SSRi`]? Sensitivity to Speed on Scatter
- [`SPHi`]? Sensitivity to Pressure on Hue
- [`SSHi`]? Sensitivity to Speed on Hue
- [`UNMs`]? User-facing Name
- [`SSAi`]? Sensitivity to Speed on Angle
- [`SHZi`]? Sensitivity to Horizontal on Size
- [`SVZi`]? Sensitivity to Vertical on Size
- [`SPAi`]? Sensitivity to Pressure on Angle
- [`SHAi`]? Sensitivity to Horizontal on Angle
- [`SVAi`]? Sensitivity to Vertical on Angle
- [`SHOi`]? Sensitivity to Horizontal on Opacity
- [`SVOi`]? Sensitivity to Vertical on Opacity
- [`SHRi`]? Sensitivity to Horizontal on Scatter
- [`SVRi`]? Sensitivity to Vertical on Scatter
- [`SHHi`]? Sensitivity to Horizontal on Hue
- [`SVHi`]? Sensitivity to Vertical on Hue
- [`SPLi`]? Sensitivity to Pressure on Lightness
- [`SSLi`]? Sensitivity to Speed on Lightness
- [`SHLi`]? Sensitivity to Horizontal on Lightness
- [`SVLi`]? Sensitivity to Vertical on Lightness
- [`SRLi`]? Sensitivity to Random on Lightness
- [`SPSi`]? Sensitivity to Pressure on Saturation
- [`SSSi`]? Sensitivity to Speed on Saturation
- [`SHSi`]? Sensitivity to Horizontal on Saturation
- [`SVSi`]? Sensitivity to Vertical on Saturation
- [`SHBi`]? Sensitivity to Horizontal on Blackness
- [`SVBi`]? Sensitivity to Vertical on Blackness

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

Values:

- `0`: unknown - TODO

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

## `BZCi` **B**e**z**ier Sub-Points **C**ount

[`BZCi`]: #bzci-bezier-sub-points-count

Parent: [`BZLv`]

Number of [`BAZv`] nodes (may also be `1` if there are no nodes).

## `BZLv` **B**e**z**ier Sub-Points **L**ist

[`BZLv`]: #bzlv-bezier-sub-points-list

Parent: [`PBTv`]

Contains:

- [`BZCi`] Bezier Sub-Points Count
- [`BAZv`]+ Bezier Sub-Point

## `CATs` **Cat**egory

[`CATs`]: #cats-category

Parent: [`BPLv`] / [`EFLv`] / [`FGLv`] / [`FPLv`]

Values:

- ` Eye Candy 4000 LE`
- `Adjust Color`
- `Alien Skin Splat LE`
- `Artistic`
- `Blur`
- `Brush Strokes`
- `Clouds`
- `Distort`
- `Noise`
- `Other`
- `Shadow and Glow`
- `Sharpen`
- `Sketch`
- `SpecialFill`
- `Stylize`
- `Texture`
- `UNUSED`
- `Untitled`
- `bc_Air Brush`
- `bc_Basic`
- `bc_Calligraphy`
- `bc_Charcoal`
- `bc_Crayon`
- `bc_Dashed`
- `bc_Felt Tip`
- `bc_Oil`
- `bc_Pencil`
- `bc_Random`
- `bc_Unnatural`
- `bc_Watercolor`
- `cc_GradientColors`
- `ec_DropShadow`
- `ec_EmbossBevel`
- `ec_Glow`
- `ec_InnerBevel`
- `ec_OuterBevel`
- `fc_Bars`
- `fc_Circular`
- `fc_Conical`
- `fc_ContourGrad`
- `fc_Elliptical`
- `fc_Folds`
- `fc_Linear`
- `fc_Pattern`
- `fc_Pinch`
- `fc_Rectangular`
- `fc_Ripple`
- `fc_Satin`
- `fc_Solid`
- `fc_Waves`
- `fc_WebDither`

## `CBAi` **C**ell **B**ackground (Slice) **A**ttachment

[`CBAi`]: #cbai-cell-background-slice-attachment

Parent: [`EXPv`] / [`URLv`]

Values:

- `0`: fixed
- `1`: scroll

## `CBHi` **C**ell **B**ackground (Slice) **H**orizontal Position

[`CBHi`]: #cbhi-cell-background-slice-horizontal-position

Parent: [`URLv`]

Values:

- `0`: left
- `1`: center
- `2`: right
- `3`: value ([`CHVi`])

## `CBRi` **C**ell **B**ackground (Slice) **R**epeat

[`CBRi`]: #cbri-cell-background-slice-repeat

Parent: [`EXPv`] / [`URLv`]

Values:

- `0`: no-repeat
- `1`: repeat-both
- `2`: repeat-x
- `3`: repeat-y

## `CBTb`

[`CBTb`]: #cbtb

Parent: [`URLv`]

Appears to be `true` if [`TSLi`] is `2` (i.e. slice is "background").

## `CBUs` **C**ell **B**ackground **U**RL

[`CBUs`]: #cbus-cell-background-url

Parent: [`EXPv`]

URL (starting `file://`) of a background image to use when exporting as HTML, or a blank string.

## `CBVi` **C**ell **B**ackground (Slice) **V**ertical Position

[`CBVi`]: #cbvi-cell-background-slice-vertical-position

Parent: [`URLv`]

Values:

- `0`: top
- `1`: center
- `2`: bottom
- `3`: value ([`CVVi`])

## `CDAi` HTML Page **A**lignment

[`CDAi`]: #cdai-html-page-alignment

Parent: [`EXPv`]

Values:

- `0`: left
- `1`: center
- `2`: right

## `CDMv`

[`CDMv`]: #cdmv

Parent: [`EXPv`]

Contains:

- [`LFTf`] Left
- [`TOPf`] Top
- [`RITf`] Right
- [`BOTf`] Bottom

## `CDTs`

[`CDTs`]: #cdts

Parent: [`BEHv`]

A timestamp in `yyyyMMddHHmmss` format.

## `CELv` Animation **Cel**l

[`CELv`]: #celv-animation-cell

Parent: [`CLLv`]

Contains:

- [`LCKb`] Lock
- [`ELMv`] Elements
- [`VISb`]? Visible

## `CFTs` **F**ont **T**ypeface

[`CFTs`]: #cfts-font-typeface

Parent: [`TXTv`] / [`ZSTv`]

Values:

- `Arial-Black`
- `ArialMT`
- `Chalkboard-Bold`
- `ChaparralPro-Bold`
- `Cochin`
- `Geneva`
- `Helvetica`
- `HelveticaNeue`
- `MinionPro-Regular`
- `OCRAStd`
- `RosewoodStd-Regular`
- `TektonPro-BoldCond`

## `CHOf` **Ch**aracter **O**ffset

[`CHOf`]: #chof-character-offset

Parent: [`TAPv`]

Offset (in pixels) along path to begin text.

## `CHVi` **C**ell **H**orizontal **V**alue

[`CHVi`]: #chvi-cell-horizontal-value

Parent: [`URLv`]

Used if [`CBHi`] is `3`. Otherwise this is always set to `0xffffffff`

## `CLLb` **C**o**l**our **L**ocked

[`CLLb`]: #cllb-colour-locked

Parent: [`PALv`]

## `CLLv` Animation **C**e**l**l **L**ist

[`CLLv`]: #cllv-animation-cell-list

Parent: [`LAYv`] / [`LSLv`]

Contains:

- [`CELv`]+ Animation Cell

## `CLMb` **C**o**l**our **M**apped

[`CLMb`]: #clmb-colour-mapped

Parent: [`PALv`]

Values:

- `false`: colour is defined by [`FCLi`]
- `true`: colour is mapped to value of [`BCLi`]

## `CLPi` Export Scale **P**ropotion

[`CLPi`]: #clpi-export-scale-propotion

Parent: [`EXPv`]

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

Values:

- `false`: [`XSZi`] and [`YSZi`] are specified by the user directly. Export aspect ratio is not preserved.
- `true`: [`XSZi`] and [`YSZi`] are calculated from [`CLPi`] and the image size. Export aspect ratio is preserved.

## `CLTb` **C**o**l**our **T**ransparent

[`CLTb`]: #cltb-colour-transparent

Parent: [`PALv`]

## `CNSb` Export **S**cale

[`CNSb`]: #cnsb-export-scale

Parent: [`EXPv`]

Note: this value is never `false`; `false` is implied by its absence.

Values:

- `true`: Rescale to [`XSZi`] x [`YSZi`] when exporting. See also [`CLSb`].

## `CPDi` Menu Item **C**ell **P**a**d**ding

[`CPDi`]: #cpdi-menu-item-cell-padding

Parent: [`BEHv`]

## `CPSv` **C**ontrol **P**oint**s**

[`CPSv`]: #cpsv-control-points

Parent: [`ISSv`]

Contains:

- [`CPTv`] (x2 +) Control Point

## `CPTv` **C**ontrol **P**oin**t**

[`CPTv`]: #cptv-control-point

Parent: [`CPSv`]

Contains:

- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`CTYi`] Control Point Type
- [`OBNs`]? Object Name
- [`TTPs`]? Tooltip
- [`TTDb`] Tooltip Tracks Drag
- [`VISb`] Visible

## `CRVb` Is **C**u**rv**e

[`CRVb`]: #crvb-is-curve

Parent: [`PBTv`]

Values:

- `false`: line is straight (points are forced to be colinear)
- `true`: line is a curve

## `CSHi` **C**olour **Sh**adow

[`CSHi`]: #cshi-colour-shadow

Parent: [`BEHv`]

An ABGR colour for the popup menu border shadow.

Values:

- `4283782485`: unknown - TODO

## `CSMb` HTML **CS**S **M**enus

[`CSMb`]: #csmb-html-css-menus

Parent: [`EXPv`]

"Use CSS for Popup Menus".

## `CSPi` Menu Item **C**ell **Sp**acing

[`CSPi`]: #cspi-menu-item-cell-spacing

Parent: [`BEHv`]

## `CTYi` **C**ontrol Point **Ty**pe

[`CTYi`]: #ctyi-control-point-type

Parent: [`CPTv`]

Grab handle config controlled by `type` in JavaScript. Appears to control the colour of the handle.

Values:

- `0`: default (yellow)
- `1`: defaultInverted (blue)

## `CVVi` **C**ell **V**ertical **V**alue

[`CVVi`]: #cvvi-cell-vertical-value

Parent: [`URLv`]

Used if [`CBVi`] is `3`. Otherwise this is always set to `0xffffffff`

## `CXBb`

[`CXBb`]: #cxbb

Parent: [`EXPv`]

Observed in all Fireworks CS4 files, not seen in Fireworks 8 files. Always seems to be `false`.

Values:

- `false`: unknown

## `DCEv` **D**i**c**tionary **E**ntry

[`DCEv`]: #dcev-dictionary-entry

A key-value pair with multiple possible value types. Contains a [`DCKs`] and exactly one other child node with type [`DCVs`], [`GPLv`], or [`GDTv`].

The observed entities broken down by key are:

### `DCEv` "`AngleSoftness`"

[`DCEv` "`AngleSoftness`"]: #dcev-anglesoftness

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Observed value range: `0`..`50`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`BevelContrast`"

[`DCEv` "`BevelContrast`"]: #dcev-bevelcontrast

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inner Glow", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

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

Observed value range: `0`..`35`

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
- `18`: soft light
- `19`: negation
- `21`: hue
- `22`: saturation
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
- `46`: invert
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
- `{d810e821-f86b-11d0-466c747241636345}`: Accented Edges (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472416e6753}`: Angled Strokes (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724273526c}`: Bas Relief (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747243686c43}`: Chalk && Charcoal (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724368726d}`: Chrome (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472436c7250}`: Colored Pencil (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472436e7443}`: Conté Crayon (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724372716c}`: Craquelure (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747243727368}`: Crosshatch (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747244667347}`: Diffuse Glow (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747244726b53}`: Dark Strokes (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747244727942}`: Dry Brush (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472466c6d47}`: Film Grain (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472476c7320}`: Glass (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472476c7745}`: Glowing Edges (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747247726e20}`: Grain (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472496e6b4f}`: Ink Outlines (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724e476c77}`: Neon Glow (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724e745072}`: Note Paper (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74724f636e52}`: Ocean Ripple (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747250687463}`: Photocopy (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506c7357}`: Plastic Wrap (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506c7374}`: Plaster (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506c744b}`: Palette Knife (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472506e7444}`: Paint Daubs (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747250746368}`: Patchwork (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747252676850}`: Rough Pastels (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74725274636c}`: Reticulation (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472536d6453}`: Smudge Stick (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472536d6965}`: Sumi-e (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253706e67}`: Sponge (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253707253}`: Sprayed Strokes (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253707420}`: Spatter (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747253746d70}`: Stamp (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747254726e45}`: Torn Edges (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c74725478747a}`: Texturizer (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c7472556e6472}`: Underpainting (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747257747250}`: Water Paper (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-466c747257747263}`: Watercolor (obsolete / plugin? - seen in Fireworks MX file)
- `{d810e821-f86b-11d0-656341346564694e}`: Bevel Boss (Eye Candy 4000 LE plugin?)
- `{d810e821-f86b-11d0-6563413465646d41}`: Marble (Eye Candy 4000 LE plugin?)
- `{d810e821-f86b-11d0-6563413465646d54}`: Motion Trail (Eye Candy 4000 LE plugin?)
- `{d810e821-f86b-11d0-7371473173676544}`: Edges (Alien Skin Splat LE plugin?)
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

### `DCEv` "`GlowStartDistance`"

[`DCEv` "`GlowStartDistance`"]: #dcev-glowstartdistance

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inner Glow", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Observed value range: `0`..`35`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`GlowWidth`"

[`DCEv` "`GlowWidth`"]: #dcev-glowwidth

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inner Glow", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Observed value range: `0`..`35`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`HiliteColor`"

[`DCEv` "`HiliteColor`"]: #dcev-hilitecolor

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

A colour in "#rrggbb" format

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`HitBlendColor`"

[`DCEv` "`HitBlendColor`"]: #dcev-hitblendcolor

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

A colour in "#rrggbbaa" format to apply when button is in the "hit" (hover) state

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`LightAngle`"

[`DCEv` "`LightAngle`"]: #dcev-lightangle

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Value range: `0`..`360` (degrees)

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`LightDistance`"

[`DCEv` "`LightDistance`"]: #dcev-lightdistance

Parent: [`EPSv`]

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Observed value range: `39`..`200`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`MB_filter_preview_tile_size`"

[`DCEv` "`MB_filter_preview_tile_size`"]: #dcev-mb-filter-preview-tile-size

Parent: [`EPSv`]

Values:

- `-1 -1`: unknown - TODO - observed in all files

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

A colour in "#rrggbb" format

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

Observed value range: `0`..`60`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`ShadowColor`"

[`DCEv` "`ShadowColor`"]: #dcev-shadowcolor

Parent: [`EPSv`]

Used by "Drop Shadow", "Glow", "Inner Shadow" filters.

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

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

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

Used by "Glow", "Inner Bevel", "Inset Emboss", "Outer Bevel", "Raised Emboss" filters.

Values:

- `0`: flat
- `1`: smooth
- `2`: smooth inverted
- `3`: zigzag
- `4`: zigzag 2
- `5`: ring
- `6`: ruffle

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

Used by "Brightness/Contrast" filter.

Value range: `-100`..`100` (percent)

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

Values:

- `Adjust Color`
- `Blur`
- `Noise`
- `Other`
- `Shadow and Glow`
- `Sharpen`

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

Used by "Brightness/Contrast" filter.

Observed value range: `-100`..`100`

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

- `1`: replace pixel hue
- `false`: adjust existing pixel hue
- `true`: replace pixel hue

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

### `DCEv` "`lightness_amount`"

[`DCEv` "`lightness_amount`"]: #dcev-lightness-amount

Parent: [`EPSv`]

Used by "Hue/Saturation" filter.

Value range: `-100`..`100` (percent)

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

Values:

- `Accented Edges...`
- `Add Noise...`
- `Angled Strokes...`
- `Auto Levels`
- `Bas Relief...`
- `Bevel Boss...`
- `Blur`
- `Blur More`
- `Brightness/Contrast...`
- `Chalk && Charcoal...`
- `Chrome...`
- `Clouds`
- `Color Fill`
- `Colored Pencil...`
- `Conté Crayon...`
- `Convert to Alpha`
- `Craquelure...`
- `Crosshatch...`
- `Curves...`
- `Dark Strokes...`
- `Difference Clouds`
- `Diffuse Glow...`
- `Drop Shadow`
- `Dry Brush...`
- `Edges...`
- `Film Grain...`
- `Find Edges`
- `Gaussian Blur...`
- `Glass...`
- `Glow`
- `Glowing Edges...`
- `Grain...`
- `Hue/Saturation...`
- `Ink Outlines...`
- `Inner Bevel`
- `Inner Glow`
- `Inner Shadow`
- `Inset Emboss`
- `Invert`
- `Levels...`
- `Marble...`
- `Motion Blur...`
- `Motion Trail...`
- `Neon Glow...`
- `Note Paper...`
- `Ocean Ripple...`
- `Outer Bevel`
- `Paint Daubs...`
- `Palette Knife...`
- `Patchwork...`
- `Photocopy...`
- `Photoshop Live Effects`
- `Plaster...`
- `Plastic Wrap...`
- `Radial Blur...`
- `Raised Emboss`
- `Reticulation...`
- `Rough Pastels...`
- `Sharpen`
- `Sharpen More`
- `Smudge Stick...`
- `Solid Shadow...`
- `Spatter...`
- `Sponge...`
- `Sprayed Strokes...`
- `Stamp...`
- `Sumi-e...`
- `Texturizer...`
- `Torn Edges...`
- `Underpainting...`
- `Unsharp Mask...`
- `Water Paper...`
- `Watercolor...`
- `Zoom Blur...`

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

### `DCEv` "`name`"

[`DCEv` "`name`"]: #dcev-name

Parent: [`EPSv`]

Values:

- `Add Noise...`
- `Auto Levels`
- `Blur`
- `Blur More`
- `Brightness/Contrast...`
- `Convert to Alpha`
- `Curves...`
- `Find Edges`
- `Gaussian Blur...`
- `Hue/Saturation...`
- `Invert`
- `Levels...`
- `Motion Blur...`
- `Radial Blur...`
- `Sharpen`
- `Sharpen More`
- `Solid Shadow...`
- `Unsharp Mask...`
- `Zoom Blur...`

Contains:

- [`DCKs`] Dictionary Entry Key
- [`DCVs`] Dictionary Entry String Value

### `DCEv` "`nodes`"

[`DCEv` "`nodes`"]: #dcev-nodes

Parent: [`DTAv`]

Internal data used by Star, Polygon autoshapes.

Observed value range: `5`..`25`

Also observed non-numeric values:

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

Internal data used by Polygon autoshape.

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

Parent: [`DCEv` "`AngleSoftness`"] / [`DCEv` "`BevelContrast`"] / [`DCEv` "`BevelType`"] / [`DCEv` "`BevelWidth`"] / [`DCEv` "`Blendmode`"] / [`DCEv` "`ButtonState`"] / [`DCEv` "`Color`"] / [`DCEv` "`Dict`"] / [`DCEv` "`DownBlendColor`"] / [`DCEv` "`EdgeThreshold`"] / [`DCEv` "`EffectIsVisible`"] / [`DCEv` "`EffectMoaID`"] / [`DCEv` "`EmbossFaceColor`"] / [`DCEv` "`GlowStartDistance`"] / [`DCEv` "`GlowWidth`"] / [`DCEv` "`HiliteColor`"] / [`DCEv` "`HitBlendColor`"] / [`DCEv` "`LightAngle`"] / [`DCEv` "`LightDistance`"] / [`DCEv` "`MB_filter_preview_tile_size`"] / [`DCEv` "`MaskSoftness`"] / [`DCEv` "`Opacity`"] / [`DCEv` "`OuterBevelColor`"] / [`DCEv` "`ShadowAngle`"] / [`DCEv` "`ShadowBlur`"] / [`DCEv` "`ShadowColor`"] / [`DCEv` "`ShadowDistance`"] / [`DCEv` "`ShadowType`"] / [`DCEv` "`ShowObject`"] / [`DCEv` "`SlopeMultiplier`"] / [`DCEv` "`SlopeType`"] / [`DCEv` "`add_noise_amount`"] / [`DCEv` "`add_noise_use_color`"] / [`DCEv` "`alrtmsg`"] / [`DCEv` "`alrtmsg`"."`maxmsg`"] / [`DCEv` "`alrtmsg`"."`minmsg`"] / [`DCEv` "`angle`"] / [`DCEv` "`arrowLength`"] / [`DCEv` "`arrowTip`"] / [`DCEv` "`arrowWidth`"] / [`DCEv` "`atMin`"] / [`DCEv` "`awMin`"] / [`DCEv` "`bevelEmboss`"] / [`DCEv` "`blue_points`"] / [`DCEv` "`brightness_amount`"] / [`DCEv` "`c2y`"] / [`DCEv` "`category`"] / [`DCEv` "`clockwise`"] / [`DCEv` "`cloud_color`"] / [`DCEv` "`color`"] / [`DCEv` "`constants`"] / [`DCEv` "`constants`"."`maxB`"] / [`DCEv` "`constants`"."`maxNodes`"] / [`DCEv` "`constants`"."`minB`"] / [`DCEv` "`constants`"."`minNodes`"] / [`DCEv` "`constants`"."`ppc`"] / [`DCEv` "`contrast_amount`"] / [`DCEv` "`corner0`"] / [`DCEv` "`corner1`"] / [`DCEv` "`corner2`"] / [`DCEv` "`corner3`"] / [`DCEv` "`custData`"] / [`DCEv` "`custData`"."`box`"] / [`DCEv` "`custData`"."`head1`"] / [`DCEv` "`custData`"."`head2`"] / [`DCEv` "`custData`"."`none`"] / [`DCEv` "`custData`"."`tail`"] / [`DCEv` "`dest_high_blue`"] / [`DCEv` "`dest_high_green`"] / [`DCEv` "`dest_high_red`"] / [`DCEv` "`dest_high_rgb`"] / [`DCEv` "`dest_low_blue`"] / [`DCEv` "`dest_low_green`"] / [`DCEv` "`dest_low_red`"] / [`DCEv` "`dest_low_rgb`"] / [`DCEv` "`distance`"] / [`DCEv` "`dropShadow`"] / [`DCEv` "`gamma_blue`"] / [`DCEv` "`gamma_green`"] / [`DCEv` "`gamma_red`"] / [`DCEv` "`gamma_rgb`"] / [`DCEv` "`gaussian_blur_radius`"] / [`DCEv` "`gradientFill`"] / [`DCEv` "`green_points`"] / [`DCEv` "`height`"] / [`DCEv` "`hls_colorize`"] / [`DCEv` "`hue_amount`"] / [`DCEv` "`innerGlow`"] / [`DCEv` "`innerShadow`"] / [`DCEv` "`lightness_amount`"] / [`DCEv` "`locked`"] / [`DCEv` "`maxNodes`"] / [`DCEv` "`minNodes`"] / [`DCEv` "`mkbFile_WriteOnly_TemporaryEffectUiName`"] / [`DCEv` "`mode`"] / [`DCEv` "`motion_blur_angle`"] / [`DCEv` "`motion_blur_distance`"] / [`DCEv` "`name`"] / [`DCEv` "`nodes`"] / [`DCEv` "`offset1`"] / [`DCEv` "`offset2`"] / [`DCEv` "`outerGlow`"] / [`DCEv` "`patternFill`"] / [`DCEv` "`radial_blur_amount`"] / [`DCEv` "`radial_blur_quality`"] / [`DCEv` "`radius`"] / [`DCEv` "`radius0`"] / [`DCEv` "`radius1`"] / [`DCEv` "`red_points`"] / [`DCEv` "`rgb_points`"] / [`DCEv` "`rotation`"] / [`DCEv` "`round0`"] / [`DCEv` "`round1`"] / [`DCEv` "`roundness`"] / [`DCEv` "`satin`"] / [`DCEv` "`saturation_amount`"] / [`DCEv` "`shapeName`"] / [`DCEv` "`sides`"] / [`DCEv` "`sky_color`"] / [`DCEv` "`solidFill`"] / [`DCEv` "`source_high_blue`"] / [`DCEv` "`source_high_green`"] / [`DCEv` "`source_high_red`"] / [`DCEv` "`source_high_rgb`"] / [`DCEv` "`source_low_blue`"] / [`DCEv` "`source_low_green`"] / [`DCEv` "`source_low_red`"] / [`DCEv` "`source_low_rgb`"] / [`DCEv` "`split`"] / [`DCEv` "`stroke`"] / [`DCEv` "`t1`"] / [`DCEv` "`t2`"] / [`DCEv` "`thickness`"] / [`DCEv` "`toolTips`"] / [`DCEv` "`toolTips`"."`angle`"] / [`DCEv` "`toolTips`"."`drag`"] / [`DCEv` "`toolTips`"."`head`"] / [`DCEv` "`toolTips`"."`inch`"] / [`DCEv` "`toolTips`"."`length`"] / [`DCEv` "`toolTips`"."`of`"] / [`DCEv` "`toolTips`"."`px`"] / [`DCEv` "`toolTips`"."`resize`"] / [`DCEv` "`tooltips`"] / [`DCEv` "`tooltips`"."`altopt`"] / [`DCEv` "`tooltips`"."`inner`"] / [`DCEv` "`tooltips`"."`openclose`"] / [`DCEv` "`tooltips`"."`points`"] / [`DCEv` "`tooltips`"."`radius`"] / [`DCEv` "`tooltips`"."`radius0`"] / [`DCEv` "`tooltips`"."`radius1`"] / [`DCEv` "`tooltips`"."`reset`"] / [`DCEv` "`tooltips`"."`roundness1`"] / [`DCEv` "`tooltips`"."`roundness2`"] / [`DCEv` "`tooltips`"."`scale`"] / [`DCEv` "`tooltips`"."`sections`"] / [`DCEv` "`tooltips`"."`sides`"] / [`DCEv` "`tooltips`"."`spirals`"] / [`DCEv` "`unsharp_mask_amount`"] / [`DCEv` "`unsharp_mask_radius`"] / [`DCEv` "`unsharp_mask_threshold`"] / [`DCEv` "`usecolor`"] / [`DCEv` "`width`"] / [`DCEv` "`x1`"] / [`DCEv` "`x2`"] / [`DCEv` "`y1`"] / [`DCEv` "`y2`"] / [`DCEv` "`zoom_blur_amount`"] / [`DCEv` "`zoom_blur_quality`"]

The key name for a key-value pair.

## `DCVs` **D**i**c**tionary Entry String **V**alue

[`DCVs`]: #dcvs-dictionary-entry-string-value

Parent: [`DCEv` "`AngleSoftness`"] / [`DCEv` "`BevelContrast`"] / [`DCEv` "`BevelType`"] / [`DCEv` "`BevelWidth`"] / [`DCEv` "`Blendmode`"] / [`DCEv` "`ButtonState`"] / [`DCEv` "`Color`"] / [`DCEv` "`Dict`"] / [`DCEv` "`DownBlendColor`"] / [`DCEv` "`EdgeThreshold`"] / [`DCEv` "`EffectIsVisible`"] / [`DCEv` "`EffectMoaID`"] / [`DCEv` "`EmbossFaceColor`"] / [`DCEv` "`GlowStartDistance`"] / [`DCEv` "`GlowWidth`"] / [`DCEv` "`HiliteColor`"] / [`DCEv` "`HitBlendColor`"] / [`DCEv` "`LightAngle`"] / [`DCEv` "`LightDistance`"] / [`DCEv` "`MB_filter_preview_tile_size`"] / [`DCEv` "`MaskSoftness`"] / [`DCEv` "`Opacity`"] / [`DCEv` "`OuterBevelColor`"] / [`DCEv` "`ShadowAngle`"] / [`DCEv` "`ShadowBlur`"] / [`DCEv` "`ShadowColor`"] / [`DCEv` "`ShadowDistance`"] / [`DCEv` "`ShadowType`"] / [`DCEv` "`ShowObject`"] / [`DCEv` "`SlopeMultiplier`"] / [`DCEv` "`SlopeType`"] / [`DCEv` "`add_noise_amount`"] / [`DCEv` "`add_noise_use_color`"] / [`DCEv` "`alrtmsg`"."`maxmsg`"] / [`DCEv` "`alrtmsg`"."`minmsg`"] / [`DCEv` "`angle`"] / [`DCEv` "`arrowLength`"] / [`DCEv` "`arrowTip`"] / [`DCEv` "`arrowWidth`"] / [`DCEv` "`atMin`"] / [`DCEv` "`awMin`"] / [`DCEv` "`bevelEmboss`"] / [`DCEv` "`brightness_amount`"] / [`DCEv` "`c2y`"] / [`DCEv` "`category`"] / [`DCEv` "`clockwise`"] / [`DCEv` "`cloud_color`"] / [`DCEv` "`color`"] / [`DCEv` "`constants`"."`maxB`"] / [`DCEv` "`constants`"."`maxNodes`"] / [`DCEv` "`constants`"."`minB`"] / [`DCEv` "`constants`"."`minNodes`"] / [`DCEv` "`constants`"."`ppc`"] / [`DCEv` "`contrast_amount`"] / [`DCEv` "`corner0`"] / [`DCEv` "`corner1`"] / [`DCEv` "`corner2`"] / [`DCEv` "`corner3`"] / [`DCEv` "`custData`"."`box`"] / [`DCEv` "`custData`"."`head1`"] / [`DCEv` "`custData`"."`head2`"] / [`DCEv` "`custData`"."`none`"] / [`DCEv` "`custData`"."`tail`"] / [`DCEv` "`dest_high_blue`"] / [`DCEv` "`dest_high_green`"] / [`DCEv` "`dest_high_red`"] / [`DCEv` "`dest_high_rgb`"] / [`DCEv` "`dest_low_blue`"] / [`DCEv` "`dest_low_green`"] / [`DCEv` "`dest_low_red`"] / [`DCEv` "`dest_low_rgb`"] / [`DCEv` "`distance`"] / [`DCEv` "`dropShadow`"] / [`DCEv` "`gamma_blue`"] / [`DCEv` "`gamma_green`"] / [`DCEv` "`gamma_red`"] / [`DCEv` "`gamma_rgb`"] / [`DCEv` "`gaussian_blur_radius`"] / [`DCEv` "`gradientFill`"] / [`DCEv` "`height`"] / [`DCEv` "`hls_colorize`"] / [`DCEv` "`hue_amount`"] / [`DCEv` "`innerGlow`"] / [`DCEv` "`innerShadow`"] / [`DCEv` "`lightness_amount`"] / [`DCEv` "`locked`"] / [`DCEv` "`maxNodes`"] / [`DCEv` "`minNodes`"] / [`DCEv` "`mkbFile_WriteOnly_TemporaryEffectUiName`"] / [`DCEv` "`mode`"] / [`DCEv` "`motion_blur_angle`"] / [`DCEv` "`motion_blur_distance`"] / [`DCEv` "`name`"] / [`DCEv` "`nodes`"] / [`DCEv` "`offset1`"] / [`DCEv` "`offset2`"] / [`DCEv` "`outerGlow`"] / [`DCEv` "`patternFill`"] / [`DCEv` "`radial_blur_amount`"] / [`DCEv` "`radial_blur_quality`"] / [`DCEv` "`radius`"] / [`DCEv` "`radius0`"] / [`DCEv` "`radius1`"] / [`DCEv` "`rotation`"] / [`DCEv` "`round0`"] / [`DCEv` "`round1`"] / [`DCEv` "`roundness`"] / [`DCEv` "`satin`"] / [`DCEv` "`saturation_amount`"] / [`DCEv` "`shapeName`"] / [`DCEv` "`sides`"] / [`DCEv` "`sky_color`"] / [`DCEv` "`solidFill`"] / [`DCEv` "`source_high_blue`"] / [`DCEv` "`source_high_green`"] / [`DCEv` "`source_high_red`"] / [`DCEv` "`source_high_rgb`"] / [`DCEv` "`source_low_blue`"] / [`DCEv` "`source_low_green`"] / [`DCEv` "`source_low_red`"] / [`DCEv` "`source_low_rgb`"] / [`DCEv` "`split`"] / [`DCEv` "`stroke`"] / [`DCEv` "`t1`"] / [`DCEv` "`t2`"] / [`DCEv` "`thickness`"] / [`DCEv` "`toolTips`"."`angle`"] / [`DCEv` "`toolTips`"."`drag`"] / [`DCEv` "`toolTips`"."`head`"] / [`DCEv` "`toolTips`"."`inch`"] / [`DCEv` "`toolTips`"."`length`"] / [`DCEv` "`toolTips`"."`of`"] / [`DCEv` "`toolTips`"."`px`"] / [`DCEv` "`toolTips`"."`resize`"] / [`DCEv` "`tooltips`"."`altopt`"] / [`DCEv` "`tooltips`"."`inner`"] / [`DCEv` "`tooltips`"."`openclose`"] / [`DCEv` "`tooltips`"."`points`"] / [`DCEv` "`tooltips`"."`radius`"] / [`DCEv` "`tooltips`"."`radius0`"] / [`DCEv` "`tooltips`"."`radius1`"] / [`DCEv` "`tooltips`"."`reset`"] / [`DCEv` "`tooltips`"."`roundness1`"] / [`DCEv` "`tooltips`"."`roundness2`"] / [`DCEv` "`tooltips`"."`scale`"] / [`DCEv` "`tooltips`"."`sections`"] / [`DCEv` "`tooltips`"."`sides`"] / [`DCEv` "`tooltips`"."`spirals`"] / [`DCEv` "`unsharp_mask_amount`"] / [`DCEv` "`unsharp_mask_radius`"] / [`DCEv` "`unsharp_mask_threshold`"] / [`DCEv` "`usecolor`"] / [`DCEv` "`width`"] / [`DCEv` "`x1`"] / [`DCEv` "`x2`"] / [`DCEv` "`y1`"] / [`DCEv` "`y2`"] / [`DCEv` "`zoom_blur_amount`"] / [`DCEv` "`zoom_blur_quality`"]

A string value for a key-value pair.

## `DF1i` **D**ash O**f**f **1**

[`DF1i`]: #df1i-dash-off-1

Parent: [`BPLv`]

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DF2i` **D**ash O**f**f **2**

[`DF2i`]: #df2i-dash-off-2

Parent: [`BPLv`]

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DF3i` **D**ash O**f**f **3**

[`DF3i`]: #df3i-dash-off-3

Parent: [`BPLv`]

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

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DO2i` **D**ash **O**n **2**

[`DO2i`]: #do2i-dash-on-2

Parent: [`BPLv`]

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DO3i` **D**ash **O**n **3**

[`DO3i`]: #do3i-dash-on-3

Parent: [`BPLv`]

Observed value range: `0x00000000`..`0x000003e8` (`0`..`1000`)

## `DSUb` HTML **D**rop Un-**S**liced Areas

[`DSUb`]: #dsub-html-drop-un-sliced-areas

Parent: [`EXPv`]

Values:

- `false`: include areas without slice objects
- `true`: omit areas without slice objects

## `DTAv` **D**a**ta**

[`DTAv`]: #dtav-data

Parent: [`ALSv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`URLv`]

Stores arbitrary, possibly nested, data for JavaScript scripts, as set on `smartShape.elem.customData`.

Contains:

- [`DCEv` "`tooltips`"]?
- [`DCEv` "`radius1`"]?
- [`DCEv` "`radius0`"]?
- [`DCEv` "`alrtmsg`"]?
- [`DCEv` "`round0`"]?
- [`DCEv` "`shapeName`"]?
- [`DCEv` "`nodes`"]?
- [`DCEv` "`constants`"]?
- [`DCEv` "`round1`"]?
- [`DCEv` "`radius`"]?
- [`DCEv` "`c2y`"]?
- [`DCEv` "`clockwise`"]?
- [`DCEv` "`rotation`"]?
- [`DCEv` "`split`"]?
- [`DCEv` "`sides`"]?
- [`DCEv` "`maxNodes`"]?
- [`DCEv` "`minNodes`"]?
- [`DCEv` "`width`"]?
- [`DCEv` "`height`"]?
- [`DCEv` "`corner2`"]?
- [`DCEv` "`corner3`"]?
- [`DCEv` "`corner0`"]?
- [`DCEv` "`corner1`"]?
- [`DCEv` "`locked`"]?
- [`DCEv` "`y2`"]?
- [`DCEv` "`x2`"]?
- [`DCEv` "`y1`"]?
- [`DCEv` "`x1`"]?
- [`DCEv` "`toolTips`"]?
- [`DCEv` "`thickness`"]?
- [`DCEv` "`roundness`"]?
- [`DCEv` "`mode`"]?
- [`DCEv` "`offset1`"]?
- [`DCEv` "`offset2`"]?
- [`DCEv` "`t2`"]?
- [`DCEv` "`t1`"]?
- [`DCEv` "`custData`"]?
- [`DCEv` "`arrowTip`"]?
- [`DCEv` "`atMin`"]?
- [`DCEv` "`arrowWidth`"]?
- [`DCEv` "`arrowLength`"]?
- [`DCEv` "`awMin`"]?

## `DURi` **Dur**ation

[`DURi`]: #duri-duration

Parent: [`PPTv`]

Observed value range: `0x00000000`..`0x00000000` (`0`..`0`)

## `DVLb`

[`DVLb`]: #dvlb

Parent: [`MSTv`]

Values:

- `false`: unknown - TODO

## `ECSi` HTML **E**xternal **CS**S

[`ECSi`]: #ecsi-html-external-css

Parent: [`EXPv`]

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

- [`EFLv`]+ Effect List

## `EFLv` **Ef**fect **L**ist

[`EFLv`]: #eflv-effect-list

Parent: [`EFDv`] / [`GRPv`] / [`IMGv`] / [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

Contains:

- [`CATs`] Category
- [`INMs`] Internal Name
- [`EPSv`]\* Effect Properties

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
- `*.tif;*.tiff`
- `.htm`
- `.mxml`

## `ELMv` **El**e**m**ents

[`ELMv`]: #elmv-elements

Parent: [`CELv`] / [`GRPv`]

Contains:

- [`PTHv`]\* Path
- [`TXTv`]\* Text
- [`GRPv`]\* Group
- [`LSLv`]? Layer Sub-Layer
- [`URLv`]\* Image Slice / Hotspot
- [`IMGv`]\* Image
- [`ALSv`]\* Symbol Instance

## `ENCi` HTML **Enc**oding

[`ENCi`]: #enci-html-encoding

Parent: [`EXPv`]

Values:

- `0`: ASCII
- `1`: UTF-8

## `EOFb` **E**ven-**O**dd **F**ill Rule

[`EOFb`]: #eofb-even-odd-fill-rule

Parent: [`PTHv`]

Values:

- `false`: nonzero fill rule
- `true`: even-odd fill rule

## `EPSv` **E**ffect **P**ropertie**s**

[`EPSv`]: #epsv-effect-properties

Parent: [`EFLv`]

Defines an effect (such as a drop-shadow). See [`DCEv` "`EffectMoaID`"] for the type of effect applied.

Contains:

- [`DCEv` "`mkbFile_WriteOnly_TemporaryEffectUiName`"]
- [`DCEv` "`EffectIsVisible`"]?
- [`DCEv` "`EffectMoaID`"]
- [`DCEv` "`BevelType`"]?
- [`DCEv` "`BevelWidth`"]?
- [`DCEv` "`BevelContrast`"]?
- [`DCEv` "`EdgeThreshold`"]?
- [`DCEv` "`AngleSoftness`"]?
- [`DCEv` "`MaskSoftness`"]?
- [`DCEv` "`LightDistance`"]?
- [`DCEv` "`LightAngle`"]?
- [`DCEv` "`SlopeType`"]?
- [`DCEv` "`SlopeMultiplier`"]?
- [`DCEv` "`OuterBevelColor`"]?
- [`DCEv` "`DownBlendColor`"]?
- [`DCEv` "`HitBlendColor`"]?
- [`DCEv` "`HiliteColor`"]?
- [`DCEv` "`ShadowColor`"]?
- [`DCEv` "`EmbossFaceColor`"]?
- [`DCEv` "`ShowObject`"]?
- [`DCEv` "`ButtonState`"]?
- [`DCEv` "`GlowStartDistance`"]?
- [`DCEv` "`GlowWidth`"]?
- [`DCEv` "`ShadowType`"]?
- [`DCEv` "`ShadowBlur`"]?
- [`DCEv` "`ShadowDistance`"]?
- [`DCEv` "`ShadowAngle`"]?
- [`DCEv` "`MB_filter_preview_tile_size`"]?
- [`DCEv` "`angle`"]?
- [`DCEv` "`distance`"]?
- [`DCEv` "`color`"]?
- [`DCEv` "`brightness_amount`"]?
- [`DCEv` "`contrast_amount`"]?
- [`DCEv` "`source_low_rgb`"]?
- [`DCEv` "`source_high_rgb`"]?
- [`DCEv` "`dest_low_rgb`"]?
- [`DCEv` "`dest_high_rgb`"]?
- [`DCEv` "`gamma_rgb`"]?
- [`DCEv` "`source_low_red`"]?
- [`DCEv` "`source_high_red`"]?
- [`DCEv` "`dest_low_red`"]?
- [`DCEv` "`dest_high_red`"]?
- [`DCEv` "`gamma_red`"]?
- [`DCEv` "`source_low_green`"]?
- [`DCEv` "`source_high_green`"]?
- [`DCEv` "`dest_low_green`"]?
- [`DCEv` "`dest_high_green`"]?
- [`DCEv` "`gamma_green`"]?
- [`DCEv` "`source_low_blue`"]?
- [`DCEv` "`source_high_blue`"]?
- [`DCEv` "`dest_low_blue`"]?
- [`DCEv` "`dest_high_blue`"]?
- [`DCEv` "`gamma_blue`"]?
- [`DCEv` "`hue_amount`"]?
- [`DCEv` "`saturation_amount`"]?
- [`DCEv` "`lightness_amount`"]?
- [`DCEv` "`hls_colorize`"]?
- [`DCEv` "`rgb_points`"]?
- [`DCEv` "`red_points`"]?
- [`DCEv` "`green_points`"]?
- [`DCEv` "`blue_points`"]?
- [`DCEv` "`Color`"]?
- [`DCEv` "`Opacity`"]?
- [`DCEv` "`Blendmode`"]?
- [`DCEv` "`radial_blur_amount`"]?
- [`DCEv` "`radial_blur_quality`"]?
- [`DCEv` "`gaussian_blur_radius`"]?
- [`DCEv` "`motion_blur_angle`"]?
- [`DCEv` "`motion_blur_distance`"]?
- [`DCEv` "`zoom_blur_amount`"]?
- [`DCEv` "`zoom_blur_quality`"]?
- [`DCEv` "`unsharp_mask_radius`"]?
- [`DCEv` "`unsharp_mask_amount`"]?
- [`DCEv` "`unsharp_mask_threshold`"]?
- [`DCEv` "`add_noise_amount`"]?
- [`DCEv` "`add_noise_use_color`"]?
- [`DCEv` "`cloud_color`"]?
- [`DCEv` "`sky_color`"]?
- [`DCEv` "`Dict`"]?
- [`DCEv` "`name`"]?
- [`DCEv` "`category`"]?
- [`DCEv` "`usecolor`"]?
- [`DCEv` "`satin`"]?
- [`DCEv` "`dropShadow`"]?
- [`DCEv` "`innerShadow`"]?
- [`DCEv` "`outerGlow`"]?
- [`DCEv` "`innerGlow`"]?
- [`DCEv` "`solidFill`"]?
- [`DCEv` "`gradientFill`"]?
- [`DCEv` "`patternFill`"]?
- [`DCEv` "`bevelEmboss`"]?
- [`DCEv` "`stroke`"]?

## `EXPv` **Exp**ort Options

[`EXPv`]: #expv-export-options

Parent: [`MKBv`] / [`PDCv`] / [`URLv`]

Contains:

- [`FMTi`] Format
- [`MCTi`]?
- [`MCCi`]?
- [`CLRi`] Colour Mode
- [`PLTi`] Palette Type
- [`PALv`] Palette
- [`PLNi`] Palette Number of entries
- [`PLRi`] Palette Remaining Colours
- [`PTNi`] Palette Transparency Type
- [`PLOb`] Palette Pruning
- [`APLb`]
- [`APSb`]
- [`AACb`] Export GIF Animation Crop
- [`AADb`] Export GIF Animation Diff
- [`ASTi`]
- [`PLDi`] Palette Dither Level
- [`GLTi`] GIF Loss
- [`JPQi`] JPEG Quality
- [`JPSi`] JPEG Smoothing
- [`JPOi`] JPEG Colour
- [`JPPb`] JPEG Progressive
- [`GFIb`] Interlaced
- [`JSQi`]
- [`JSEb`]
- [`JSTb`]
- [`JSBb`]
- [`FLPi`] Frame Loop
- [`FNLv`]? Frame Configuration List
- [`GSLb`]?
- [`LSUb`]?
- [`DSUb`]? HTML Drop Un-Sliced Areas
- [`LSDb`]? HTML Multiple Nav Bars
- [`CSMb`]? HTML CSS Menus
- [`ECSi`]? HTML External CSS
- [`NYSb`]?
- [`LSSi`]? HTML Slice Spacing
- [`HTMi`]? Export HTML Layout
- [`HTTs`]? HTML Style
- [`XFSi`]? Export Format Selection
- [`XMDi`]?
- [`TRMb`]? Export Trimmed Images
- [`HTMb`]? Export HTML
- [`XDAb`]?
- [`EFXs`]? Export File Filter.
- [`NM4v`]? HTML Slice Export Names
- [`NMFv`]? HTML Slice Export Names Frame
- [`ENCi`]? HTML Encoding
- [`TALi`]?
- [`TPWi`]?
- [`XTMi`]? XHTML
- [`CBUs`]? Cell Background URL
- [`CBRi`]? Cell Background (Slice) Repeat
- [`CBAi`]? Cell Background (Slice) Attachment
- [`CDAi`]? HTML Page Alignment
- [`CDMv`]?
- [`CXBb`]?
- [`LRLi`]? Export Area Left
- [`LRTi`]? Export Area Top
- [`LRRi`]? Export Area Right
- [`LRBi`]? Export Area Bottom
- [`IMDs`]? Image Directory
- [`LXDs`]? Last Export Directory
- [`EFBs`]? Last Export Filename
- [`EXPv`.`FCLi`]? Matte Colour
- [`CLSb`]? Export Scale Constrained
- [`CNSb`]? Export Scale
- [`CLPi`]? Export Scale Propotion
- [`XSZi`]? Export X Size
- [`YSZi`]? Export Y Size

## `EXPv`.`FCLi` Matte **C**o**l**our

[`EXPv`.`FCLi`]: #expv-fcli-matte-colour

Parent: [`EXPv`]

ABGR format colour.

Value range: `0x00000000`..`0xffffffff`

## `FABi`

[`FABi`]: #fabi

Parent: [`ZSTv`]

A **signed** 32-bit number, relating to Bottom.

Values:

- `4294935296`: unknown - TODO

## `FALi`

[`FALi`]: #fali

Parent: [`ZSTv`]

A **signed** 32-bit number, relating to Left.

Values:

- `32000`: unknown - TODO

## `FARi`

[`FARi`]: #fari

Parent: [`ZSTv`]

A **signed** 32-bit number, relating to Right.

Values:

- `4294935296`: unknown - TODO

## `FATi`

[`FATi`]: #fati

Parent: [`ZSTv`]

A **signed** 32-bit number, relating to Top.

Values:

- `32000`: unknown - TODO

## `FCLi` **F**ill **C**o**l**our

[`FCLi`]: #fcli-fill-colour

Parent: [`PALv`] / [`PATv`] / [`TFSv`] / [`URLv`]

ABGR format colour.

Value range: `0x00000000`..`0xffffffff`

## `FD1i` **F**ill **D**ither Colour **1**

[`FD1i`]: #fd1i-fill-dither-colour-1

Parent: [`FPLv`]

Value range: `0x00000000`..`0xffffffff`

## `FD2i` **F**ill **D**ither Colour **2**

[`FD2i`]: #fd2i-fill-dither-colour-2

Parent: [`FPLv`]

Value range: `0x00000000`..`0xffffffff`

## `FD3i` **F**ill **D**ither Colour **3**

[`FD3i`]: #fd3i-fill-dither-colour-3

Parent: [`FPLv`]

Value range: `0x00000000`..`0xffffffff`

## `FD4i` **F**ill **D**ither Colour **4**

[`FD4i`]: #fd4i-fill-dither-colour-4

Parent: [`FPLv`]

Value range: `0x00000000`..`0xffffffff`

## `FDTb` **F**ill **D**ither **T**ransparent

[`FDTb`]: #fdtb-fill-dither-transparent

Parent: [`FPLv`]

## `FEFi` **Fe**ather **F**ill Amount

[`FEFi`]: #fefi-feather-fill-amount

Parent: [`FPLv`]

Observed value range: `0x00000000`..`0x0000006c` (`0`..`108`)

## `FG0v` **F**ill **G**radient **0** (RGB)

[`FG0v`]: #fg0v-fill-gradient-0-rgb

Parent: [`FGYv`]

Contains:

- [`FNCi`] Fill Gradient Number of Control Points
- [`FGIv`] (x2 +) Fill Gradient Control Point

## `FG1v` **F**ill **G**radient **1** (Alpha)

[`FG1v`]: #fg1v-fill-gradient-1-alpha

Parent: [`FGYv`]

Contains:

- [`FNCi`] Fill Gradient Number of Control Points
- [`FGIv`] (x2 +) Fill Gradient Control Point

## `FGCi` **F**ill **G**radient Control Point **C**olour

[`FGCi`]: #fgci-fill-gradient-control-point-colour

Parent: [`FGIv`]

Value range: `0x00000000`..`0xffffffff`

## `FGIv` **F**ill **G**radient Control Point

[`FGIv`]: #fgiv-fill-gradient-control-point

Parent: [`FG0v`] / [`FG1v`] / [`FGVv`]

Contains:

- [`FGPf`] Fill Gradient Control Point Position
- [`FGCi`] Fill Gradient Control Point Colour

## `FGLv` **F**ill **G**radient

[`FGLv`]: #fglv-fill-gradient

Parent: [`FPLv`] / [`GLDv`]

Contains:

- [`CATs`] Category
- [`INMs`] Internal Name
- [`FGVv`] Fill Gradient Vertices
- [`FGYv`] Fill Gradient RGB + Alpha

## `FGPf` **F**ill **G**radient Control Point **P**osition

[`FGPf`]: #fgpf-fill-gradient-control-point-position

Parent: [`FGIv`]

Observed value range: `0`..`1`

## `FGVv` **F**ill **G**radient **V**ertices

[`FGVv`]: #fgvv-fill-gradient-vertices

Parent: [`FGLv`]

Contains:

- [`FNCi`] Fill Gradient Number of Control Points
- [`FGIv`] (x2 +) Fill Gradient Control Point

## `FGYv` **F**ill **G**radient RGB + Alpha

[`FGYv`]: #fgyv-fill-gradient-rgb-alpha

Parent: [`FGLv`]

Contains:

- [`FG0v`] Fill Gradient 0 (RGB)
- [`FG1v`] Fill Gradient 1 (Alpha)

## `FILs` **L**abel

[`FILs`]: #fils-label

Parent: [`ISSv`] / [`URLv`]

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

- [`FNPi`]
- [`FNDi`] Frame Duration
- [`VISb`] Visible
- [`OBNs`]? Object Name

## `FNPi`

[`FNPi`]: #fnpi

Parent: [`FNMv`]

Values:

- `0`: unknown - TODO

## `FOAb`

[`FOAb`]: #foab

Parent: [`TXTv`]

Values:

- `false`: unknown - TODO

## `FONs` **Fon**t Family

[`FONs`]: #fons-font-family

Parent: [`BEHv`] / [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `Arial`
- `Arial Black`
- `Arial-Black`
- `ArialMT`
- `Arioso`
- `BalloonEFExtraBold`
- `BankGothic Md BT`
- `Batang`
- `BritannicEFBold`
- `Brush Script MT`
- `Cartoon`
- `Century Gothic`
- `Chalkboard`
- `Chalkboard-Bold`
- `Chaparral Pro`
- `ChaparralPro-Bold`
- `Cochin`
- `Comic Sans MS`
- `CommunicationPiEF`
- `Courier New`
- `Geneva`
- `GothicI`
- `GulimChe`
- `Helvetica`
- `Helvetica Neue`
- `HelveticaNeue`
- `HoratioDMed`
- `Impact`
- `Italic`
- `MS Sans Serif`
- `Minion Pro`
- `MinionPro-Regular`
- `Monotype Corsiva`
- `OCR A Std`
- `OCRAStd`
- `Ringbearer`
- `Rosewood Std`
- `RosewoodStd-Regular`
- `SimHei`
- `Tekton Pro`
- `TektonPro-BoldCond`
- `Times New Roman`
- `Verdana, Arial, Helvetica, sans-serif`

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

- [`CATs`] Category
- [`INMs`] Internal Name
- [`UNMs`] User-facing Name
- [`RDOb`]
- [`FTBi`] Fill Texture Blending
- [`FEFi`] Feather Fill Amount
- [`FSMi`] Fill Stamping Mode
- [`FPLv`.`FETi`]
- [`FRDb`] Fill Hard Edge
- [`FRRi`]
- [`FSHi`] Fill Shape
- [`FSXi`]? Fill Shape Extended
- [`FGLv`]? Fill Gradient
- [`FD1i`]? Fill Dither Colour 1
- [`FD2i`]? Fill Dither Colour 2
- [`FD3i`]? Fill Dither Colour 3
- [`FD4i`]? Fill Dither Colour 4
- [`FDTb`]? Fill Dither Transparent
- [`FPTv`]? Fill Pattern Tile

## `FPLv`.`FETi`

[`FPLv`.`FETi`]: #fplv-feti

Parent: [`FPLv`]

Seems related to hard edge / non-anti-aliased fills

Values:

- `0`: unknown - TODO
- `1`: unknown - TODO - observed in all files

## `FPTv` **F**ill **P**attern **T**ile

[`FPTv`]: #fptv-fill-pattern-tile

Parent: [`FPLv`]

Contains:

- [`INMs`] Internal Name
- [`IMGv`] Image

## `FRCi` **Fr**ame **C**ount

[`FRCi`]: #frci-frame-count

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`]

The number of animation frames. It is not clear why this node is duplicated.

## `FRDb` **F**ill Ha**rd** Edge

[`FRDb`]: #frdb-fill-hard-edge

Parent: [`FPLv`]

Values:

- `false`: anti-aliased edge
- `true`: hard (non-anti-aliased) edge

## `FRRi`

[`FRRi`]: #frri

Parent: [`FPLv`]

Values:

- `0`: unknown - TODO - observed in all files

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

## `FTBi` **F**ill **T**exture **B**lending

[`FTBi`]: #ftbi-fill-texture-blending

Parent: [`FPLv`]

Value range: `0`..`1000` (per mille)

## `GCLi` **G**rid **C**o**l**our

[`GCLi`]: #gcli-grid-colour

Parent: [`GRDv`]

ABGR format colour.

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

ABGR format colour.

Value range: `0x00000000`..`0xffffffff`

## `GDLb` **G**ui**d**es **L**ocked

[`GDLb`]: #gdlb-guides-locked

Parent: [`GDSv`]

## `GDSv` **G**ui**d**e**s**

[`GDSv`]: #gdsv-guides

Parent: [`MKBv`] / [`MSTv`] / [`PDCv`]

Contains:

- [`GDLb`]? Guides Locked
- [`GDKi`]? Guides Colour
- [`GDHv`] Guides Horizontal
- [`GDVv`] Guides Vertical

## `GDTv` Nested **D**ic**t**ionary

[`GDTv`]: #gdtv-nested-dictionary

Parent: [`DCEv` "`alrtmsg`"] / [`DCEv` "`constants`"] / [`DCEv` "`custData`"] / [`DCEv` "`toolTips`"] / [`DCEv` "`tooltips`"]

Contains:

- [`DCEv` "`tooltips`"."`radius1`"]?
- [`DCEv` "`tooltips`"."`radius0`"]?
- [`DCEv` "`tooltips`"."`roundness1`"]?
- [`DCEv` "`tooltips`"."`roundness2`"]?
- [`DCEv` "`tooltips`"."`points`"]?
- [`DCEv` "`alrtmsg`"."`maxmsg`"]?
- [`DCEv` "`alrtmsg`"."`minmsg`"]?
- [`DCEv` "`constants`"."`maxNodes`"]?
- [`DCEv` "`constants`"."`minNodes`"]?
- [`DCEv` "`tooltips`"."`openclose`"]?
- [`DCEv` "`tooltips`"."`spirals`"]?
- [`DCEv` "`constants`"."`ppc`"]?
- [`DCEv` "`constants`"."`maxB`"]?
- [`DCEv` "`constants`"."`minB`"]?
- [`DCEv` "`tooltips`"."`reset`"]?
- [`DCEv` "`tooltips`"."`altopt`"]?
- [`DCEv` "`tooltips`"."`inner`"]?
- [`DCEv` "`tooltips`"."`scale`"]?
- [`DCEv` "`tooltips`"."`sides`"]?
- [`DCEv` "`tooltips`"."`sections`"]?
- [`DCEv` "`tooltips`"."`radius`"]?
- [`DCEv` "`toolTips`"."`angle`"]?
- [`DCEv` "`toolTips`"."`inch`"]?
- [`DCEv` "`toolTips`"."`length`"]?
- [`DCEv` "`toolTips`"."`drag`"]?
- [`DCEv` "`toolTips`"."`px`"]?
- [`DCEv` "`toolTips`"."`head`"]?
- [`DCEv` "`toolTips`"."`of`"]?
- [`DCEv` "`toolTips`"."`resize`"]?
- [`DCEv` "`custData`"."`none`"]?
- [`DCEv` "`custData`"."`head1`"]?
- [`DCEv` "`custData`"."`head2`"]?
- [`DCEv` "`custData`"."`tail`"]?
- [`DCEv` "`custData`"."`box`"]?

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

- [`FGLv`] (x13) Fill Gradient

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

- [`GOXf`] Grid Offset X
- [`GOYf`] Grid Offset Y
- [`GSXf`] Grid Size X
- [`GSYf`] Grid Size Y
- [`GCLi`] Grid Colour

## `GRPv` **Gr**ou**p**

[`GRPv`]: #grpv-group

Parent: [`ELMv`]

Contains:

- [`LCKb`]? Lock
- [`GRTi`] Group Type
- [`ELMv`] Elements
- [`OBNs`]? Object Name
- [`DTAv`]? Data
- [`IMGv`]? Image
- [`EFLv`]? Effect List
- [`MNAb`]? Mask Not Appear
- [`MRMv`]?
- [`LNKb`]? Linked
- [`ISSv`]? Smart Shape
- [`VISb`]? Visible
- [`OPAi`]? Opacity
- [`BLDi`]? Blend Mode

## `GRTi` **Gr**oup **T**ype

[`GRTi`]: #grti-group-type

Parent: [`GRPv`]

Values:

- `0`: regular
- `1`: grayscale mask (first element in parent node's [`ELMv`] = mask, second = masked)
- `2`: shape mask (first element in parent node's [`ELMv`] = mask, second = masked)

## `GSLb`

[`GSLb`]: #gslb

Parent: [`EXPv`]

Values:

- `false`: unknown - TODO - observed in all files

## `GSXf` **G**rid **S**ize **X**

[`GSXf`]: #gsxf-grid-size-x

Parent: [`GRDv`]

## `GSYf` **G**rid **S**ize **Y**

[`GSYf`]: #gsyf-grid-size-y

Parent: [`GRDv`]

## `HICi` **Hi**ghlight **C**olour

[`HICi`]: #hici-highlight-colour

Parent: [`BEHv`]

An ABGR colour for the popup menu border highlight.

Values:

- `4294967295`: unknown - TODO

## `HIMb`

[`HIMb`]: #himb

Parent: [`BEHv`]

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

Observed value range: `0.3`..`2`

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
- `3`: Copy HTML to clipboard

## `HTTs` **HT**ML S**t**yle

[`HTTs`]: #htts-html-style

Parent: [`EXPv`]

Values:

- `AIR`
- `Dreamweaver`
- `Generic`
- `GoLive`

## `IDSb`

[`IDSb`]: #idsb

Parent: [`MSTv`]

Values:

- `false`: unknown - TODO

## `ILLb`

[`ILLb`]: #illb

Parent: [`MKBv`]

Observed in all Fireworks CS4 files, not seen in Fireworks 8 files. Always seems to be `false`.

Values:

- `false`: unknown

## `IMDs` **Im**age **D**irectory

[`IMDs`]: #imds-image-directory

Parent: [`EXPv`]

Directory where image was last exported, as a URI beginning with "file://"

## `IMGv` **Im**a**g**e

[`IMGv`]: #imgv-image

Parent: [`ALSv`] / [`ELMv`] / [`FPTv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

A raster image, composed of one or more [`mkBT`] tiles. This is typically a "cached" render of vector data (e.g. rendered text)

Contains:

- [`LCKb`]? Lock
- [`XOFf`] X Offset
- [`YOFf`] Y Offset
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`WPXi`] Width Pixels
- [`HPXi`] Height Pixels
- [`TSZi`] Tile Size
- [`TILv`] Tile ID List
- [`DTAv`]? Data
- [`BLDi`]? Blend Mode
- [`EFLv`]? Effect List
- [`OPAi`]? Opacity
- [`VISb`]? Visible
- [`IMGv`]? Image
- [`OBNs`]? Object Name

## `IMPb` **I**s **M**aster **P**age

[`IMPb`]: #impb-is-master-page

Parent: [`MKBv`] / [`PDCv`]

One page can be marked as the master page, which is then referenced by [`MPLv`] nodes in each page (using [`PIDs`])

## `INMs` **I**nternal **N**a**m**e

[`INMs`]: #inms-internal-name

Parent: [`BPLv`] / [`EFLv`] / [`FGLv`] / [`FPLv`] / [`FPTv`] / [`TXBv`] / [`TXFv`] / [`URLv`]

Values:

- `1-Pixel Hard`
- `1-Pixel Soft`
- `3D Glow`
- `Accented Edges...`
- `Add Noise...`
- `Angled Strokes...`
- `Auto Levels`
- `Bas Relief...`
- `Berber Rug`
- `Bevel Boss...`
- `Blue Green`
- `Blue Wave`
- `Blur`
- `Blur More`
- `Brightness/Contrast...`
- `Bubbles`
- `Burlap`
- `Chalk && Charcoal...`
- `Chiffon`
- `Chrome...`
- `Cloth-Blue`
- `Cloth-Gray`
- `Cloth-Teal`
- `Clouds`
- `Color Fill`
- `Colored Pencil...`
- `Confetti`
- `Conical`
- `Contour`
- `Conté Crayon...`
- `Convert to Alpha`
- `Cotton`
- `Course-Orange`
- `Craquelure...`
- `Crosshatch 1`
- `Crosshatch 2`
- `Crosshatch 3`
- `Crosshatch...`
- `Curves...`
- `DNA`
- `Dark Flower`
- `Dark Strokes...`
- `Difference Clouds`
- `Diffuse Glow...`
- `Dots-Small`
- `Dots-Small 2`
- `Dots-large`
- `Dry Brush...`
- `Edges...`
- `Elliptical`
- `Fiber`
- `Film Grain...`
- `Find Edges`
- `Flames`
- `Gaussian Blur...`
- `Glass Bubble`
- `Glass-Textured`
- `Glass...`
- `Glowing Edges...`
- `Goo-Blue`
- `Grain`
- `Grain...`
- `Grass`
- `Grass-Large`
- `Grid 1`
- `Grid 2`
- `Grid 3`
- `Grid 4`
- `Grid 5`
- `Grid 6`
- `Grid 7`
- `Hatch 1`
- `Hatch 2`
- `Hatch 3`
- `Hatch 4`
- `Hatch 5`
- `Hue/Saturation...`
- `Illusion 1`
- `Illusion 2`
- `Impressionist-Blue`
- `Impressionist-Green`
- `Ink Outlines...`
- `Inner Glow`
- `Inner Shadow`
- `Invert`
- `Leaves`
- `Levels...`
- `Light Panel`
- `Light Panel 2`
- `Line Horiz 2`
- `Line-Diag 1`
- `Line-Diag 2`
- `Line-Horiz 1`
- `Line-Horiz 2`
- `Line-Horiz 3`
- `Line-Horiz 4`
- `Line-Vert 1`
- `Line-Vert 2`
- `Line-Vert 3`
- `Linear Smooth`
- `Marble...`
- `Mesh`
- `Metal`
- `Metal-Bars`
- `Metal-Bars-Small`
- `Metal-Slip`
- `Metal-Turbine`
- `Moon`
- `Mossy Rock`
- `Motion Blur...`
- `Motion Trail...`
- `Neon Glow...`
- `Note Paper...`
- `Ocean Ripple...`
- `Oil Paint 1`
- `Oil Paint 2`
- `Oil Paint 3`
- `Oilslick`
- `Onyx`
- `Paint Blue`
- `Paint Dark`
- `Paint Daubs...`
- `Palette Knife...`
- `Parchment`
- `Patchwork...`
- `Pattern`
- `Photocopy...`
- `Photoshop Live Effects`
- `Piano Keys`
- `Pinch`
- `Pits-Green`
- `Plaid Loose`
- `Plaid Tight`
- `Plaster`
- `Plaster...`
- `Plastic Wrap...`
- `Radial`
- `Radial Blur...`
- `Rectangular`
- `Red Amber`
- `Reticulation...`
- `Ripple`
- `Rough Pastels...`
- `Sand`
- `Sandpaper`
- `Satin`
- `Scratch`
- `Sharpen`
- `Sharpen More`
- `Sienna`
- `Smear`
- `Smoky`
- `Smudge Stick...`
- `Smudge-Green`
- `Smudge-Red`
- `Soft Rounded`
- `Solid`
- `Solid Shadow...`
- `Spatter...`
- `Sponge...`
- `Sprayed Strokes...`
- `Stamp...`
- `Static_01`
- `Sumi-e...`
- `Swirls`
- `Swish`
- `Texturizer...`
- `Threads 1`
- `Threads 2`
- `Threads 3`
- `Torn Edges...`
- `Tweed`
- `Twill`
- `UNUSED`
- `Underpainting...`
- `Unsharp Mask...`
- `Untitled`
- `Vein`
- `Violet`
- `Viscous Alien Paint`
- `Waffle`
- `Water Paper...`
- `Watercolor...`
- `Waves`
- `Weave`
- `Web Dither`
- `Wood`
- `Wood 2`
- `Wood 3`
- `Zoom Blur...`
- `bn_1-Pixel`
- `bn_1-Pixel Anti-Aliased`
- `bn_3D`
- `bn_3D Glow`
- `bn_Bamboo`
- `bn_Basic`
- `bn_Bristle`
- `bn_Broad Splatter`
- `bn_Chameleon`
- `bn_Colored Pencil`
- `bn_Confetti`
- `bn_Creamy`
- `bn_Dark Marker`
- `bn_Dashed_Basic`
- `bn_Dashed_Double`
- `bn_Dashed_Hard`
- `bn_Dashed_Heavy`
- `bn_Dashed_Triple`
- `bn_Dots`
- `bn_Dotted`
- `bn_Fluid Splatter`
- `bn_Fur`
- `bn_Graphite`
- `bn_Hard Line`
- `bn_Hard Rounded`
- `bn_Heavy`
- `bn_Highlighter`
- `bn_Light Marker`
- `bn_Outline`
- `bn_Paint Splatter`
- `bn_Pastel`
- `bn_Quill`
- `bn_Rake`
- `bn_Ribbon`
- `bn_Soft`
- `bn_Soft Line`
- `bn_Soft Rounded`
- `bn_Splatter`
- `bn_Squares`
- `bn_Strands`
- `bn_Textured`
- `bn_Textured Bristle`
- `bn_Thick`
- `bn_Thin`
- `bn_Toothpaste`
- `bn_Toxic Waste`
- `bn_Viscous Alien Paint`
- `bn_Wet`
- `bn_Yarn`
- `cn_BlackWhite`
- `cn_BlueRedYellow`
- `cn_BlueYellowBlue`
- `cn_Cobalt Blue`
- `cn_Copper`
- `cn_Emerald Green`
- `cn_Pastels`
- `cn_RedBlue`
- `cn_RedGreenBlue`
- `cn_Silver`
- `cn_Spectrum`
- `cn_VioletOrange`
- `cn_WhiteBlack`
- `en_Black_Shadow`
- `en_Flat`
- `en_Halo`
- `en_Inset`
- `en_Normal`
- `en_Raise`
- `en_Ring`
- `en_Ruffle`
- `en_Smooth`
- `en_Smooth_Inverted`
- `en_Soft`
- `en_ZigZag`
- `en_ZigZag2`
- `fn_Bars`
- `fn_Conical`
- `fn_ContourGrad`
- `fn_Elliptical`
- `fn_Folds`
- `fn_Linear`
- `fn_Normal`
- `fn_Pattern`
- `fn_Pinch`
- `fn_Radial`
- `fn_Rectangular`
- `fn_Ripple`
- `fn_Satin`
- `fn_Waves`
- `fn_WebDither`

## `IODb`

[`IODb`]: #iodb

Parent: [`MSTv`]

Values:

- `false`: unknown - TODO

## `ISCb` **Is** **C**losed

[`ISCb`]: #iscb-is-closed

Parent: [`PBPv`] / [`PPLv`]

Values:

- `false`: path is open
- `true`: path is closed (last point links to first)

## `ISPb` **Is** **P**rimary

[`ISPb`]: #ispb-is-primary

Parent: [`LSAv`] / [`LSEv`]

Values:

- `false`: this is a reference to an element defined elsewhere, based on the [`UIDs`] value (an [`LSAv`])
- `true`: this is the primary definition of the element (an [`LSEv`])

## `ISSv` **S**mart **S**hape

[`ISSv`]: #issv-smart-shape

Parent: [`GRPv`]

Contains:

- [`FILs`] Label
- [`JSVv`] JavaScript Script
- [`MTXv`] Matrix
- [`CPSv`] Control Points

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

- `90`: unknown - TODO - observed in all files

## `JSSs` **J**ava**S**cript **S**ubstring

[`JSSs`]: #jsss-javascript-substring

Parent: [`JSVv`]

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

## `JSVv` **J**ava**S**cript Script

[`JSVv`]: #jsvv-javascript-script

Parent: [`ISSv`]

A JavaScript script, potentially split into multiple [`JSSs`] pieces which must be concatenated together (this is to avoid the 65535-byte string length limit of the data format). Used for calculating changes to smart shapes.

Contains:

- [`JSSs`]+ JavaScript Substring

## `KRNf`

[`KRNf`]: #krnf

Parent: [`TXTv`]

Values:

- `0`: unknown - TODO

## `LAYv` **Lay**er

[`LAYv`]: #layv-layer

Parent: [`LSEv`] / [`LYLv`]

An individual top-level layer. Nested layers use [`LSLv`].

Contains:

- [`BKGb`]
- [`URLb`]
- [`LNMs`] Layer Name
- [`LLLi`]? Layer Nesting Level
- [`MSLb`] Special Layer
- [`MCLb`] Frame Changing Layer
- [`DISb`] Display
- [`CLLv`] Animation Cell List
- [`VIFv`] Visibility per Frame

## `LCKb` **L**o**ck**

[`LCKb`]: #lckb-lock

Parent: [`ALSv`] / [`CELv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`URLv`]

Values:

- `false`: the parent node is not locked and can be manipulated
- `true`: the parent node is locked and cannot be manipulated in the editor

## `LDMi` **L**ine Height Unit

[`LDMi`]: #ldmi-line-height-unit

Parent: [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `0`: em
- `1`: pixels

## `LEDf` **L**ine Height

[`LEDf`]: #ledf-line-height

Parent: [`TFSv`] / [`TXTv`] / [`ZSTv`]

Line height, in units defined by [`LDMi`]

Observed value range: `1`..`40`

## `LFAf` **L**e**f**t **A**nchor

[`LFAf`]: #lfaf-left-anchor

Parent: [`TXTv`]

Typically this is the same as [`LFTf`]. See [`PINf`] for an explanation of when this property will differ.

Observed value range: `-30`..`962`

## `LFTf` **L**e**ft**

[`LFTf`]: #lftf-left

Parent: [`CDMv`] / [`NGMv`] / [`NGVv`] / [`RCTv`] / [`TXTv`] / [`URLv`]

Distance (pixels) from left of container to left of entity.

## `LLLi` **L**ayer Nesting **L**evel

[`LLLi`]: #llli-layer-nesting-level

Parent: [`LAYv`] / [`LSLv`]

Appears to be the indentation level for the layer, counting from `0` for root-level layers.

## `LNKb` **L**i**nk**ed

[`LNKb`]: #lnkb-linked

Parent: [`GRPv`]

For mask groups, this controls whether the mask moves when the content is moved. Note that this node is never present with a value of `true`; `true` is implied by its absence.

Values:

- `false`: Content moves independently of mask

## `LNMs` **L**ayer **N**a**m**e

[`LNMs`]: #lnms-layer-name

Parent: [`LAYv`] / [`LSLv`] / [`MPLv`]

## `LRBi` Export A**r**ea **B**ottom

[`LRBi`]: #lrbi-export-area-bottom

Parent: [`EXPv`]

Y coordinate of bottom of export area (or not present if entire image is to be exported).

## `LRLi` Export A**r**ea **L**eft

[`LRLi`]: #lrli-export-area-left

Parent: [`EXPv`]

X coordinate of left of export area (or not present if entire image is to be exported).

## `LRRi` Export A**r**ea **R**ight

[`LRRi`]: #lrri-export-area-right

Parent: [`EXPv`]

X coordinate of right of export area (or not present if entire image is to be exported).

## `LRTi` Export A**r**ea **T**op

[`LRTi`]: #lrti-export-area-top

Parent: [`EXPv`]

Y coordinate of top of export area (or not present if entire image is to be exported).

## `LSAv` **L**ayer **S**ource Link

[`LSAv`]: #lsav-layer-source-link

Parent: [`LYLv`]

Links to an [`LSEv`] from the master page.

Contains:

- [`UIDs`] Unique ID
- [`ISPb`] Is Primary

## `LSDb` HTML Multiple Nav Bars

[`LSDb`]: #lsdb-html-multiple-nav-bars

Parent: [`EXPv`]

"Export multiple nav bar HTML files (for use without frame sets)".

## `LSEv` **L**ayer **S**hared Definition

[`LSEv`]: #lsev-layer-shared-definition

Parent: [`LSMv`]

Same as [`LAYv`] but defines a layer for future reference by [`LSAv`] rather than to display.

Contains:

- [`UIDs`] Unique ID
- [`ISPb`] Is Primary
- [`LAYv`] Layer

## `LSLv` **L**ayer **S**ub-**L**ayer

[`LSLv`]: #lslv-layer-sub-layer

Parent: [`ELMv`]

A layer nested inside another layer. Shares the same structure as [`LAYv`].

Contains:

- [`BKGb`]
- [`URLb`]
- [`LNMs`] Layer Name
- [`LLLi`] Layer Nesting Level
- [`MSLb`] Special Layer
- [`MCLb`] Frame Changing Layer
- [`DISb`] Display
- [`CLLv`] Animation Cell List
- [`VIFv`] Visibility per Frame

## `LSMv` **L**ayer **S**hared Definitions

[`LSMv`]: #lsmv-layer-shared-definitions

Parent: [`MKBv`] / [`PDCv`]

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

An ordered list of layers.

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

Image format disambiguation if [`FMTi`] is `3`. Represents a 4-character ASCII string.

Values:

- `1112363040`: "BMP "
- `1346978644`: "PICT"
- `1414088262`: "TIFF"
- `1463962960`: "WBMP"

## `MIDi` Text **C**olour Hover

[`MIDi`]: #midi-text-colour-hover

Parent: [`BEHv`]

A BGRA (?) colour for the text of highlighted menu items.

Value range: `0x00000000`..`0xffffffff`

## `MIHi` **M**enu **I**tem **H**eight

[`MIHi`]: #mihi-menu-item-height

Parent: [`BEHv`]

## `MITi` **M**enu **I**ndent **T**ext

[`MITi`]: #miti-menu-indent-text

Parent: [`BEHv`]

## `MIVb` **M**enu **I**tems **V**ertical

[`MIVb`]: #mivb-menu-items-vertical

Parent: [`BEHv`]

Values:

- `false`: menu is arranged horizontally
- `true`: menu is arranged vertically

## `MIWi` **M**enu **I**tem **W**idth

[`MIWi`]: #miwi-menu-item-width

Parent: [`BEHv`]

## `MKBv` Document

[`MKBv`]: #mkbv-document

Parent: [Root]

Defines any layer content which is shared between pages (in [`LSMv`] as [`LSEv`] nodes with a [`UIDs`] for individual pages to reference), and includes a slightly reduced copy of page 1 (first [`PDCv`]), including a copy of the master page's layers (if set). This is possibly for backwards compatibility. The `mkBS` chunk (Fireworks attribution) _only_ defines [`MKBv`] and does not include any [`PDCv`] chunks; this may be a glimpse of an old file structure.

Contains:

- [`VRSi`]?
- [`VRMi`]?
- [`FRCi`]+ Frame Count
- [`RQNi`]
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`WIDf`] Width
- [`HITf`] Height
- [`RESf`] Resolution
- [`RSUi`] Resolution Unit
- [`BGCi`] Background Colour
- [`PLLv`] Brush Definitions
- [`FLDv`] Fill Type Definitions
- [`GLDv`] Gradient List Definitions
- [`EFDv`] Effect Definitions
- [`MSLv`] Symbol Definition List
- [`ZSLv`]?
- [`PATv`] Pattern
- [`EXPv`] Export Options
- [`MNFv`]
- [`PGNs`]? Page Name
- [`IMPb`]? Is Master Page
- [`PILb`]? Page Is Linked
- [`PIDs`]? Page ID
- [`LSMv`]? Layer Shared Definitions
- [`ILLb`]?
- [`LYLv`] Layer List
- [`GRDv`] Grid
- [`GDSv`] Guides
- [`OSBi`] Onion Skinning Before Frames
- [`OSAi`] Onion Skinning After Frames
- [`LXDs`]? Last Export Directory
- [`LXFs`]? Last Export Filename

## `MNAb` **M**ask **N**ot **A**ppear

[`MNAb`]: #mnab-mask-not-appear

Parent: [`GRPv`]

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

- [`MNDs`] Default ALT Tag

## `MOXf`

[`MOXf`]: #moxf

Parent: [`MSTv`]

Values:

- `0`: unknown - TODO

## `MOYf`

[`MOYf`]: #moyf

Parent: [`MSTv`]

Values:

- `0`: unknown - TODO

## `MPLv` **M**aster **P**age **L**ink

[`MPLv`]: #mplv-master-page-link

Parent: [`LYLv`]

References all layers from another [`PDCv`] (the "Master Page"), by [`PIDs`]. The referenced layers are atomic, but the whole structure can be displayed / hidden for this specific page as part of the reference.

Contains:

- [`PIDs`] Page ID
- [`DISb`] Display
- [`LNMs`] Layer Name
- [`VIFv`] Visibility per Frame

## `MRMv`

[`MRMv`]: #mrmv

Parent: [`GRPv`]

Grayscale mask definition ?

Contains:

- [`PTHv`] Path

## `MSKv` **M**a**sk**

[`MSKv`]: #mskv-mask

Parent: [`TXBv`] / [`TXFv`]

A raster mask, composed of one or more [`mkBT`] tiles.

Contains:

- [`WPXi`] Width Pixels
- [`HPXi`] Height Pixels
- [`TSZi`] Tile Size
- [`TILv`] Tile ID List

## `MSLb` **S**pecial **L**ayer

[`MSLb`]: #mslb-special-layer

Parent: [`LAYv`] / [`LSLv`]

Values:

- `false`: regular layer
- `true`: special layer (currently: "Web Layer") - presumably blocks actions like deletion

## `MSLv` **S**ymbol Definition **L**ist

[`MSLv`]: #mslv-symbol-definition-list

Parent: [`MKBv`]

Contains:

- [`MSTv`]\* Symbol Definition

## `MSNi` **S**ymbol Unique **N**umber

[`MSNi`]: #msni-symbol-unique-number

Parent: [`ALSv`] / [`MSTv`] / [`URLv`]

A 32-bit number which uniquely defines a symbol in the document. Used to link [`ALSv`] instances to [`MSTv`] definitions.

Observed value range: `0x01d850af`..`0x7fa4d095` (`30953647`..`2141507733`)

## `MSTv` **S**ymbol Definition

[`MSTv`]: #mstv-symbol-definition

Parent: [`MSLv`]

A node containing many of the same elements as a page ([`PDCv`]), defining a symbol which can be referenced multiple times in the document by [`ALSv`] nodes with [`MSNi`] IDs.

Contains:

- [`UNMs`] User-facing Name
- [`MSNi`] Symbol Unique Number
- [`MOXf`]
- [`MOYf`]
- [`LUTs`] Last Update Time
- [`LYLv`] Layer List
- [`GRDv`] Grid
- [`GDSv`] Guides
- [`FRCi`] Frame Count
- [`OSBi`] Onion Skinning Before Frames
- [`OSAi`] Onion Skinning After Frames
- [`BGCi`] Background Colour
- [`ATSb`]
- [`IDSb`]
- [`DVLb`]
- [`IODb`]
- [`MSYi`]? Symbol Type
- [`NGSv`]? Nine Slice Guide

## `MSYi` **S**ymbol T**y**pe

[`MSYi`]: #msyi-symbol-type

Parent: [`MSTv`]

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

Defines which of [`DO1i`] / [`DF1i`] .. [`DO3i`] / [`DF3i`] are used

Value range: `0`..`3`

## `NGCf` **N**ine Slice **G**uide **C**ontrol

[`NGCf`]: #ngcf-nine-slice-guide-control

Parent: [`NGSv`]

A set of 4 ordered control points for the 9-slice guide: top, bottom, left, right

## `NGKi` **N**ine Slice **G**uide Colour

[`NGKi`]: #ngki-nine-slice-guide-colour

Parent: [`NGSv`]

An ARGB (or BGRA?) colour for the 9-slice guide-lines.

Value range: `0x00000000`..`0xffffffff`

## `NGLb` **N**ine Slice **G**uide **L**ocked

[`NGLb`]: #nglb-nine-slice-guide-locked

Parent: [`NGSv`]

## `NGMv` **N**ine Slice **G**uide Shape Bounds

[`NGMv`]: #ngmv-nine-slice-guide-shape-bounds

Parent: [`NGSv`]

Bounds of the symbol's content, relative to the symbol origin.

Contains:

- [`LFTf`] Left
- [`TOPf`] Top
- [`RITf`] Right
- [`BOTf`] Bottom

## `NGSv` **N**ine **S**lice Guide

[`NGSv`]: #ngsv-nine-slice-guide

Parent: [`MSTv`]

Contains:

- [`NGLb`] Nine Slice Guide Locked
- [`NGKi`] Nine Slice Guide Colour
- [`NGCf`] (x4) Nine Slice Guide Control
- [`NGMv`] Nine Slice Guide Shape Bounds
- [`NGVv`] Nine Slice Guide Limits

## `NGVv` **N**ine Slice **G**uide Limits

[`NGVv`]: #ngvv-nine-slice-guide-limits

Parent: [`NGSv`]

Bounds of the space available for the 9-slice guide, relative to the symbol origin (defines a space a few pixels larger than the canvas).

Contains:

- [`LFTf`] Left
- [`TOPf`] Top
- [`RITf`] Right
- [`BOTf`] Bottom

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

## `NSDf` **S**egment **D**istance

[`NSDf`]: #nsdf-segment-distance

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

Parent: [`ALSv`] / [`CPTv`] / [`FNMv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`URLv`]

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

## `OVHb` **Ov**erride **H**eight

[`OVHb`]: #ovhb-override-height

Parent: [`BEHv`]

Values:

- `false`: cell height is calculated automatically
- `true`: cell height is set manually

## `OVWb` **Ov**erride **W**idth

[`OVWb`]: #ovwb-override-width

Parent: [`BEHv`]

Values:

- `false`: cell width is calculated automatically
- `true`: cell width is set manually

## `PALv` **Pal**ette

[`PALv`]: #palv-palette

Parent: [`EXPv`]

Contains multiple colours, each beginning with [`FCLi`] and followed by zero or more attributes

Contains:

- [`FCLi`]\* Fill Colour
- [`CLLb`]\* Colour Locked
- [`CLTb`]\* Colour Transparent
- [`CLMb`]? Colour Mapped
- [`BCLi`]? Brush Colour

## `PATv` **Pat**tern

[`PATv`]: #patv-pattern

Parent: [`MKBv`] / [`PDCv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

Contains:

- [`BCLi`] Brush Colour
- [`FCLi`] Fill Colour
- [`FPLv`]? Fill Pattern Properties
- [`TXBv`] Texture Brush
- [`TXFv`] Texture Fill
- [`BPLv`]? Brush Property List

## `PBLv` **P**ath **B**ezier **L**ist

[`PBLv`]: #pblv-path-bezier-list

Parent: [`PTHv`]

Contains:

- [`PBPv`]+ Path Bezier Points

## `PBPv` **P**ath **B**ezier **P**oints

[`PBPv`]: #pbpv-path-bezier-points

Parent: [`PBLv`] / [`URLv`]

Contains:

- [`ISCb`] Is Closed
- [`BSLf`]
- [`PPCi`] Path Point Count
- [`PBTv`]\* Path Bezier Point

## `PBTv` **P**ath **B**ezier Poin**t**

[`PBTv`]: #pbtv-path-bezier-point

Parent: [`PBPv`]

Contains:

- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`XPCf`]? X Primary Control
- [`YPCf`]? Y Primary Control
- [`XSCf`]? X Secondary Control
- [`YSCf`]? Y Secondary Control
- [`CRVb`]? Is Curve
- [`RNDi`]? Random Seed
- [`NSDf`]? Segment Distance
- [`BZLv`] Bezier Sub-Points List
- [`PPLv`]? Path Point List

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

- [`PPLv`]+ Path Point List

## `PDCv` **P**age

[`PDCv`]: #pdcv-page

Parent: [Root]

An individual page. Contains frames ("states") and layers. Layers shared to all pages reference a source defined in [`MKBv`].

Contains:

- [`VRSi`]
- [`VRMi`]
- [`FRCi`] (x2) Frame Count
- [`RQNi`]
- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`WIDf`] Width
- [`HITf`] Height
- [`RESf`] Resolution
- [`RSUi`] Resolution Unit
- [`BGCi`] Background Colour
- [`PLLv`] Brush Definitions
- [`FLDv`] Fill Type Definitions
- [`GLDv`] Gradient List Definitions
- [`EFDv`] Effect Definitions
- [`PATv`] Pattern
- [`EXPv`] Export Options
- [`MNFv`]
- [`PGNs`] Page Name
- [`IMPb`] Is Master Page
- [`PILb`] Page Is Linked
- [`PIDs`] Page ID
- [`LSMv`] Layer Shared Definitions
- [`LYLv`] Layer List
- [`GDSv`] Guides
- [`OSBi`] Onion Skinning Before Frames
- [`OSAi`] Onion Skinning After Frames
- [`LXDs`]? Last Export Directory
- [`LXFs`]? Last Export Filename
- [`GRDv`]? Grid

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

## `PIDs` **P**age **ID**

[`PIDs`]: #pids-page-id

Parent: [`MKBv`] / [`MPLv`] / [`PDCv`]

A UUID for the page.

## `PILb` **P**age **I**s **L**inked

[`PILb`]: #pilb-page-is-linked

Parent: [`MKBv`] / [`PDCv`]

Marks page as "linked" to the "Master Page". Linked pages are automatically updated with new properties set on the master page (e.g. background colour).

## `PINf` **P**aragraph **In**dent

[`PINf`]: #pinf-paragraph-indent

Parent: [`TFSv`] / [`TXTv`]

Amount to indent the first line of the paragraph by. If the text is not multiline (i.e. [`ATEb`] is `true`), the [`LFTf`] value is modified and [`LFAf`] stores the original left coordinate. If the text _is_ multiline (i.e. [`ATEb`] is `false`), the [`LFTf`] and [`LFAf`] values remain equal and the indent is applied inside the text area.

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

- [`BPLv`]+ Brush Property List

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

Observed value range: `0x00000002`..`0x00000100` (`2`..`256`)

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

## `PPCi` **P**ath **P**oint **C**ount

[`PPCi`]: #ppci-path-point-count

Parent: [`PBPv`] / [`PPLv`]

Equal to the number of [`PBTv`] nodes contained in the parent node

## `PPLv` **P**ath **P**oint **L**ist

[`PPLv`]: #pplv-path-point-list

Parent: [`PBTv`] / [`PCLv`]

List of points defining an interpolated path. The source of truth for this path will be a [`PBPv`].

Contains:

- [`ISCb`]? Is Closed
- [`PPCi`]? Path Point Count
- [`PPTv`]+ Path Point

## `PPTv` **P**ath **P**oin**t**

[`PPTv`]: #pptv-path-point

Parent: [`PPLv`]

Contains:

- [`XLCf`] X Location
- [`YLCf`] Y Location
- [`PRSf`] Pressure
- [`VELf`] Velocity
- [`DURi`]? Duration
- [`RNDi`] Random Seed
- [`ONCb`]? On Control Point

## `PRIv` **Pri**mitive

[`PRIv`]: #priv-primitive

Parent: [`PTHv`]

The source shape and transformation which created the current path. Allows modifying properties such as corner radius.

Contains:

- [`PCFb`]
- [`PSXf`] Fill Point 1 (S) X
- [`PSYf`] Fill Point 1 (S) Y
- [`PEXf`] Fill Point 2 (E) X
- [`PEYf`] Fill Point 2 (E) Y
- [`PFXf`] Fill Point 3 (F) X
- [`PFYf`] Fill Point 3 (F) Y
- [`MTXv`] Matrix
- [`RCTv`] Rectangle
- [`RDMb`]? Border Radius Maintain
- [`EFLv`]? Effect List

## `PRSf` **Pr**e**s**sure

[`PRSf`]: #prsf-pressure

Parent: [`BAZv`] / [`PPTv`]

Value range: `0`..`1`

## `PSAf` **P**aragraph **S**pace **A**fter

[`PSAf`]: #psaf-paragraph-space-after

Parent: [`TFSv`] / [`TXTv`]

Paragraph bottom margin (pixels)

## `PSBf` **P**aragraph **S**pace **B**efore

[`PSBf`]: #psbf-paragraph-space-before

Parent: [`TFSv`] / [`TXTv`]

Paragraph top margin (pixels)

## `PSXf` Fill **P**oint 1 (**S**) **X**

[`PSXf`]: #psxf-fill-point-1-s-x

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

## `PSYf` Fill **P**oint 1 (**S**) **Y**

[`PSYf`]: #psyf-fill-point-1-s-y

Parent: [`PRIv`] / [`PTHv`] / [`TXTv`] / [`ZSTv`]

## `PTHv` **P**a**th**

[`PTHv`]: #pthv-path

Parent: [`ELMv`] / [`MRMv`] / [`TAPv`]

Contains:

- [`LCKb`]? Lock
- [`PATv`] Pattern
- [`BRPi`] Brush Placement
- [`PTTi`] Path Templated
- [`FOTb`] Fill On Top
- [`RNDi`] Random Seed
- [`TOXf`] Texture Offset X
- [`TOYf`] Texture Offset Y
- [`PCFb`]
- [`PSXf`] Fill Point 1 (S) X
- [`PSYf`] Fill Point 1 (S) Y
- [`PEXf`] Fill Point 2 (E) X
- [`PEYf`] Fill Point 2 (E) Y
- [`PFXf`] Fill Point 3 (F) X
- [`PFYf`] Fill Point 3 (F) Y
- [`PBLv`] Path Bezier List
- [`PCLv`] Path Contour List
- [`DTAv`]? Data
- [`EOFb`]? Even-Odd Fill Rule
- [`AGMb`]?
- [`IMGv`]? Image
- [`OBNs`]? Object Name
- [`BLDi`]? Blend Mode
- [`PRIv`]? Primitive
- [`EFLv`]? Effect List
- [`VISb`]? Visible
- [`OPAi`]? Opacity

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

- [`RDSf`] Border Radius
- [`LFTf`] Left
- [`TOPf`] Top
- [`RITf`] Right
- [`BOTf`] Bottom

## `RDMb` Border **R**a**d**ius **M**aintain

[`RDMb`]: #rdmb-border-radius-maintain

Parent: [`PRIv`]

[`RDSf`] is always measured as a percentage (0-100), but if this is `true`, it will be recalculated when the shape changes size to maintain an absolute radius size.

Values:

- `false`: [`RDSf`] remains constant; radius is proportional to shape size
- `true`: [`RDSf`] is recalculated when the shape is resized to maintain a constant absolute radius

## `RDOb`

[`RDOb`]: #rdob

Parent: [`BPLv`] / [`FPLv`]

Values:

- `false`: unknown - TODO - observed in all files

## `RDSf` Border **R**a**d**iu**s**

[`RDSf`]: #rdsf-border-radius

Parent: [`RCTv`]

This is always measured as a percentage (0-100), but if [`RDMb`] is set on the parent, it will be recalculated when the shape changes size to maintain an absolute radius size.

Value range: `0`..`100` (percent)

## `RELb`

[`RELb`]: #relb

Parent: [`BEHv`]

Values:

- `true`: unknown - TODO

## `RESf` **Res**olution

[`RESf`]: #resf-resolution

Parent: [`MKBv`] / [`PDCv`]

The resolution of the image. Units are specified in [`RSUi`].

## `RIAf`

[`RIAf`]: #riaf

Parent: [`TXTv`]

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

## `RNDi` **R**a**nd**om Seed

[`RNDi`]: #rndi-random-seed

Parent: [`PBTv`] / [`PPTv`] / [`PTHv`] / [`TXTv`]

Observed value range: `0x00000000`..`0x08719d5e` (`0`..`141663582`)

## `RQNi`

[`RQNi`]: #rqni

Parent: [`MKBv`] / [`PDCv`]

Observed value range: `0x0001184a`..`0x7eb46c2d` (`71754`..`2125753389`)

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

Value range: `0`..`1000` (per mille)

## `SHBi` **S**ensitivity to **H**orizontal on **B**lackness

[`SHBi`]: #shbi-sensitivity-to-horizontal-on-blackness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SHHi` **S**ensitivity to **H**orizontal on **H**ue

[`SHHi`]: #shhi-sensitivity-to-horizontal-on-hue

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SHLi` **S**ensitivity to **H**orizontal on **L**ightness

[`SHLi`]: #shli-sensitivity-to-horizontal-on-lightness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SHOi` **S**ensitivity to **H**orizontal on **O**pacity

[`SHOi`]: #shoi-sensitivity-to-horizontal-on-opacity

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SHRi` **S**ensitivity to **H**orizontal on Scatte**r**

[`SHRi`]: #shri-sensitivity-to-horizontal-on-scatter

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SHSi` **S**ensitivity to **H**orizontal on **S**aturation

[`SHSi`]: #shsi-sensitivity-to-horizontal-on-saturation

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SHZi` **S**ensitivity to **H**orizontal on Si**z**e

[`SHZi`]: #shzi-sensitivity-to-horizontal-on-size

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SPAi` **S**ensitivity to **P**ressure on **A**ngle

[`SPAi`]: #spai-sensitivity-to-pressure-on-angle

Parent: [`BPLv`]

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

Value range: `0`..`1000` (per mille)

## `SSZi` **S**ensitivity to **S**peed on Si**z**e

[`SSZi`]: #sszi-sensitivity-to-speed-on-size

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVAi` **S**ensitivity to **V**ertical on **A**ngle

[`SVAi`]: #svai-sensitivity-to-vertical-on-angle

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVBi` **S**ensitivity to **V**ertical on **B**lackness

[`SVBi`]: #svbi-sensitivity-to-vertical-on-blackness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVHi` **S**ensitivity to **V**ertical on **H**ue

[`SVHi`]: #svhi-sensitivity-to-vertical-on-hue

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVLi` **S**ensitivity to **V**ertical on **L**ightness

[`SVLi`]: #svli-sensitivity-to-vertical-on-lightness

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVOi` **S**ensitivity to **V**ertical on **O**pacity

[`SVOi`]: #svoi-sensitivity-to-vertical-on-opacity

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVRi` **S**ensitivity to **V**ertical on Scatte**r**

[`SVRi`]: #svri-sensitivity-to-vertical-on-scatter

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVSi` **S**ensitivity to **V**ertical on **S**aturation

[`SVSi`]: #svsi-sensitivity-to-vertical-on-saturation

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `SVZi` **S**ensitivity to **V**ertical on Si**z**e

[`SVZi`]: #svzi-sensitivity-to-vertical-on-size

Parent: [`BPLv`]

Value range: `0`..`1000` (per mille)

## `TA1i` **T**ext **A**nti-Aliasing Sharpness

[`TA1i`]: #ta1i-text-anti-aliasing-sharpness

Parent: [`TXTv`] / [`ZSTv`]

Value range: `0`..`255`

## `TA2i` **T**ext **A**nti-Aliasing Strength

[`TA2i`]: #ta2i-text-anti-aliasing-strength

Parent: [`TXTv`] / [`ZSTv`]

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

Values:

- `0`: unknown - TODO - observed in all files

## `TAMi` **T**ext **A**lign**m**ent

[`TAMi`]: #tami-text-alignment

Parent: [`TAPv`]

Controls text orientation when following a path.

Values:

- `0`: rotate
- `1`: no rotate
- `2`: skew vertical
- `3`: skew horizontal

## `TAPv` **T**ext **A**long **P**ath

[`TAPv`]: #tapv-text-along-path

Parent: [`TXTv`]

Contains:

- [`TAMi`] Text Alignment
- [`CHOf`] Character Offset
- [`PTHv`] Path

## `TDTs` Cell (**TD**) **T**ext

[`TDTs`]: #tdts-cell-td-text

Parent: [`URLv`]

## `TFSv` **T**ext **F**ormatted **S**tring

[`TFSv`]: #tfsv-text-formatted-string

Parent: [`TXTv`]

Contains a list of formatting operations and text runs.

Contains:

- [`FONs`]\* Font Family
- [`PTSf`]\* Font Point Size
- [`BOLb`]\* Bold
- [`ITLb`]\* Italic
- [`UNDb`]\* Underline
- [`HSCf`]\* Horizontal Scale
- [`RKNf`]\* Kerning
- [`BLSf`]\* Baseline Shift
- [`LEDf`]\* Line Height
- [`LDMi`]\* Line Height Unit
- [`JSTi`]\* Justification
- [`FCLi`]\* Fill Colour
- [`PINf`]\* Paragraph Indent
- [`PSBf`]\* Paragraph Space Before
- [`PSAf`]\* Paragraph Space After
- [`TRNs`]+ Text Run

## `TFTi` **T**ext **F**low

[`TFTi`]: #tfti-text-flow

Parent: [`TXTv`]

Values:

- `0`: normal
- `1`: fit to width (defined in [`BOAf`])
- `2`: follow path
- `3`: fit inside shape

## `TIAb`

[`TIAb`]: #tiab

Parent: [`ZSTv`]

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

## `TMCi` **T**ile **M**atte **C**olour

[`TMCi`]: #tmci-tile-matte-colour

Parent: [`TILv`]

Substitute for [`TIDi`] if only a solid colour is required for the tile area. Represents an ARGB colour.

Value range: `0x00000000`..`0xffffffff`

## `TMOi` Menu Delay

[`TMOi`]: #tmoi-menu-delay

Parent: [`BEHv`]

Menu delay in milliseconds

## `TOAf`

[`TOAf`]: #toaf

Parent: [`TXTv`]

Observed value range: `2`..`997`

## `TOPf` **Top**

[`TOPf`]: #topf-top

Parent: [`CDMv`] / [`NGMv`] / [`NGVv`] / [`RCTv`] / [`TXTv`] / [`URLv`]

Distance (pixels) from top of container to top of entity.

## `TOSi` **T**ext Anti-Aliasing **S**amples

[`TOSi`]: #tosi-text-anti-aliasing-samples

Parent: [`TXTv`] / [`ZSTv`]

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

Values:

- `0`: foreground
- `2`: background

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

Grab handle config controlled by `toolTipTracksDrag` in JavaScript.

Values:

- `false`: Tooltip disappears when the handle is dragged
- `true`: Tooltip remains visible while the handle is dragged, and updates its contents live

## `TTPs` **T**ool**t**i**p**

[`TTPs`]: #ttps-tooltip

Parent: [`CPTv`]

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

- [`LFTf`] Left
- [`TOPf`] Top
- [`RITf`] Right
- [`BOTf`] Bottom
- [`LFAf`]? Left Anchor
- [`TOAf`]?
- [`RIAf`]?
- [`BOAf`]? Bounds
- [`TFTi`]? Text Flow
- [`FOAb`]?
- [`LCKb`]? Lock
- [`PATv`] Pattern
- [`BRPi`] Brush Placement
- [`PTTi`] Path Templated
- [`FOTb`] Fill On Top
- [`RNDi`] Random Seed
- [`TOXf`] Texture Offset X
- [`TOYf`] Texture Offset Y
- [`ORIi`] Orientation
- [`XFMi`]
- [`TAAi`] Text Anti-Alias
- [`TA1i`]? Text Anti-Aliasing Sharpness
- [`TA2i`]? Text Anti-Aliasing Strength
- [`TOSi`]? Text Anti-Aliasing Samples
- [`ATEb`] Auto-Enlarge
- [`ATKb`] Auto-Kern
- [`FONs`] Font Family
- [`CFTs`]? Font Typeface
- [`PTSf`] Font Point Size
- [`BOLb`] Bold
- [`ITLb`] Italic
- [`UNDb`] Underline
- [`HSCf`] Horizontal Scale
- [`KRNf`]
- [`RKNf`] Kerning
- [`BLSf`] Baseline Shift
- [`LEDf`] Line Height
- [`LDMi`] Line Height Unit
- [`JSTi`] Justification
- [`PINf`] Paragraph Indent
- [`PSBf`] Paragraph Space Before
- [`PSAf`] Paragraph Space After
- [`TFSv`] Text Formatted String
- [`DTAv`]? Data
- [`IMGv`] Image
- [`PCFb`]?
- [`PSXf`]? Fill Point 1 (S) X
- [`PSYf`]? Fill Point 1 (S) Y
- [`PEXf`]? Fill Point 2 (E) X
- [`PEYf`]? Fill Point 2 (E) Y
- [`PFXf`]? Fill Point 3 (F) X
- [`PFYf`]? Fill Point 3 (F) Y
- [`TAPv`]? Text Along Path
- [`OBNs`]? Object Name
- [`OPAi`]? Opacity
- [`EFLv`]? Effect List
- [`MTXv`]? Matrix
- [`VISb`]? Visible
- [`BLDi`]? Blend Mode

## `UIDs` **U**nique **ID**

[`UIDs`]: #uids-unique-id

Parent: [`LSAv`] / [`LSEv`]

A UUID which is unique within the file. [`LSAv`] uses this to reference shared content defined in [`LSEv`] nodes.

## `UNDb` **Und**erline

[`UNDb`]: #undb-underline

Parent: [`TFSv`] / [`TXTv`] / [`ZSTv`]

Values:

- `false`: end underline
- `true`: begin underline

## `UNMs` **U**ser-facing **N**a**m**e

[`UNMs`]: #unms-user-facing-name

Parent: [`BPLv`] / [`FPLv`] / [`MSTv`] / [`TXFv`]

Values:

- `1-Pixel Hard`
- `1-Pixel Soft`
- `3D`
- `3D Glow`
- `Bamboo`
- `Basic`
- `Basic Dash`
- `Bristle`
- `Broad Splatter`
- `Chameleon`
- `Colored Pencil`
- `Confetti`
- `Conical`
- `Contour`
- `Creamy`
- `Dark Marker`
- `Dash Double`
- `Dash Triple`
- `Dots`
- `Dotted`
- `Elliptical`
- `Fluid Splatter`
- `Fur`
- `Graphite`
- `Hard Dash`
- `Hard Line`
- `Hard Rounded`
- `Heavy`
- `Heavy Dash`
- `Highlighter`
- `Light Marker`
- `Linear Smooth`
- `Outline`
- `Paint Splatter`
- `Pastel`
- `Pattern`
- `Pinch`
- `Quill`
- `Radial`
- `Rake`
- `Rectangular`
- `Ribbon`
- `Ripple`
- `RockTileFine`
- `Satin`
- `Soft`
- `Soft Line`
- `Soft Rounded`
- `Solid`
- `Splatter`
- `Squares`
- `Strands`
- `Textured`
- `Textured Bristle`
- `Thick`
- `Thin`
- `Toothpaste`
- `Toxic Waste`
- `Viscous Alien Paint`
- `Waves`
- `Web Dither`
- `Wet`
- `Yarn`
- `fn_Bars`
- `fn_Conical`
- `fn_ContourGrad`
- `fn_Elliptical`
- `fn_Folds`
- `fn_Linear`
- `fn_Normal`
- `fn_Pattern`
- `fn_Pinch`
- `fn_Radial`
- `fn_Rectangular`
- `fn_Ripple`
- `fn_Satin`
- `fn_Waves`
- `fn_WebDither`

## `URLb`

[`URLb`]: #urlb

Parent: [`LAYv`] / [`LSLv`]

Values:

- `false`: Regular layer
- `true`: Web Layer (slices)

## `URLv` Image Slice / Hotspot

[`URLv`]: #urlv-image-slice-hotspot

Parent: [`ELMv`]

Contains:

- [`INMs`]? Internal Name
- [`A2Ts`]? Anchor Link Alt Text
- [`ALTs`]? Anchor Link Target
- [`FCLi`] Fill Colour
- [`URSi`] URL Hotspot Shape
- [`LFTf`] Left
- [`TOPf`] Top
- [`RITf`] Right
- [`BOTf`] Bottom
- [`PBPv`]? Path Bezier Points
- [`OBNs`]? Object Name
- [`DTAv`]? Data
- [`LCKb`]? Lock
- [`BEVv`]? Behaviour List
- [`TSLi`]? Type of Slice
- [`MSNi`]? Symbol Unique Number
- [`CBTb`]?
- [`CBRi`]? Cell Background (Slice) Repeat
- [`CBAi`]? Cell Background (Slice) Attachment
- [`CBHi`]? Cell Background (Slice) Horizontal Position
- [`CHVi`]? Cell Horizontal Value
- [`CBVi`]? Cell Background (Slice) Vertical Position
- [`CVVi`]? Cell Vertical Value
- [`FILs`]? Label
- [`TDTs`]? Cell (TD) Text
- [`EXPv`]? Export Options

## `URSi` **UR**L Hotspot **S**hape

[`URSi`]: #ursi-url-hotspot-shape

Parent: [`URLv`]

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

Parent: [`CELv`] / [`CPTv`] / [`FNMv`] / [`GRPv`] / [`IMGv`] / [`PTHv`] / [`TXTv`] / [`VIFv`]

## `VRMi`

[`VRMi`]: #vrmi

Parent: [`MKBv`] / [`PDCv`]

Not seen in Fireworks 8 files.

Values:

- `1`: unknown - TODO

## `VRSi`

[`VRSi`]: #vrsi

Parent: [`MKBv`] / [`PDCv`]

Not seen in Fireworks 8 files.

Values:

- `9`: unknown - TODO
- `10`: unknown - TODO

## `WIDf` **Wid**th

[`WIDf`]: #widf-width

Parent: [`MKBv`] / [`PDCv`]

The width of the document (pixels).

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

Values:

- `-5`: unknown - TODO

## `XSZi` Export **X** **S**i**z**e

[`XSZi`]: #xszi-export-x-size

Parent: [`EXPv`]

Width (in pixels) of the exported image, if [`CNSi`] is `true`.

## `XTMi` **X**H**TM**L

[`XTMi`]: #xtmi-xhtml

Parent: [`EXPv`]

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

Values:

- `7`: unknown - TODO

## `YSZi` Export **Y** **S**i**z**e

[`YSZi`]: #yszi-export-y-size

Parent: [`EXPv`]

Height (in pixels) of the exported image, if [`CNSi`] is `true`.

## `ZSFi`

[`ZSFi`]: #zsfi

Parent: [`ZSTv`]

Values:

- `447`: unknown - TODO

## `ZSLv`

[`ZSLv`]: #zslv

Parent: [`MKBv`]

No observed child nodes.

## `ZSNs`

[`ZSNs`]: #zsns

Parent: [`ZSTv`]

Values:

- `Style 3`: unknown - TODO
- `Style 5`: unknown - TODO

## `ZSOi`

[`ZSOi`]: #zsoi

Parent: [`ZSTv`]

Values:

- `8`: unknown - TODO

## `ZSTv`

[`ZSTv`]: #zstv

Parent: [`BEHv`]

Contains:

- [`ZSNs`]
- [`ZSFi`]
- [`ZSOi`]
- [`PATv`] Pattern
- [`PSXf`] Fill Point 1 (S) X
- [`PSYf`] Fill Point 1 (S) Y
- [`PEXf`] Fill Point 2 (E) X
- [`PEYf`] Fill Point 2 (E) Y
- [`PFXf`] Fill Point 3 (F) X
- [`PFYf`] Fill Point 3 (F) Y
- [`BRPi`] Brush Placement
- [`FOTb`] Fill On Top
- [`FALi`]
- [`FATi`]
- [`FARi`]
- [`FABi`]
- [`EFLv`] Effect List
- [`FONs`] Font Family
- [`CFTs`] Font Typeface
- [`PTSf`] Font Point Size
- [`BOLb`] Bold
- [`ITLb`] Italic
- [`UNDb`] Underline
- [`JSTi`] Justification
- [`HSCf`] Horizontal Scale
- [`RKNf`] Kerning
- [`LEDf`] Line Height
- [`LDMi`] Line Height Unit
- [`ATKb`] Auto-Kern
- [`TIAb`]
- [`TAAi`] Text Anti-Alias
- [`TA1i`] Text Anti-Aliasing Sharpness
- [`TA2i`] Text Anti-Aliasing Strength
- [`TOSi`] Text Anti-Aliasing Samples
- [`IMGv`] (x2) Image

[`mkBT`]: ./Fireworks.md#mkbt
