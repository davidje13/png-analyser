/** @typedef {import('../../tokeniser.mjs').NodeToken} NodeToken */

/** @typedef {`${string}${'s' | 'i' | 'f' | 'b' | 'v'}`} NodeID */

/**
 * @template {NodeID} T
 * @typedef {(
 *   T extends `${string}s` ? string :
 *   T extends (`${string}i` | `${string}f`) ? number :
 *   T extends `${string}b` ? boolean :
 *   NodeToken[]
 * )} ValueType
 */

/**
 * @template {any[]} Args
 * @template {unknown} T
 * @typedef {{ new(...args: Args): T }} Class
 */

export class MapNode {
	/** @type {{ [k in string]?: NodeToken | NodeToken[] | undefined }} */ #keyed = {};

	/** @param {ReadonlyArray<NodeToken>} value */
	constructor(value) {
		for (const sub of value) {
			let bucket = this.#keyed[sub.id];
			if (!bucket) {
				this.#keyed[sub.id] = sub;
			} else if (Array.isArray(bucket)) {
				bucket.push(sub);
			} else {
				this.#keyed[sub.id] = [bucket, sub];
			}
		}
	}

	/** @param {NodeID} key */
	getChildNodePath(key) {
		let v = this.#keyed[key];
		if (Array.isArray(v)) {
			v = v[0];
		}
		return v?.path;
	}

	getNodePath() {
		// TODO: ideally the node would know its own path
		// rather than figuring it out from a child
		for (const k in this.#keyed) {
			return this.getChildNodePath(/** @type {NodeID} */ (k))?.replace(/\.[^.]*$/, '');
		}
		return undefined;
	}

	/**
	 * @template {NodeID} K
	 * @template {unknown} T
	 * @overload
	 * @param {K} key
	 * @param {null | undefined=} cls
	 * @return {ReadonlyArray<ValueType<K>>}
	 */

	/**
	 * @template {NodeID} K
	 * @template {unknown} T
	 * @overload
	 * @param {K} key
	 * @param {Class<[ValueType<K>], T>} cls
	 * @return {ReadonlyArray<readonly T>}
	 */

	/**
	 * @protected
	 * @param {NodeID} key
	 * @param {Class<[any], unknown> | null | undefined=} cls
	 * @return {ReadonlyArray<unknown>}
	 */
	zeroOrMore(key, cls) {
		const v = this.#keyed[key];
		if (!v) {
			return [];
		}
		if (Array.isArray(v)) {
			return cls ? v.map((o) => new cls(o.value)) : v.map((o) => o.value);
		}
		return [cls ? new cls(v.value) : v.value];
	}

	/**
	 * @template {NodeID} K
	 * @overload
	 * @param {K} key
	 * @param {null | undefined=} cls
	 * @return {ReadonlyArray<ValueType<K>> & [ValueType<K>]}
	 */

	/**
	 * @template {NodeID} K
	 * @template {unknown} T
	 * @overload
	 * @param {K} key
	 * @param {Class<[ValueType<K>], T>} cls
	 * @return {ReadonlyArray<readonly T> & [readonly T]}
	 */

	/**
	 * @protected
	 * @param {NodeID} key
	 * @param {Class<[any], unknown> | null | undefined=} cls
	 * @return {ReadonlyArray<unknown>}
	 */
	oneOrMore(key, cls) {
		const v = this.#keyed[key];
		if (!v) {
			throw new Error(`${this.constructor.name}: expected at least one ${key}`);
		}
		if (Array.isArray(v)) {
			return cls ? v.map((o) => new cls(o.value)) : v.map((o) => o.value);
		}
		return [cls ? new cls(v.value) : v.value];
	}

	/**
	 * @template {NodeID} K
	 * @overload
	 * @param {K} key
	 * @param {null | undefined=} cls
	 * @return {ValueType<K> | undefined}
	 */

	/**
	 * @template {NodeID} K
	 * @template {unknown} T
	 * @overload
	 * @param {K} key
	 * @param {Class<[ValueType<K>], T>} cls
	 * @return {T | undefined}
	 */

	/**
	 * @protected
	 * @param {NodeID} key
	 * @param {Class<[any], unknown> | null | undefined=} cls
	 * @return {unknown | undefined}
	 */
	optional(key, cls) {
		const v = this.#keyed[key];
		if (!v) {
			return undefined;
		}
		if (Array.isArray(v)) {
			console.warn(`${this.constructor.name}: multiple values for ${key}`);
			return cls ? new cls(v[0].value) : v[0].value;
		}
		return cls ? new cls(v.value) : v.value;
	}

	/**
	 * @template {NodeID} K
	 * @overload
	 * @param {K} key
	 * @param {null | undefined=} cls
	 * @return {ValueType<K>}
	 */

	/**
	 * @template {NodeID} K
	 * @template {unknown} T
	 * @overload
	 * @param {K} key
	 * @param {Class<[ValueType<K>], T>} cls
	 * @return {T}
	 */

	/**
	 * @protected
	 * @param {NodeID} key
	 * @param {Class<[any], unknown> | null | undefined=} cls
	 * @return {unknown}
	 */
	required(key, cls) {
		const v = this.#keyed[key];
		if (!v) {
			throw new Error(`${this.constructor.name}: missing required property ${key}`);
		}
		if (Array.isArray(v)) {
			console.warn(`${this.constructor.name}: multiple values for ${key}`);
			return cls ? new cls(v[0].value) : v[0].value;
		}
		return cls ? new cls(v.value) : v.value;
	}
}

/** @typedef {{ counter?: `${string}i`, checkCount?: boolean }} SimpleListOpts */

/**
 * @template {NodeID} K
 * @overload
 * @param {K} key
 * @param {null | undefined=} cls
 * @param {SimpleListOpts=} options
 * @return {Class<[ReadonlyArray<NodeToken>], ReadonlyArray<ValueType<K>>>}
 */

/**
 * @template {NodeID} K
 * @template {unknown} T
 * @overload
 * @param {K} key
 * @param {Class<[ValueType<K>], T>} cls
 * @param {SimpleListOpts=} options
 * @return {Class<[ReadonlyArray<NodeToken>], ReadonlyArray<T>>}
 */

/**
 * @param {NodeID} key
 * @param {Class<[any], unknown> | null | undefined=} cls
 * @param {SimpleListOpts=} options
 * @return {Class<[ReadonlyArray<NodeToken>], ReadonlyArray<unknown>>}
 */
export function SimpleList(key, cls, { counter, checkCount = true } = {}) {
	return class extends Array {
		/** @param {ReadonlyArray<NodeToken>} value */
		constructor(value) {
			super();
			/** @type {number | undefined} */ let count;
			for (const sub of value) {
				if (sub.id === key) {
					this.push(cls ? new cls(sub.value) : sub.value);
				} else if (sub.id === counter) {
					if (count !== undefined) {
						console.warn(`${this.constructor.name}: multiple ${sub.id} counters`);
					} else {
						count = sub.value;
					}
				} else {
					console.warn(`${this.constructor.name}: unknown item ${sub.id}`);
				}
			}
			if (count !== undefined && checkCount && count !== this.length) {
				console.warn(`${this.constructor.name}: number of elements (${this.length}) does not match counter ${counter} (${count})`);
			}
			this.constructor = Array; // used by methods like .map
		}
	};
}

/**
 * @template {{ [k in NodeID]: Class<[any], unknown> | null }} T
 * @typedef {{ [k in NodeID & keyof T]: { type: k, value: T[k] extends Class<[any], infer C> ? C : ValueType<k> } }[NodeID & keyof T]} MultiListEntry
 */

/**
 * @template {{ [k in NodeID]: Class<[any], unknown> | null }} T
 * @param {() => T} typesGen
 * @return {Class<[ReadonlyArray<NodeToken>], ReadonlyArray<MultiListEntry<T>>>}
 */
export function MultiList(typesGen) {
	/** @type {T | undefined} */ let types = undefined;

	return /** @type {Class<[ReadonlyArray<NodeToken>], ReadonlyArray<MultiListEntry<T>>>} */ (class {
		/** @param {ReadonlyArray<NodeToken>} value */
		constructor(value) {
			types ??= typesGen();
			/** @type {any[]} */ let items = [];
			for (const sub of value) {
				if (sub.id in types) {
					const cls = types[sub.id];
					items.push({ type: sub.id, value: cls ? new cls(sub.value) : sub.value });
				} else {
					console.warn(`${this.constructor.name}: unknown item ${sub.id}`);
				}
			}
			return items;
		}
	});
}

/**
 * @template {unknown} T
 * @param {ReadonlyArray<readonly [number, T]>} options
 * @return {Class<[number], { raw: number; value: T | undefined }>}
 */
export function Enum(options) {
	const lookup = new Map(options);
	return /** @type {Class<[number], { raw: number; value: T }>} */ (class {
		/** @type {number} */ raw;
		/** @type {T | undefined} */ value;

		/** @param {number} value */
		constructor(value) {
			this.raw = value;
			this.value = lookup.get(value);
		}

		toString() {
			return this.value === undefined ? `<unknown value ${this.raw}>` : `${this.value}`;
		}
	});
}

/** @param {number} v */
export function signedInt(v) {
	return v|0;
}
