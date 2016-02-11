///<reference path="../../../../reference.ts" />
module analytics.directives {
	/**
	 * Class NavigationCtrl represents controller for navigataion panel 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export class AccountsListCtrl 
	{
	//== CLASS ATTRIBUTES ==========================================================
	
		public static $inject = ['$scope','$log','GAService'];
	
	//== INSTANCE ATTRIBUTES =======================================================
	
		private counter: number = 0;
		
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 
		
		constructor(
			private $scope: any,  
			private $log: ng.ILogService,
			private GAService: services.GAService
		){
			this.$scope.vm = this;
			this.checkData();
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================		
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
	
		private checkData(): void{
			this.$log.debug('AccountsListCtrl: Checking data - GA Accounts');
			
			var accounts = this.GAService.getAllAccounts();
			
			if(!accounts){
				var timeout = (Math.pow(2,this.counter) * 1000) + Math.random();
				this.$log.debug('AccountsListCtrl: Accounts weren\'t loaded yet.\nSetting up timeout for ' + timeout/1000 + 's.')
				if(this.counter < 6){
					setTimeout(
						() => {
							return this.checkData()
						},
						timeout
					);
					this.counter++;	
				}
			}
			else{
				this.$log.debug('AccountsListCtrl: Data found.');
				this.$scope.accounts = accounts.toArray();
			}
		}
		
		private showAccounts(): boolean{
			if(this.$scope.accounts){
				return true;
			}
			return false;
		}		
	}
}