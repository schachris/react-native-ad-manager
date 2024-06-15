export * from "./adState.string";
export * from "./validate";
import { isUndefined } from "./validate";

export function hasOwnProperty(target: unknown, property: PropertyKey) {
  return Object.hasOwnProperty.call(target, property);
}

export function isPropertySet(target: unknown, property: PropertyKey) {
  return (
    hasOwnProperty(target, property) &&
    !isUndefined((target as Record<PropertyKey, unknown>)[property])
  );
}
