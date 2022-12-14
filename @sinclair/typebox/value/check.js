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
exports.ValueCheck = exports.ValueCheckInvalidTypeError = void 0;
const index_1 = require("../guard/index");
class ValueCheckInvalidTypeError extends Error {
    constructor(schema) {
        super('ValueCheck: Invalid type');
        this.schema = schema;
    }
}
exports.ValueCheckInvalidTypeError = ValueCheckInvalidTypeError;
var ValueCheck;
(function (ValueCheck) {
    function Any(schema, references, value) {
        return true;
    }
    function Array(schema, references, value) {
        if (!globalThis.Array.isArray(value)) {
            return false;
        }
        if (schema.minItems !== undefined && !(value.length >= schema.minItems)) {
            return false;
        }
        if (schema.maxItems !== undefined && !(value.length <= schema.maxItems)) {
            return false;
        }
        if (schema.uniqueItems === true && !(new Set(value).size === value.length)) {
            return false;
        }
        return value.every((val) => Visit(schema.items, references, val));
    }
    function Boolean(schema, references, value) {
        return typeof value === 'boolean';
    }
    function Constructor(schema, references, value) {
        return Visit(schema.returns, references, value.prototype);
    }
    function Function(schema, references, value) {
        return typeof value === 'function';
    }
    function Integer(schema, references, value) {
        if (!(typeof value === 'number')) {
            return false;
        }
        if (!globalThis.Number.isInteger(value)) {
            return false;
        }
        if (schema.multipleOf !== undefined && !(value % schema.multipleOf === 0)) {
            return false;
        }
        if (schema.exclusiveMinimum !== undefined && !(value > schema.exclusiveMinimum)) {
            return false;
        }
        if (schema.exclusiveMaximum !== undefined && !(value < schema.exclusiveMaximum)) {
            return false;
        }
        if (schema.minimum !== undefined && !(value >= schema.minimum)) {
            return false;
        }
        if (schema.maximum !== undefined && !(value <= schema.maximum)) {
            return false;
        }
        return true;
    }
    function Literal(schema, references, value) {
        return value === schema.const;
    }
    function Null(schema, references, value) {
        return value === null;
    }
    function Number(schema, references, value) {
        if (!(typeof value === 'number')) {
            return false;
        }
        if (schema.multipleOf && !(value % schema.multipleOf === 0)) {
            return false;
        }
        if (schema.exclusiveMinimum && !(value > schema.exclusiveMinimum)) {
            return false;
        }
        if (schema.exclusiveMaximum && !(value < schema.exclusiveMaximum)) {
            return false;
        }
        if (schema.minimum && !(value >= schema.minimum)) {
            return false;
        }
        if (schema.maximum && !(value <= schema.maximum)) {
            return false;
        }
        return true;
    }
    function Object(schema, references, value) {
        if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
            return false;
        }
        if (schema.minProperties !== undefined && !(globalThis.Object.keys(value).length >= schema.minProperties)) {
            return false;
        }
        if (schema.maxProperties !== undefined && !(globalThis.Object.keys(value).length <= schema.maxProperties)) {
            return false;
        }
        const propertyKeys = globalThis.Object.keys(schema.properties);
        if (schema.additionalProperties === false) {
            // optimization: If the property key length matches the required keys length
            // then we only need check that the values property key length matches that
            // of the property key length. This is because exhaustive testing for values
            // will occur in subsequent property tests.
            if (schema.required && schema.required.length === propertyKeys.length && !(globalThis.Object.keys(value).length === propertyKeys.length)) {
                return false;
            }
            else {
                if (!globalThis.Object.keys(value).every((key) => propertyKeys.includes(key))) {
                    return false;
                }
            }
        }
        for (const propertyKey of propertyKeys) {
            const propertySchema = schema.properties[propertyKey];
            if (schema.required && schema.required.includes(propertyKey)) {
                if (!Visit(propertySchema, references, value[propertyKey])) {
                    return false;
                }
            }
            else {
                if (value[propertyKey] !== undefined) {
                    if (!Visit(propertySchema, references, value[propertyKey])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    function Promise(schema, references, value) {
        return typeof value === 'object' && typeof value.then === 'function';
    }
    function Record(schema, references, value) {
        if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
            return false;
        }
        const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0];
        const regex = new RegExp(keyPattern);
        if (!globalThis.Object.keys(value).every((key) => regex.test(key))) {
            return false;
        }
        for (const propValue of globalThis.Object.values(value)) {
            if (!Visit(valueSchema, references, propValue))
                return false;
        }
        return true;
    }
    function Ref(schema, references, value) {
        const reference = references.find((reference) => reference.$id === schema.$ref);
        if (reference === undefined)
            throw new Error(`ValueCheck.Ref: Cannot find schema with $id '${schema.$ref}'.`);
        return Visit(reference, references, value);
    }
    function Self(schema, references, value) {
        const reference = references.find((reference) => reference.$id === schema.$ref);
        if (reference === undefined)
            throw new Error(`ValueCheck.Self: Cannot find schema with $id '${schema.$ref}'.`);
        return Visit(reference, references, value);
    }
    function String(schema, references, value) {
        if (!(typeof value === 'string')) {
            return false;
        }
        if (schema.minLength !== undefined) {
            if (!(value.length >= schema.minLength))
                return false;
        }
        if (schema.maxLength !== undefined) {
            if (!(value.length <= schema.maxLength))
                return false;
        }
        if (schema.pattern !== undefined) {
            const regex = new RegExp(schema.pattern);
            if (!regex.test(value))
                return false;
        }
        return true;
    }
    function Tuple(schema, references, value) {
        if (!globalThis.Array.isArray(value)) {
            return false;
        }
        if (schema.items === undefined && !(value.length === 0)) {
            return false;
        }
        if (!(value.length === schema.maxItems)) {
            return false;
        }
        if (!schema.items) {
            return true;
        }
        for (let i = 0; i < schema.items.length; i++) {
            if (!Visit(schema.items[i], references, value[i]))
                return false;
        }
        return true;
    }
    function Undefined(schema, references, value) {
        return value === undefined;
    }
    function Union(schema, references, value) {
        return schema.anyOf.some((inner) => Visit(inner, references, value));
    }
    function Uint8Array(schema, references, value) {
        if (!(value instanceof globalThis.Uint8Array)) {
            return false;
        }
        if (schema.maxByteLength && !(value.length <= schema.maxByteLength)) {
            return false;
        }
        if (schema.minByteLength && !(value.length >= schema.minByteLength)) {
            return false;
        }
        return true;
    }
    function Unknown(schema, references, value) {
        return true;
    }
    function Void(schema, references, value) {
        return value === null;
    }
    function Visit(schema, references, value) {
        const refs = schema.$id === undefined ? references : [schema, ...references];
        if (index_1.TypeGuard.TAny(schema)) {
            return Any(schema, refs, value);
        }
        else if (index_1.TypeGuard.TArray(schema)) {
            return Array(schema, refs, value);
        }
        else if (index_1.TypeGuard.TBoolean(schema)) {
            return Boolean(schema, refs, value);
        }
        else if (index_1.TypeGuard.TConstructor(schema)) {
            return Constructor(schema, refs, value);
        }
        else if (index_1.TypeGuard.TFunction(schema)) {
            return Function(schema, refs, value);
        }
        else if (index_1.TypeGuard.TInteger(schema)) {
            return Integer(schema, refs, value);
        }
        else if (index_1.TypeGuard.TLiteral(schema)) {
            return Literal(schema, refs, value);
        }
        else if (index_1.TypeGuard.TNull(schema)) {
            return Null(schema, refs, value);
        }
        else if (index_1.TypeGuard.TNumber(schema)) {
            return Number(schema, refs, value);
        }
        else if (index_1.TypeGuard.TObject(schema)) {
            return Object(schema, refs, value);
        }
        else if (index_1.TypeGuard.TPromise(schema)) {
            return Promise(schema, refs, value);
        }
        else if (index_1.TypeGuard.TRecord(schema)) {
            return Record(schema, refs, value);
        }
        else if (index_1.TypeGuard.TRef(schema)) {
            return Ref(schema, refs, value);
        }
        else if (index_1.TypeGuard.TSelf(schema)) {
            return Self(schema, refs, value);
        }
        else if (index_1.TypeGuard.TString(schema)) {
            return String(schema, refs, value);
        }
        else if (index_1.TypeGuard.TTuple(schema)) {
            return Tuple(schema, refs, value);
        }
        else if (index_1.TypeGuard.TUndefined(schema)) {
            return Undefined(schema, refs, value);
        }
        else if (index_1.TypeGuard.TUnion(schema)) {
            return Union(schema, refs, value);
        }
        else if (index_1.TypeGuard.TUint8Array(schema)) {
            return Uint8Array(schema, refs, value);
        }
        else if (index_1.TypeGuard.TUnknown(schema)) {
            return Unknown(schema, refs, value);
        }
        else if (index_1.TypeGuard.TVoid(schema)) {
            return Void(schema, refs, value);
        }
        else {
            throw new ValueCheckInvalidTypeError(schema);
        }
    }
    // -------------------------------------------------------------------------
    // Check
    // -------------------------------------------------------------------------
    function Check(schema, references, value) {
        return schema.$id === undefined ? Visit(schema, references, value) : Visit(schema, [schema, ...references], value);
    }
    ValueCheck.Check = Check;
})(ValueCheck = exports.ValueCheck || (exports.ValueCheck = {}));
