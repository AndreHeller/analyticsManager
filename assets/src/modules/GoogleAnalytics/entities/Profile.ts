///<reference path="../reference.ts" />
module analytics.entities {
	/**
	 * Instances of class Profile represent Google Analytics profile
	 * with all settings
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export class Profile
	{
	//== CLASS ATTRIBUTES ==========================================================
	//== INSTANCE ATTRIBUTES =======================================================
	
		//If account instance was filly filled or its still parcial
		private _parciality: boolean = true;
		
		//Created date
		private _created: Date;
		
		//Updated date
		private _updated: Date;
		
		private _currency: string;
		
		private _defaultPage: string;
		
		private _eCommerceTracking: boolean;
		
		private _enhancedECommerceTracking: boolean;
		
		private _excludeQueryParameters: string;
		
		private _siteSearchQueryParameters: string;
		
		private _siteSearchCategoryParameters: string;
		
		private _stripSiteSearchQueryParameters: boolean;
		
		private _stripSiteSearchCategoryParameters: boolean;
		
		private _timezone: string;
		
		private _websiteUrl: string;
	
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 
			
		constructor(
			private _id: string,
			private _name: string,
			private _type: string,
			private _accountId: string,
			private _webPropertyId: string,
			private $log
		){}
	
	//== INSTANCE GETTERS AND SETTERS ==============================================
	
		public get name(): string {
			return this._name;
		}
		
		public get id(): string {
			return this._id;
		}
		
		public get accountId(): string {
			return this._accountId;
		}
		
		public get webPropertyId(): string {
			return this._accountId;
		}
		
		public get parciality(): boolean{
			return this._parciality;
		}
		
		public set parciality(value:boolean){
			this._parciality = value;
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
		
		public get currency(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._currency;
		}
		
		public get defaultPage(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._defaultPage;
		}
		
		public get eCommerceTracking(): boolean {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._eCommerceTracking;
		}
		
		public get enhancedECommerceTracking(): boolean {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._enhancedECommerceTracking;
		}
		
		public get excludeQueryParameters(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._excludeQueryParameters;
		}
		
		public get siteSearchQueryParameters(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._siteSearchQueryParameters;
		}
		
		public get siteSearchCategoryParameters(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._siteSearchCategoryParameters;
		}
		
		public get stripSiteSearchQueryParameters(): boolean {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._stripSiteSearchQueryParameters;
		}
		
		public get stripSiteSearchCategoryParameters(): boolean {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._stripSiteSearchCategoryParameters;
		}
		
		public get timezone(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._timezone;
		}
		
		public get websiteUrl(): string {
			if(this.parciality){
				throw new Error(Strings.ERROR_PARCIAL_INSTANCE);
			}
			return this._websiteUrl;
		}
	
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
	
		/**
		 * Complete instance attributes and meka request for all properties
		 */
		public completeProfileInfo(profile: FullProfile): void {
			this.created = profile.created;
			this.updated = profile.updated;
			this.currency = profile.currency;
			this.defaultPage = profile.defaultPage;
			this.eCommerceTracking = profile.eCommerceTracking;
			this.enhancedECommerceTracking = profile.enhancedECommerceTracking;
			this.excludeQueryParameters = profile.excludeQueryParameters;
			this.siteSearchQueryParameters = profile.siteSearchQueryParameters;
			this.siteSearchCategoryParameters = profile.siteSearchCategoryParameters;
			this.stripSiteSearchQueryParameters = profile.stripSiteSearchQueryParameters;
			this.stripSiteSearchCategoryParameters = profile.stripSiteSearchCategoryParameters;
			this.timezone = profile.timezone;
			this.websiteUrl = profile.websiteUrl;
			
			this.$log.debug("PROFILE: Profile saved!");
		}
	
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
	}
}