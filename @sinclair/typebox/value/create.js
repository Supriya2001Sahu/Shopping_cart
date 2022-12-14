"use strict";
/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueCreate = exports.ValueCreateInvalidTypeError = void 0;
const index_1 = require("../guard/index");
class ValueCreateInvalidTypeError extends Error {
    constructor(schema) {
        super('ValueCreate: Invalid type');
        this.schema = schema;
    }
}
exports.ValueCreateInvalidTypeError = ValueCreateInvalidTypeError;
var ValueCreate;
(function (ValueCreate) {
    function Any(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            return {};
        }
    }
    function Array(schema, references) {
        if (schema.uniqueItems === true && schema.default === undefined) {
            throw new Error('ValueCreate.Array: Arrays with uniqueItems require a default value');
        }
        else if (schema.default !== undefined) {
            return schema.default;
        }
        else if (schema.minItems !== undefined) {
            return globalThis.Array.from({ length: schema.minItems }).map((item) => {
                return ValueCreate.Create(schema.items, references);
            });
        }
        else {
            return [];
        }
    }
    function Boolean(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            return false;
        }
    }
    function Constructor(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            const value = ValueCreate.Create(schema.returns, references);
            if (typeof value === 'object' && !globalThis.Array.isArray(value)) {
                return class {
                    constructor() {
                        for (const [key, val] of globalThis.Object.entries(value)) {
                            const self = this;
                            self[key] = val;
                        }
                    }
                };
            }
            else {
                return class {
                };
            }
        }
    }
    function Enum(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else if (schema.anyOf.length === 0) {
            throw new Error('ValueCreate.Enum: Cannot create default enum value as this enum has no items');
        }
        else {
            return schema.anyOf[0].const;
        }
    }
    function Function(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            return () => ValueCreate.Create(schema.returns, references);
        }
    }
    function Integer(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else if (schema.minimum !== undefined) {
            return schema.minimum;
        }
        else {
            return 0;
        }
    }
    function Literal(schema, references) {
        return schema.const;
    }
    function Null(schema, references) {
        return null;
    }
    function Number(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else if (schema.minimum !== undefined) {
            return schema.minimum;
        }
        else {
            return 0;
        }
    }
    function Object(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            const required = new Set(schema.required);
            return (schema.default ||
                globalThis.Object.entries(schema.properties).reduce((acc, [key, schema]) => {
                    return required.has(key) ? { ...acc, [key]: ValueCreate.Create(schema, references) } : { ...acc };
                }, {}));
        }
    }
    function Promise(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            return globalThis.Promise.resolve(ValueCreate.Create(schema.item, references));
        }
    }
    function Record(schema, references) {
        const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0];
        if (schema.default !== undefined) {
            return schema.default;
        }
        else if (!(keyPattern === '^.*$' || keyPattern === '^(0|[1-9][0-9]*)$')) {
            const propertyKeys = keyPattern.slice(1, keyPattern.length - 1).split('|');
            return propertyKeys.reduce((acc, key) => {
                return { ...acc, [key]: Create(valueSchema, references) };
            }, {});
        }
        else {
            return {};
        }
    }
    function Recursive(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            throw new Error('ValueCreate.Recursive: Recursive types require a default value');
        }
    }
    function Ref(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            const reference = references.find((reference) => reference.$id === schema.$ref);
            if (reference === undefined)
                throw new Error(`ValueCreate.Ref: Cannot find schema with $id '${schema.$ref}'.`);
            return Visit(reference, references);
        }
    }
    function Self(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            const reference = references.find((reference) => reference.$id === schema.$ref);
            if (reference === undefined)
                throw new Error(`ValueCreate.Self: Cannot locate schema with $id '${schema.$ref}'`);
            return Visit(reference, references);
        }
    }
    function String(schema, references) {
        if (schema.pattern !== undefined) {
            if (schema.default === undefined) {
                throw new Error('ValueCreate.String: String types with patterns must specify a default value');
            }
            else {
                return schema.default;
            }
        }
        else {
            if (schema.default !== undefined) {
                return schema.default;
            }
            else if (schema.minLength !== undefined) {
                return globalThis.Array.from({ length: schema.minLength })
                    .map(() => '.')
                    .join('');
            }
            else {
                return '';
            }
        }
    }
    function Tuple(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        if (schema.items === undefined) {
            return [];
        }
        else {
            return globalThis.Array.from({ length: schema.minItems }).map((_, index) => ValueCreate.Create(schema.items[index], references));
        }
    }
    function Undefined(schema, references) {
        return undefined;
    }
    function Union(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else if (schema.anyOf.length === 0) {
            throw new Error('ValueCreate.Union: Cannot create Union with zero variants');
        }
        else {
            return ValueCreate.Create(schema.anyOf[0], references);
        }
    }
    function Uint8Array(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else if (schema.minByteLength !== undefined) {
            return new globalThis.Uint8Array(schema.minByteLength);
        }
        else {
            return new globalThis.Uint8Array(0);
        }
    }
    function Unknown(schema, references) {
        if (schema.default !== undefined) {
            return schema.default;
        }
        else {
            return {};
        }
    }
    function Void(schema, references) {
        return null;
    }
    /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
    function Visit(schema, references) {
        const refs = schema.$id === undefined ? references : [schema, ...references];
        if (index_1.TypeGuard.TAny(schema)) {
            return Any(schema, refs);
        }
        else if (index_1.TypeGuard.TArray(schema)) {
            return Array(schema, refs);
        }
        else if (index_1.TypeGuard.TBoolean(schema)) {
            return Boolean(schema, refs);
        }
        else if (index_1.TypeGuard.TConstructor(schema)) {
            return Constructor(schema, refs);
        }
        else if (index_1.TypeGuard.TFunction(schema)) {
            return Function(schema, refs);
        }
        else if (index_1.TypeGuard.TInteger(schema)) {
            return Integer(schema, refs);
        }
        else if (index_1.TypeGuard.TLiteral(schema)) {
            return Literal(schema, refs);
        }
        else if (index_1.TypeGuard.TNull(schema)) {
            return Null(schema, refs);
        }
        else if (index_1.TypeGuard.TNumber(schema)) {
            return Number(schema, refs);
        }
        else if (index_1.TypeGuard.TObject(schema)) {
            return Object(schema, refs);
        }
        else if (index_1.TypeGuard.TPromise(schema)) {
            return Promise(schema, refs);
        }
        else if (index_1.TypeGuard.TRecord(schema)) {
            return Record(schema, refs);
        }
        else if (index_1.TypeGuard.TRef(schema)) {
            return Ref(schema, refs);
        }
        else if (index_1.TypeGuard.TSelf(schema)) {
            return Self(schema, refs);
        }
        else if (index_1.TypeGuard.TString(schema)) {
            return String(schema, refs);
        }
        else if (index_1.TypeGuard.TTuple(schema)) {
            return Tuple(schema, refs);
        }
        else if (index_1.TypeGuard.TUndefined(schema)) {
            return Undefined(schema, refs);
        }
        else if (index_1.TypeGuard.TUnion(schema)) {
            return Union(schema, refs);
        }
        else if (index_1.TypeGuard.TUint8Array(schema)) {
            return Uint8Array(schema, refs);
        }
        else if (index_1.TypeGuard.TUnknown(schema)) {
            return Unknown(schema, refs);
        }
        else if (index_1.TypeGuard.TVoid(schema)) {
            return Void(schema, refs);
        }
        else {
            throw new ValueCreateInvalidTypeError(schema);
        }
    }
    ValueCreate.Visit = Visit;
    function Create(schema, references) {
        return Visit(schema, references);
    }
    ValueCreate.Create = Create;
})(ValueCreate = exports.ValueCreate || (exports.ValueCreate = {}));
