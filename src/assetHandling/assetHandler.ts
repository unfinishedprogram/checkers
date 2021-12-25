export default abstract class AssetHandler<T> {
	cache : { [index:string]:Promise<T> } = {};
	loaded: { [index:string]:T } = {};

	constructor(private loaderFunction: (path:string) => Promise<T>){};

	async loadAsset(path:string, name:string):Promise<T> {
		const loading = this.loaderFunction(path);

		if(!this.cache[name]) this.cache[name] = loading;
		
		loading.then((data) => {
			this.loaded[name] = data;
		})

		return await this.cache[name];
	}

	getAsset(name:string):T {
		if(!this.loaded[name]) console.error(`Could not find asset: ${name}`);
		return this.loaded[name];
	}
}