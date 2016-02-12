module analytics.entities {
	export interface ParcialAccount {
		id: string,
		name: string,
		webProperties: Array<ParcialWebProperty>						
	}
	
	
	export interface FullAccount {
		id: string,
		name: string,
		webProperties: Array<ParcialWebProperty>,
		created: Date,
		updated: Date						
	}
	
	
	export interface ParcialWebProperty {
		id: string,
		name: string,
		internalWebPropertyId: string,
		level: string,
		profiles: Array<ParcialProfile>						
	}
	
	
	export interface FullWebProperty {
		id: string,
		name: string,
		webProperties: Array<ParcialWebProperty>,
		created: Date,
		updated: Date,
		defaultProfileId: string,
		profileCount: number,
		websiteUrl: string					
	}
	
	
	export interface ParcialProfile {
		id: string,
		name: string,
		type: string						
	}
	
	
	export interface FullProfile {
		id: string,
		name: string,
		type: string,
		created: Date,
		updated: Date,
		currency: string,
		defaultPage: string,
		eCommerceTracking: boolean,
		enhancedECommerceTracking: boolean,
		excludeQueryParameters: string,
		siteSearchQueryParameters: string,
		siteSearchCategoryParameters: string,
		stripSiteSearchQueryParameters: boolean,
		stripSiteSearchCategoryParameters: boolean,
		timezone: string,
		websiteUrl: string					
	}
}