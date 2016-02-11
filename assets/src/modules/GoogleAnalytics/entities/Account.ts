///<reference path="../reference.ts" />
module analytics.entities {
	/**
	 * Instances of class Account represent Google Analytics accounts. 
 	 * Each account has several properties (class:WebProperty) and 
 	 * settings (methods) like creating properties, filters, etc.
 	 *
 	 * @author  André Heller; anheller6@gmail.com
 	 * @version 1.00 — 07/2015
	 */
	export class Account
	{
	//== CLASS ATTRIBUTES ==========================================================
	//== INSTANCE ATTRIBUTES =======================================================
		
		//If account instance was filly filled or its still parcial 
		private _parciality = true;
		
		//Storage for properties
		private _properties: util.StringMap<WebProperty> = new util.StringMap<WebProperty>();
		
		//Created date
		private _created: Date;
		
		//Updated date
		private _updated: Date; 
		
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 
		
		/**
		 * Creates a new Account. Constructor should never be called directly.
		 * Use factory method in AccountManager class instead.
		 * 
		 */
		constructor(
			private _id: string,
			private _name: string,
			webProperties: Array<ParcialWebProperty>,
			private $log
		){
			for(var i: number = 0; i < webProperties.length;i++){
				this.createProperty(webProperties[i]);
			}
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
			
		public get name(): string {
			return this._name;
		}
		
		public get id(): string {
			return this._id;
		}
		
		public get properties(): util.StringMap<WebProperty> {
			return this._properties;
		}
		
		public get created(): Date {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._created;
		}
		
		public get updated(): Date {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._updated;
		}
		
		public get parciality(): boolean{
			return this._parciality;
		}
		
		public set parciality(value: boolean) {
			this._parciality = value;
		}
		
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================		
		
		/**
		 * Complete instance attributes and meka request for all properties
		 */
		public completeAccountInfo(account: FullAccount): void {
			this.created = account.created;
			this.updated = account.updated;
		}
		
		
		/**
		 * Load the rest of instance if its parciality equals true or if optional param force equals true.
		 */
		public completeProperties(force?: boolean): Promises.Promise{ 
			var d = new Promises.Deferred();
			
			this.$log.debug("ACCOUNT: Starting complete properties.\n- Force: " + force + "\n- Parciality: " + this.parciality);
			
			if(force || this.parciality){
				this.$log.debug("ACCOUNT: Account is parcial.");
								
				this.downloadProperties().then(
					 (response) => {
						 
						 this.$log.debug("ACCOUNT: Starting save properties info.");
						 var counter = {value: 0},
						 	 profilesCount = response.result.totalResults;
						 
						 for(var i:number = 0; i < profilesCount; i++){
							 var property: WebProperty = this.properties.get(response.result.items[i].id);
							 
							 this.$log.debug("ACCOUNT: Saving property info: " + i);
							 property.completePropertyInfo(response.result.items[i]);
							 
							 this.$log.debug("ACCOUNT: Requesting property's profiles");
							 property.completeProfiles().then(
								 () => {
									 counter.value++;
									 this.$log.debug("ACCOUNT: Property " + counter.value  + " of " + profilesCount + " completed.");
									 property.parciality = false;
								 },
								 (err) => {
									 this.$log.error(err)
									 d.reject(err);
									 counter.value = 9999;
								 }
							);
						 }
						 
						 this.$log.debug("ACCOUNT: Here should start synchronize phase.");
						 
						 var interval = setInterval(
							(counter) => {
								if(counter.value < profilesCount){
									this.$log.debug("ACCOUNT: Waiting for completing profiles. " + counter.value + " profiles already completed. Remain: " + (profilesCount - counter.value));	 
								}
								else {
									this.$log.debug("ACCOUNT: Fulfill complete properties promise.")
									this.parciality = false;
									clearInterval(interval);
									d.fulfill();
								}
							},
							500,
							counter
						 ); 						 
					 },
					 (err) => {
						 this.$log.error(err);
						 d.reject(err);
					 }
				 );
			}
			else {
				this.$log.error('ACCOUNT: This account is alredy completed.');
				//Aready completed								
				d.reject(Strings.WARN_ACCOUNT_COMPLETE);
			}
			
			this.$log.debug("ACCOUNT: Return complete properties promise.");
			return d.promise();
		}
		
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
	
		/**
		 * Creates a new property and put it into properties stringMap. 
		 */
		private createProperty(property: ParcialWebProperty): void{
			this.properties.put(
				property.id,
				new WebProperty(
					property.id,
					property.name,
					property.internalWebPropertyId,
					property.level,
					this.id,
					property.profiles,
					this.$log
				)
			);
		}
		
		
		/**
		 * Make an API call for list all properties
		 */
		private downloadProperties(): Promises.Promise{
			
			var d = new Promises.Deferred();
			
			this.$log.debug("ACCOUNT: Contact API for property list.");
			
			gapi.client.analytics.management.webproperties.list({'accountId': this.id}).then(
				(response) => {
					this.$log.debug("ACCOUNT: Fullfill property list promise.");
					d.fulfill(response);
				},
				(response) => {
					this.$log.error("ACCOUNT: Reject property list promise.");
					d.reject(response);
				}
			);
			
			this.$log.debug("ACCOUNT: Return property list promise.");
			
			return d.promise();			
		}
	}
}