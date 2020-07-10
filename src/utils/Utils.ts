import axios from 'axios';
import { Types } from 'mongoose';

export function sleep(ms = 0): Promise<void> {
	return new Promise<void>((r) => setTimeout(r, ms));
}

/**
 * Convert ObjectId field values inside an object to String type values
 * (includes array of ObjectIds and nested ObjectId fields)
 * @param obj Object - The Object to be converted.
 * @return none
 */
export function objectIdToString(obj: any): any {
	for (const k in obj) {
		// eslint-disable-next-line no-prototype-builtins
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

// for filling the missing timeout when host is not reachable
export function axiosGet(url: string, options: any = {}): any {
	const abort = axios.CancelToken.source();
	const id = setTimeout(() => abort.cancel(`Timeout of ${1000}ms.`), 3000);
	return axios
		.get(url, { cancelToken: abort.token, ...options })
		.then((response) => {
			clearTimeout(id);
			return response;
		})
		.catch((err) => {
			throw err;
		});
}
