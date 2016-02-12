///<reference path="../reference.ts" />
module analytics.entities {
	/**
	 * Instances of class WebProperty represent Google Analytics webproperty
	 * with all possible profiles and settings
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export class WebProperty
	{
	//== CLASS ATTRIBUTES ==========================================================
	//== INSTANCE ATTRIBUTES =======================================================
		
		//If account instance was filly filled or its still parcial
		private _parciality = true;
		
		//Storage for profiles
		private _profiles: util.StringMap<Profile> = new util.StringMap<Profile>();
		
		//Created date
		private _created: Date;
		
		//Updated date
		private _updated: Date;
		
		private _defaultProfileId: string;
		
		private _profileCount: number;
		
		private _websiteUrl: string;
		
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 
		
		/**
		 * Creates a new Webrpoeprty. Constructor should never be called directly.
		 * Use factory method in Accounts class instead.
		 */	
		constructor(
			private _id: string,
			private _name: string,
			private _internalId: string,
			private _level: string,
			private _accountId: string,
			profiles: Array<ParcialProfile>,
			private $log
		){
			
			for(var i: number = 0; i < profiles.length;i++){
				this.createProfile(profiles[i]);
			}
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	
		public get name(): string {
			return this._name;
		}
		
		public get id(): string {
			return this._id;
		}
		
		public get internalId(): string {
			return this._internalId;
		}
		
		//Standard / Premium
		public get level(): string {
			return this._level;
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
		
		public get defaultProfileId(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._defaultProfileId;
		}
		
		public get profileCount(): number {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._profileCount;
		}
		
		public get websiteUrl(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._websiteUrl;
		}
		
		public get profiles(): util.StringMap<Profile>{
			return this._profiles;
		}
		
		public get accountId(): string {
			return this._accountId;
		}
		
		public get parciality(): boolean{
			return this._parciality;
		}
		
		public set parciality(value:boolean){
			this._parciality = value;
		}
	
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================	
		
		/**
		 * Complete instance attributes and meka request for all properties
		 */
		public completePropertyInfo(property: FullWebProperty): void {
			this.created = property.created;
			this.updated = property.updated;
			this.defaultProfileId = property.defaultProfileId;
			this.profileCount = property.profileCount;
			this.websiteUrl = property.websiteUrl;
			
			this.$log.debug("WEBPROPERTY: Property saved!");
		}
		
		
		/**
		 * Load the rest of instance if its parciality equals true or if optional param force equals true.
		 */
		public completeProfiles(force?: boolean): Promises.Promise{ 
			
			var d = new Promises.Deferred();
			this.$log.debug("WEBPROPERTY: Starting complete profiles.\n- Force: " + force + "\n- Parciality: " + this.parciality);
			
			if(force || this.parciality){
				this.$log.debug("WEBPROPERTY: Property is parcial");
				
				this.downloadProfiles().then(
					(response) => {
						 
						 this.$log.debug("WEBPROPERTY: Starting save profiles info.");
						 
						 for(var i:number = 0; i < response.result.items.length; i++){
							 var profile: Profile = this.profiles.get(response.result.items[i].id);
							 
							 this.$log.debug("WEBPROPERTY: Saving profile info: " + i);
							 profile.completeProfileInfo(response.result.items[i]);
							 profile.parciality = false;
						 }
						 
						 this.$log.debug("WEBPROPERTY: Fullfill complete profile promise.");
						 
						 d.fulfill();
					 },
					 (err) => {
						 this.$log.error("WEBPROPERTY: Reject complete profile promise");
						 d.reject(err);
					 }
				 );
			}
			else {
				this.$log.error("WEBPROPERTY: This property is already completed.");
				//Aready completed								
				d.reject(Strings.WARN_PROPERTY_COMPLETE);
			}
			
			this.$log.debug("WEBPROPERTY: Return complete profiles promise.");
			return d.promise();
		}
		
		
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
	
		/**
		 * Creates a new profile(view) and put it into profiles stringMap. 
		 */
		private createProfile(profile: ParcialProfile): void{
				this.profiles.put(
					profile.id, 
					new Profile(
						profile.id,
						profile.name,
						profile.type,
						this.accountId,
						this.id,
						this.$log
					)
				);
			}
		
		
		
		/**
		 * Make an API call for list all properties
		 */
		private downloadProfiles(): Promises.Promise{
			
			var d = new Promises.Deferred();
			
			this.$log.debug("WEBPROPERTY: Contact API for profile list.");
			
			gapi.client.analytics.management.profiles.list({'accountId': this.accountId,'webPropertyId':this.id}).then(
				(response) => {
					this.$log.debug("WEBPROPERTY: Fulfill profile list promise.");
					d.fulfill(response);
				},
				(response) => {
					this.$log.debug("WEBPROPERTY: Reject profile list promise.");
					d.reject(response);
				}
			);
			
			this.$log.debug("WEBPROPERTY: Return profile list promise");
			
			return d.promise();			
		}
	}
}
