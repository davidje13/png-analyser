import { asBytes, getJIS, getLatin1, getUTF8, subViewLen } from '../data/utils.mjs';

/** @typedef {{ fields: { tag: number, type: number, value: unknown }[] }} TIFFImage */

/**
 * @param {DataView<ArrayBuffer>} data
 * @param {string[]} warnings
 */
export function readEXIF(data, warnings) {
	const endianness = data.getUint16(0, false);
	let littleEndian = false;
	if (endianness === 0x4D4D) {
		littleEndian = false;
	} else if (endianness === 0x4949) {
		littleEndian = true;
	} else {
		const versionTest = data.getUint16(2, false);
		if (versionTest === 0x002A) {
			warnings.push('EXIF: Unknown endianness, looks like big endian');
			littleEndian = false;
		} else if (versionTest === 0x2A00) {
			warnings.push('EXIF: Unknown endianness, looks like little endian');
			littleEndian = true;
		} else {
			warnings.push('EXIF: Unknown endianness, guessing big endian');
		}
	}

	const tiffVersion = data.getUint16(2, littleEndian);
	if (tiffVersion !== 42) {
		warnings.push('EXIF: Unexpected TIFF version');
	}

	const tiffImages = readEXIFPart(data, data.getUint32(4, littleEndian), 2, 1, littleEndian, warnings);

	return {
		toString() {
			return tiffImages.map((img, i) => `- ${['metadata', 'thumbnail'][i]}:\n` + printTIFFMeta(img, '	')).join('\n');
		},
		extractThumbnailDataURI() {
			const pos = findFieldNumber(tiffImages[1], 0x0201);
			let size = findFieldNumber(tiffImages[1], 0x0202);
			if (pos === null) {
				return null;
			}
			if (size === null) {
				size = data.byteLength - pos;
			}
			if (pos < 0 || pos + size > data.byteLength) {
				return null;
			}
			const jpegData = /** @type {{ toBase64?: () => string }} */ (asBytes(subViewLen(data, pos, size, [])));
			if (jpegData.toBase64) {
				return `data:image/jpeg;base64,${jpegData.toBase64()}`;
			} else {
				return null;
			}
		},
	};
}

/**
 * @param {TIFFImage} image
 */
function printTIFFMeta(image, indent = '') {
	return image.fields.map((f) => {
		const tag = TAGS.get(f.tag);
		if (tag && f.value !== null) {
			return `${indent}- ${tag.name}: ${tag.print(f.value, f.type, indent)}`;
		} else {
			return `${indent}- ${f.tag.toString(16).padStart(4, '0')}.H: (type ${f.type}) ${JSON.stringify(f.value)}`;
		}
	}).join('\n');
}

/**
 * @param {TIFFImage | undefined} image
 * @param {number} tag
 */
function findFieldNumber(image, tag) {
	if (!image) {
		return null;
	}
	for (const field of image.fields) {
		if (field.tag === tag) {
			if (Array.isArray(field.value) && typeof field.value[0] === 'number') {
				return field.value[0];
			}
		}
	}
	return null;
}

/**
 * @param {DataView<ArrayBuffer>} data
 * @param {number} p
 * @param {number} chainLimit
 * @param {number} recurLimit
 * @param {boolean} littleEndian
 * @param {string[]} warnings
 */
function readEXIFPart(data, p, chainLimit, recurLimit, littleEndian, warnings) {
	/** @type {TIFFImage[]} */
	const tiffImages = [];

	while (true) {
		if (p & 1) {
			warnings.push(`EXIF: TIFF IFD offset is not on a word boundary: ${p}`);
		}
		if (p < 8) {
			warnings.push(`EXIF: TIFF IFD offset overlaps file header: ${p}`);
		}
		if (data.byteLength < p + 2) {
			warnings.push('EXIF: truncated IFD structure');
			break;
		}
		const fieldCount = data.getUint16(p, littleEndian);
		if (data.byteLength < p + 2 + fieldCount * 12) {
			warnings.push('EXIF: truncated IFD structure');
			break;
		}
		/** @type {{ tag: number, type: number, value: unknown }[]} */
		const fields = [];
		p += 2;
		for (let n = 0; n < fieldCount; ++n) {
			const tag = data.getUint16(p, littleEndian);
			const type = data.getUint16(p + 2, littleEndian);
			const typeInfo = TYPE_INFO.get(type);
			try {
				if (!typeInfo) {
					warnings.push(`EXIF: TIFF field ${tag.toString(16)}.H has unknown type: ${typeInfo} - skipping`);
					fields.push({ tag, type, value: null });
				} else {
					const count = data.getUint32(p + 4, littleEndian);
					const pos = typeInfo.size * count <= 4
						? p + 8
						: data.getUint32(p + 8, littleEndian);
					if (pos & 1) {
						warnings.push(`EXIF: TIFF field ${tag.toString(16)}.H offset is not on a word boundary: ${pos}`);
					}
					let value = typeInfo.parse(
						subViewLen(data, pos, typeInfo.size * count, warnings),
						count,
						littleEndian,
						warnings,
					);
					const tagInfo = TAGS.get(tag);
					if (tagInfo?.multicode) {
						if (type !== 7) {
							warnings.push(`EXIF: TIFF field ${tag.toString(16)}.H expected binary data`);
							value = null;
						} else {
							value = readMulticode(/** @type {DataView<ArrayBuffer>} */ (value), warnings);
						}
					} else if (tagInfo?.recurse) {
						if (recurLimit <= 0) {
							warnings.push(`EXIF: TIFF field ${tag.toString(16)}.H too much recursion; skipping`);
							value = [];
						} else if (!Array.isArray(value) || typeof value[0] !== 'number') {
							warnings.push(`EXIF: TIFF field ${tag.toString(16)}.H cannot recur; not a pointer`);
							value = [];
						} else {
							value = readEXIFPart(data, value[0], 1, recurLimit - 1, littleEndian, warnings);
						}
					}
					fields.push({ tag, type, value });
				}
			} catch (e) {
				warnings.push(`EXIF: Error reading TIFF field ${tag.toString(16)}.H: ${e}`);
			}
			p += 12;
		}
		tiffImages.push({ fields });

		if (data.byteLength < p + 4) {
			warnings.push('EXIF: TIFF structure does not end with null IFD offset');
			break;
		}
		p = data.getUint32(p, littleEndian);
		if (!p) {
			break;
		}
		// TIFF format allows an infinite loop when reading images, so limit the image count
		if (tiffImages.length >= chainLimit) {
			warnings.push(`EXIF: Too many TIFF IFDs; skipping`);
			break;
		}
	}

	return tiffImages;
}

/**
 * @param {DataView<ArrayBuffer>} data
 * @param {string[]} warnings
 */
function readMulticode(data, warnings) {
	if (data.byteLength < 8) {
		warnings.push('EXIF: multicode string does not contain encoding identifier');
		return '';
	}
	const enc = getLatin1(data, 0, 8, warnings);
	switch (enc) {
		case 'ASCII\x00\x00\x00':
			return getLatin1(data, 8, data.byteLength, warnings);
		case 'JIS\x00\x00\x00\x00\x00':
			return getJIS(data, 8, data.byteLength, warnings);
		case 'UNICODE\x00':
			return getUTF8(data, 8, data.byteLength, warnings);
		case '\x00\x00\x00\x00\x00\x00\x00\x00':
			warnings.push('EXIF: multicode with null encoding identifier; guessing UTF-8 / ASCII');
			return getUTF8(data, 8, data.byteLength, warnings);
		default:
			warnings.push(`EXIF: multicode with unknown encoding identifier: ${JSON.stringify(enc)}`);
			return '';
	}
}

/** @type {Map<number, { name: string, recurse?: boolean, multicode?: boolean, print: (data: any, type: number, indent: string) => unknown }>} */
const TAGS = new Map([
	[0x0103, { name: 'Compression', print: (value) => value[0] === 0x8005 ? 'PackBits' : [
		null,
		'Uncompressed',
		'CCITT Group 3 1-Dimensional Modified Huffman run length encoding',
		null,
		null,
		null,
		'JPEG',
	][value[0]] ?? `unknown (${value[0]})` }],
	[0x0112, { name: 'Orientation', print: (value) => [
		null,
		'x = left to right, y = top to bottom (normal)',
		'x = right to left, y = top to bottom',
		'x = right to left, y = bottom to top',
		'x = left to right, y = bottom to top',
		'x = top to bottom, y = left to right',
		'x = top to bottom, y = right to left',
		'x = bottom to top, y = right to left',
		'x = bottom to top, y = left to right',
	][value[0]] ?? `unknown (${value[0]})` }],
	[0x011A, { name: 'X Resolution', print: (value) => value[0] }],
	[0x011B, { name: 'Y Resolution', print: (value) => value[0] }],
	[0x0128, { name: 'Resolution Unit', print: (value) => [null, 'none', 'inch', 'cm'][value[0]] ?? `unknown (${value[0]})` }],
	[0x0201, { name: 'JPEG Interchange Format Offset', print: (value) => value[0] }],
	[0x0202, { name: 'JPEG Interchange Format Byte Length', print: (value) => value[0] }],
	[0x0213, { name: 'YCbCr Positioning', print: (value) => [
		null,
		'centred',
		'co-sited',
	][value[0]] ?? `unknown (${value[0]})` }],
	[0x8298, { name: 'Copyright', print: (value) => value }],
	[0x8769, { name: 'EXIF IFD', recurse: true, print: (value, _, indent) => '\n' + printTIFFMeta(value[0], indent + '	') }],
	[0xA002, { name: 'X Dimension', print: (value) => value[0] }],
	[0xA003, { name: 'Y Dimension', print: (value) => value[0] }],
	[0x9000, { name: 'EXIF Version', print: (value) => getLatin1(value) }],
	[0x9101, { name: 'Components Configuration', print: (value) => {
		const r = [];
		for (let i = 0; i < value.byteLength; ++i) {
			const v = value.getUint8(i);
			r.push(['-', 'Y', 'Cb', 'Cr', 'R', 'G', 'B'][v] ?? `unknown (${v})`);
		}
		return r.join(', ');
	}}],
	[0x9286, { name: 'User Comment', multicode: true, print: (value) => value }],
	[0xA000, { name: 'Flashpix Version', print: (value) => getLatin1(value) }],
	[0xA001, { name: 'Colour Space', print: (value) => value[0] === 1 ? 'sRGB' : value[0] === 0xFFFF ? 'Uncalibrated' : `unknown (${value[0]})` }],
]);

/** @type {Map<number, { size: number, parse: (data: DataView<ArrayBuffer>, count: number, littleEndian: boolean, warnings: string[]) => unknown }>} */
const TYPE_INFO = new Map([
	[1, { size: 1, parse: (data, count) => { // uint8
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(data.getUint8(i));
		}
		return r;
	} }],
	[2, { size: 1, parse: (data, count, _littleEndian, warnings) => { // ascii (null-terminated)
		if (data.getUint8(count - 1) !== 0) {
			warnings.push(`eXIf: ASCII TIFF field does not end with null character`);
			return getLatin1(data);
		} else {
			return getLatin1(data, 0, count - 1, warnings);
		}
	} }],
	[3, { size: 2, parse: (data, count, littleEndian) => { // uint16
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(data.getUint16(i * 2, littleEndian));
		}
		return r;
	} }],
	[4, { size: 4, parse: (data, count, littleEndian) => { // uint32
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(data.getUint32(i * 4, littleEndian));
		}
		return r;
	} }],
	[5, { size: 8, parse: (data, count, littleEndian) => { // rational (uint32, uint32)
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(new Rational(
				data.getUint32(i * 8, littleEndian),
				data.getUint32(i * 8 + 4, littleEndian),
			));
		}
		return r;
	} }],
	[6, { size: 1, parse: (data, count) => { // int8
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(data.getInt8(i));
		}
		return r;
	} }],
	[7, { size: 1, parse: (data) => data }], // arbitrary byte
	[8, { size: 2, parse: (data, count, littleEndian) => { // int16
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(data.getInt16(i * 2, littleEndian));
		}
		return r;
	} }],
	[9, { size: 4, parse: (data, count, littleEndian) => { // int32
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(data.getInt32(i * 4, littleEndian));
		}
		return r;
	} }],
	[10, { size: 8, parse: (data, count, littleEndian) => { // signed rational (int32, int32)
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(new Rational(
				data.getInt32(i * 8, littleEndian),
				data.getInt32(i * 8 + 4, littleEndian),
			));
		}
		return r;
	} }],
	[11, { size: 4, parse: (data, count, littleEndian) => { // float32
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(data.getFloat32(i * 4, littleEndian));
		}
		return r;
	} }],
	[12, { size: 8, parse: (data, count, littleEndian) => { // float64
		const r = [];
		for (let i = 0; i < count; ++i) {
			r.push(data.getFloat64(i * 4, littleEndian));
		}
		return r;
	} }],
	[129, { size: 1, parse: (data, count, _littleEndian, warnings) => { // utf-8 (null-terminated)
		if (data.getUint8(count - 1) !== 0) {
			warnings.push(`eXIf: UTF-8 TIFF field does not end with null character`);
			return getUTF8(data);
		} else {
			return getUTF8(data, 0, count - 1, warnings);
		}
	} }],
]);

class Rational {
	/**
	 * @param {number} num
	 * @param {number} den
	 */
	constructor(num, den) {
		this.num = num;
		this.den = den;
	}

	valueOf() {
		return this.num / this.den;
	}

	toString() {
		return `${this.num} / ${this.den}`;
	}
}
