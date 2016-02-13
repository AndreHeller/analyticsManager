///<reference path="../../reference.ts" />
module application.controllers {
	/**
	 * Class HitBuilderCtrl represents controller for hitbuilder view.
	 * 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 01/2016
	 */
	export class HitBuilderCtrl 
	{
	//== CLASS ATTRIBUTES ==========================================================	
		
		public static $inject = ['$scope','$log','$http','UUIDService'];
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS ===========================================
		
		constructor(
			private $scope: any,
			private $log: ng.ILogService,
			private $http: ng.IHttpService,
            private UUIDService: services.UUIDService
		){
			this.$scope.vm = this;
			this.$scope.params = {v: 1};
			this.$scope.optParams = [];
            this.$scope.validatedState = 0;
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
	
        /**
         * Parse current values in param and optaparams scope variables 
         * into POST payload. Save into scope.
         */
        private updatePayload(){
            var payload = "",
                params = this.$scope.params,
                optParams = this.$scope.optParams;
                
            for(var param in params){
                payload += param + '=' + params[param] + '&';
            }
            
            for(var i = 0; i < optParams.length; i++){
                if(typeof optParams[i].key != 'undefined'){
                    payload += optParams[i].key + '=';
                    
                    if(typeof optParams[i].value != 'undefined'){
                        payload += optParams[i].value;  
                    }     
                    payload += '&';
                }
            }
            
            if(payload.lastIndexOf('&') === payload.length-1){
                payload = payload.substr(0,payload.length-1)
            };

            if(this.$scope.validatedState === 1){
                this.$scope.validatedState = 0
            };
            this.$scope.payload = payload;
        }
    
	    
        /**
         * Add new row for opt params.
         */
		private addParamRow(){
			this.$scope.optParams.push({});
		}
		
        
        /**
         * Remove given row from opt params table
         */
		private removeParamRow(index: number){
			this.$scope.optParams.splice(index,1);
		}
        
        
        /**
         * Generate UUID string
         */
        private generateUUID(){
            this.$scope.params.cid = this.UUIDService.generate(); 
        };
        
        
        /**
         * Send debug hit to google server.
         * 
         * If were valid it would let user to send original. If not it would write errors
         */
        private validateHit(){
            this.$scope.validatedState = 2;
            this.$http.get('http://www.google-analytics.com/debug/collect?' + this.$scope.payload)
            .then(
                (response: any) => {
                    var result = response.data.hitParsingResult[0];
                    
                    if(result.valid){
                        this.$scope.validatedState = 1;          
                    }
                    else {
                        this.$scope.validatedState = -1;
                        this.$scope.validationErrors = [];
                        
                        for(var i:number = 0; i < result.parserMessage.length; i++){
                            this.$scope.validationErrors.push(result.parserMessage[i].description);
                        }
                    }
                },
                (response: any) => {
                    this.$log.error('Connection error: ');
                    this.$log.error(response);
                    this.$scope.validatedState = 0;
                }
            );
        };
        
        private sendHit(){
            this.$http.get('http://www.google-analytics.com/collect?' + this.$scope.payload)
            .then(
                (response) => {
                    this.$scope.modalHeader = 'Success!';
                    this.$scope.modalText = 'Your hit has been sent in Google Analytics. Check your realtime report.';
                    
                },
                (response) => {
                    this.$scope.modalHeader = 'Error!';
                    this.$scope.modalText = 'Sorry! Somewhere is probably some problem.';
                }
            );
        }
    }
}