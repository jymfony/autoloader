/**
 * @type {WeakMap<object, Map<*, Map<*, *>>>}
 */
const storage = new WeakMap();
const classSymbol = Symbol('class');

/**
 * Gets (or creates) the storage map for the given target/prop.
 *
 * @param {Function} target
 * @param {null|string|symbol} prop
 * @param {boolean} [create = false]
 *
 * @returns {Map<*, *>}
 */
const getStorage = (target, prop, create = false) => {
    if (! storage.has(target)) {
        storage.set(target, new Map());
    }

    if (! prop) {
        prop = classSymbol;
    }

    const objStorage = storage.get(target);
    if (! objStorage.has(prop) && create) {
        objStorage.set(prop, new Map());
    }

    return objStorage.get(prop);
};

class MetadataStorage {
    /**
     * Adds a metadata value for the given key.
     * This allows to use the same annotation multiple time on
     * the same target.
     *
     * @param {*} key
     * @param {*} value
     * @param {Function} target
     */
    static addMetadata(key, value, target) {
        const storage = getStorage(target, null, true);
        const currentValue = storage.get(key);

        if (undefined === currentValue) {
            storage.set(key, [ value ]);
        } else {
            storage.set(key, [ ...currentValue, value ]);
        }
    }

    /**
     * Defines a metadata.
     *
     * @param {*} key
     * @param {*} value
     * @param {Function} target
     */
    static defineMetadata(key, value, target) {
        const storage = getStorage(target, null, true);
        storage.set(key, [ value ]);
    }

    /**
     * Retrieves metadata for target.
     *
     * @param {Function} target
     */
    static getMetadata(target) {
        const storage = getStorage(target, null);
        if (! storage) {
            return [];
        }

        return [ ...storage.entries() ].map(
            ([ key, value ]) => 1 === value.length ? [ key, value[0] ] : [ key, value ]
        );
    }
}

module.exports = globalThis.MetadataStorage = MetadataStorage;
