import { isBrowser } from "./browserHelperFunction";

export const deserialize = (data: string) => {
  const reviver = function (key: string, value: any) {
    if (
      isBrowser() &&
      typeof value === "object" &&
      value !== null &&
      typeof value.jsonVal !== "undefined" &&
      typeof value.__clsName__ === "string"
    ) {
      const Cls = window[value.__clsName__];
      //@ts-ignore
      if (typeof Cls === "function" && Cls.constructor) {
        //@ts-ignore
        return new Cls(value.jsonVal);
      }
    }
    return value;
  };
  return JSON.parse(data, reviver);
};

/**
 * Abstract base class for creating serializable objects.
 *
 * Any subclass extending `Serializable` must implement a `getValue()` method,
 * which defines how the instance is represented in its primitive or
 * serializable form (e.g., for JSON or structured cloning).
 *
 * The `toJSON()` method automatically:
 *   - Registers the class globally on `window` (in browser environments) so it
 *     can be reconstructed during deserialization.
 *   - Returns a lightweight object with:
 *       { jsonVal: <primitive>, __clsName__: "__ClassName__" }
 *
 * Example:
 * ```ts
 * class ChildClass extends Serializable {
 *   getValue() {
 *     return this.status;
 *   }
 * }
 *
 * const f = new ChildClass("ok");
 * JSON.stringify(f); // { "jsonVal": "ok", "__clsName__": "__ChildClass__" }
 * ```
 *
 * ⚠️ WARNING: To ensure the class is registered automatically for serialization,
 * subclasses should include a static block like this:
 *
 *   static { ChildClass.register(); }
 *
 * Without this static block, the class may not be available globally for
 * deserialization until an instance is created.
 *
 * This pattern ensures consistent serialization and deserialization of
 * user-defined classes across browser contexts.
 */
export class Serializable {
  static register() {
    const name = `__${this.name}__`;
    //@ts-ignore
    if (isBrowser() && window[name] === undefined) {
      // @ts-ignore
      window[name] = this;
    }
  }
  constructor() {
    if (this.getValue === Serializable.prototype.getValue) {
      throw new Error(
        `Class "${
          //@ts-ignore
          this.constructor.name || "<anonymous>"
        }" must implement a method named "getValue()" to be registered for serialization.`
      );
    }
    //@ts-ignore
    this.constructor.register();
  }
  getValue() {
    const name = this.constructor.name;
    throw new Error(
      `Class "${
        //@ts-ignore
        name || "<anonymous>"
      }" must implement a method named "getValue()" to be registered for serialization.`
    );
  }
  toJSON() {
    const name = `__${this.constructor.name}__`;
    return { jsonVal: this.getValue(), __clsName__: name };
  }
}
