///<reference path='../../../reference.ts' />
module analytics.services {
    /**
	 * This class represents main service, which is responsible for user actions.
     * 
     * It can authorize or logout user, return its login state od return its info.
     * Also shows alerts and can show loaders in specific cases.
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 02/2016
	 */
	export class GAService {
	//== CLASS ATTRIBUTES ==========================================================
			
		//Angular DI 
		public static $inject = ['$log'];
        
	//== INSTANCE ATTRIBUTES =======================================================
    
        private ACCOUNTS: util.StringMap<entities.Account> = new util.StringMap<entities.Account>();
		
		private dataDownloaded: boolean = false;
        
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 	
		
		constructor(  
            private $log: ng.ILogService
		) {
		} 
		
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
        
        public downloadAnalyticsData(force?: boolean): Promises.Promise{
			var d = new Promises.Deferred();
			
			this.$log.debug('GAService: Starting download GA accounts.');
			
			if(this.isDataDownloaded() && !force){
				this.$log.debug('GAService: Data already downloaded. - Fulfilling download GA accounts promise.');
				d.fulfill()
			}
			else {
				this.loadAnalytics()
				.then(() => {return this.requestAccountSummaries()})
				.then(
					() => {
						if(typeof this.ACCOUNTS.toArray()[0] != 'undefined'){
							this.dataDownloaded = true;
							this.$log.debug('GAService: Data donwloaded. - Fulfilling download GA accounts promise.');
							d.fulfill();
						}
						else {
							this.$log.debug('GAService: Data was donwloaded but wasn\'t saved. - Rejecting download GA accounts promise.');
							d.reject();
						}
					},
					() => {
						this.$log.debug('GAService: Data wasn\'t downloaded. - Rejecting download GA accounts promise.');
						d.reject();
					}
				);
			}
			
			this.$log.debug('GAService: Returning download GA accounts promise.');
			return d.promise();
		}
		
		/**********************************************************************
		 * Returns map of all accounts
		 */
		public getAllAccounts(): util.StringMap<entities.Account>{
			if(typeof this.ACCOUNTS.toArray()[0] == 'undefined'){
				return null;	
			}
			return this.ACCOUNTS
		}
		
		
		/**
		 * Returns account by its number.
		 */
		public getAccount(accountId: string): entities.Account{
			return this.ACCOUNTS.get(accountId);
		}
		
		
		/**
		 * Delete all accounts data.
		 */
		public deleteAllAccounts(): void{
			this.ACCOUNTS.flush();
		}
		
		
		public isDataDownloaded(): boolean {
			return this.dataDownloaded;
		}
        		
    //== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
    
        /********************************************************************
		 * Factory method for creating accounts
		 */
		private createAccount(account: entities.ParcialAccount): void{
			this.ACCOUNTS.put(
					account.id, 
					new entities.Account( 
						account.id, 
						account.name, 
						account.webProperties,
						this.$log
					)
			);
		}
		
		
		/*****************************************************************---
		 * Load Analytics Client library
		 */
		private loadAnalytics(): Promises.Promise {
			
			this.$log.debug('GAService: Starting Load GA library.');
			
			var d = new Promises.Deferred() 
			
			if(gapi.client.analytics){
				this.$log.error('GAService: GA library already loaded - Rejecting Load GA library promise.');
				d.reject();
			}
			else {
				gapi.client.load('analytics', 'v3', () => {
					if(gapi.client.analytics){
						this.$log.debug('GAService: Fulfiiling Load GA library promise.');
						d.fulfill();
					}
					else {
						this.$log.error('GAService: Rejecting Load GA library promise.');
						d.reject(Strings.ERROR_ANALYTICS_NOT_FOUND)
					}
				});	
			}
			
			this.$log.debug('GAService: Returning Load GA library Promise');
			return d.promise();
		}
		
		
		/************************************************************************
		 * Request API for AccounSummaries. Basic data about Account, WebProperties and Profiles.
		 */
		private requestAccountSummaries(): Promises.Promise{
			this.$log.debug('GAService: Starting AccountSummaries API request.');
			
			var d = new Promises.Deferred();
			 
			if(gapi.client.analytics){
				gapi.client.analytics.management.accountSummaries.list()
					.then(
						(data) => {
							if(this.saveAccountSummaries(data)){
								this.$log.debug('GAService: Fullfilling AccountSummaries API request promise.');
								d.fulfill();	
							}
							else{
								this.$log.error('GAService: Rejecting AccountSummaries API request promise.');
								d.reject(Strings.ERROR_ACCOUNT_SUMMARIES_SAVE);
							}
						},
						(error) => {
							this.$log.error('GAService: Rejecting AccountSummaries API request promise.');
							this.$log.error(error);
							d.reject(Strings.ERROR_ANALYTICS_NOT_FOUND);
						}
					);		
			}
			else {
				this.$log.error('GAService: Rejecting AccountSummaries API request. NEVER SHOULD HAPEN!');
				d.reject(Strings.ERROR_ANALYTICS_NOT_RESPONSE);
			}
			
			this.$log.debug('GAService: Returning AccountSummaries API request promise.');
			return d.promise();
		}
		
		
		/**
		 * Proiteruje data v parametru a vytvoří jednotlivé instance všech ÚČTŮ, PROPERTY A PROFILŮ. Parametr by mě odpovídat tomu co vrátí APi na základě metody requestAccountSUmmaries()
		 */
		private saveAccountSummaries(data: any): boolean {
			
			this.$log.debug('GAService: Starting save AccountSummaries data.');
			
			var accounts: Array<entities.ParcialAccount> = data.result.items;
			
			try {
				for(var i:number = 0; i < accounts.length; i++){
					this.createAccount(accounts[i]);
				}
			} catch(Error){
				this.$log.error('GAService: AccountSummaries data wasn\'t save');
				this.ACCOUNTS.flush();
				return false;
			}
			
			this.$log.debug('GAService: AccountSummaries were successfully saved.');
			return true;
		}
   	}
}