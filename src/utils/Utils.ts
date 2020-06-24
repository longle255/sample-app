import { Types } from 'mongoose';
export function sleep(ms: number = 0): Promise<void> {
  return new Promise<void>(r => setTimeout(r, ms));
}

/**
 * Convert ObjectId field values inside an object to String type values
 * (includes array of ObjectIds and nested ObjectId fields)
 * @param obj Object - The Object to be converted.
 * @return none
 */
export function objectIdToString(obj: any): any {
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      const v = obj[k];
      if (typeof v === 'object') {
        if (v instanceof Types.ObjectId) {
          obj[k] = v.toString();
        } else if (Array.isArray(v) && v.length > 0 && v[0] instanceof Types.ObjectId) {
          const vs = [];
          for (const iv of v) {
            vs.push(iv.toString());
          }
          obj[k] = vs;
        } else {
          objectIdToString(v);
        }
      }
    }
  }
  return obj;
}
