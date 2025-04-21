export const isObjEmpty = (obj: any) => {
  if (typeof obj !== "object") return true;
  if (obj === null) return true;
  if (obj.constructor !== Object) return true;
  return Object.keys(obj).length === 0;
};
