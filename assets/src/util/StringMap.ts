module util {
	export class StringMap<V> {
		private OBJECTS: {[key: string]: V;} = {};
		private size: number = 0;
		private NAMES: Array<string> = [];
		private VALUES: Array<V> = [];
		
		
		public put(key: string, value: V): StringMap<V>{
			this.OBJECTS[key] = value;
			this.size++;
			this.NAMES.push(key);
			this.VALUES.push(value);
            
            return this;
		}
		
		public get(key: string): V{
			return this.OBJECTS[key];
		}
		
		public names(): Array<string>{
			return this.NAMES;
		}
		
		public getSize(): number{
			return this.size;
		}
		
		public toArray(){
			return this.VALUES;
		}
		
		public flush(){
			this.NAMES = [];
			this.size = 0;
			this.OBJECTS = {};
			this.VALUES = [];
		}
	}
}