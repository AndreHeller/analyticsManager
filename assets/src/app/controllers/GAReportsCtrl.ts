///<reference path="../../reference.ts" />
module application.controllers {
	/**
	 * Class HomeCtrl represents default controller for default application View.
	 * 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 01/2016
	 */
	export class GAReportsCtrl 
	{
	//== CLASS ATTRIBUTES ==========================================================	
		
		public static $inject = ['$scope','$routeParams','$log','GAService','UIService'];
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS ===========================================
		
		constructor(
			private $scope: any,
            private $routeParams: any,
            private $log: ng.ILogService,
            private GAService: analytics.services.GAService,
            private UIService: services.UIService
		){ 
            this.$scope.vm = this;
            
			this.$scope.accountId = this.$routeParams.accountId;
            this.$scope.propertyId = this.$routeParams.propertyId;
            this.$scope.profileId = this.$routeParams.profileId;
            
            this.$scope.csv;
            this.$scope.data;
            this.$scope.result = [];
            this.$scope.vm.startDate = '7daysAgo';
            this.$scope.vm.endDate = 'yesterday';
            this.$scope.vm.metrics = 'ga:pageviews';
            this.$scope.vm.dimensions = 'ga:pagePath';
            this.$scope.vm.startIndex = 1;
            this.$scope.vm.maxResults = 10000; 
            
            
            if(!this.GAService.isDataDownloaded()){
				
				this.$log.debug('GAAccountsCtrl: Basic data still NA. Start downloading process.');
				
				this.UIService.showLoader();
				this.GAService.downloadAnalyticsData()
				.then(
					() => {
						this.$log.debug('GAAccountsCtrl: Basic data were downloaded.');
						this.UIService.hideLoader();
					},
					() => {
						this.$log.error('GAAccountsCtrl: Basic data weren\'t downloaded.');
						this.UIService.showAlert(Strings.ERROR_BASICDATA_NOT_LOAD);
						this.UIService.hideLoader();
					}
				)
			}
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
    
        private resetResults(){
            this.$scope.result = [];
        }
        
        private loadPrev(){
            this.$scope.vm.startIndex -= this.$scope.vm.maxResults;
            
            if(this.$scope.vm.startIndex < 1){
                this.$scope.vm.startIndex = 1;
            }
            this.resetResults();
            this.calculatePV();
        }
        
        private loadNext(){
            this.$scope.vm.startIndex += this.$scope.vm.maxResults;
            this.resetResults();
            this.calculatePV();
        }
        
    
        private calculatePV(){
            console.log("running gapi");            
            gapi.client.analytics.data.ga.get({
                'ids': 'ga:' + this.$scope.profileId,
                'start-date': this.$scope.vm.startDate,
                'end-date': this.$scope.vm.endDate,
                'metrics': this.$scope.vm.metrics,
                'dimensions':this.$scope.vm.dimensions,
                'start-index': this.$scope.vm.startIndex,
                'max-results': this.$scope.vm.maxResults
                
            })
            .then((response) => {
                console.log("Saving data");
                this.$scope.data = response.result;
                this.find404();
            })
        }
        
        private find404(){
            
            var csv = this.$scope.csv,
                data = this.$scope.data.rows;
            
            if(data){
                console.log("Running loop");
                for(var i:number = 0; i < csv.length; i++){
                    for(var y:number = 0; y < data.length; y++){
                        var path = csv[i]['path'].trim().match(/.*/);
                        if(!path){
                            break;
                        }
                        
                        if(path[0] === data[y][0].trim()){
                            this.$scope.result.push([data[y][0],data[y][1]]);
                            console.log('loop' + i);
                            break; 
                        }   
                    }                
                }
                console.log('ending loop');
            }
            
            if(this.$scope.result.length == 0){
                this.$scope.result.push(['No results found','...']);
            }
            this.$scope.$apply();
        }
    
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
    }
}