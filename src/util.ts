export function getKeys<T>(obj:T){
	return Object.keys(obj) as (keyof T)[];
}