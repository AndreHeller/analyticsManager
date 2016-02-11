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
        
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 	
		
		constructor(  
            private $log: ng.ILogService
		) {
			//$rootScope.accounts = this.ACCOUNTS;
		} 
		
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
        
        /**********************************************************************
		 * Returns map of all accounts
		 */
		public getAllAccounts(): util.StringMap<entities.Account>{
			return this.ACCOUNTS;
		}
		
		
		/**
		 * Returns account by its number.
		 */
		public getAccount(accountId: string): entities.Account{
			return this.ACCOUNTS.get(accountId);
		}
		
		
		/************************************************************************
		 * Request API for AccounSummaries. Basic data about Account, WebProperties and Profiles.
		 */
		public requestAccountSummaries(input: any): Promises.Promise{
			this.$log.debug('AccountManager: Starting AccountSummaries request.');
			
			var d = new Promises.Deferred();
			 
			if(gapi.client.analytics){
				gapi.client.analytics.management.accountSummaries.list()
					.then(
						(param) => {
							this.$log.debug('AccountManager: Fullfilling AccountSummaries request.');
							d.fulfill(param);
						},
						(error) => {
							this.$log.error('AccountManager: Rejecting AccountSummaries request.');
							d.reject(Strings.ERROR_ANALYTICS_NOT_FOUND);
						}
					);		
			}
			else {
				this.$log.error('AccountManager: Rejecting AccountSummaries request. NEVER SHOULD HAPEN!');
				d.reject(Strings.ERROR_ANALYTICS_NOT_RESPONSE);
			}
			
			this.$log.debug('AccountManager: Returning AccountSummaries request promise.');
			return d.promise();
		}
		
		
		/**
		 * Proiteruje data v parametru a vytvoří jednotlivé instance všech ÚČTŮ, PROPERTY A PROFILŮ. Parametr by mě odpovídat tomu co vrátí APi na základě metody requestAccountSUmmaries()
		 */
		public saveAccountSummaries(data: any): Promises.Promise {
			this.$log.debug('AccountManager: Starting save accountsummaries info.');
			var accounts: Array<entities.ParcialAccount> = data.result.items,
				d = new Promises.Deferred;
			
			for(var i:number = 0; i < accounts.length; i++){
				this.createAccount(accounts[i]);
			}
			
			if(this.ACCOUNTS.getSize() === accounts.length){
				this.$log.debug('AccountManager: Fillfiling save accountsummaries info.');
				d.fulfill();
			}
			else{
				this.$log.error('AccountManager: Rejecting save accountsummaries info.');
				d.reject(Strings.ERROR_ACCOUNT_SUMMARIES_SAVE);
			}
			
			this.$log.debug('AccountManager: Returning save accountsummaries info.');
			return d.promise();
		}
		
		
		/**
		 * Delete all accounts data.
		 */
		public deleteAllAccounts(): void{
			this.ACCOUNTS.flush();
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
   	}
}