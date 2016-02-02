///<reference path="../../reference.ts" />
module application.services {
	/**
	 * Interface Alert represent Alert object with several properties (type, msg, icon and optional close) 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export interface Alert {
		type: string;
		msg: string;
		icon: string;
		close?: Function;
	}
	
	/**
	 * Class AlertService represents service managing alerts in User interface. 
	 * This service can only shows and hides alert based on mantioned type.
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 2.00 — 07/2015
	 */
	export class AlertService {
	//== CLASS ATTRIBUTES ==========================================================
				
		public static $inject = ['$rootScope'];	
		
		// Static types of Alerts
		public static OK = 'success';
		public static INFO = 'info';
		public static WARNING = 'warning';
		public static ERROR = 'danger';
		
	//== INSTANCE ATTRIBUTES =======================================================	
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS ===========================================			
				
		constructor(private $rootScope) {
			$rootScope.alerts = [];
			
			return this; //Must return because this service is angular factory
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
		
		/**
		 * Add and show new alert.
		 */ 
		public addAlert = function(type: string, msg: string): Alert {
			var alert: Alert = {			
				type: type,
				msg: msg,
				icon: this.getAlertIcon(type)
			}; 
			
			alert.close = () => {
				return this.closeAlert(alert);
			};
			
			this.$rootScope.alerts.push(alert);
			
			return alert;
		};
		
		
		/**
		 * Delete and hide an alert.
		 */
		public closeAlert = function(alert: Alert) {
			this.$rootScope.alerts.splice(this.$rootScope.alerts.indexOf(alert), 1); 
		};
		
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
		
		/**
		 * Based on type return string represents an icon which will be visible next to the message.
		 */
		private getAlertIcon = function(alertType: string): string{
			switch (alertType) {
				case 'success':
					return 'ok-sign';
				
				case 'info':
					return 'info-sign';
					
				case 'warning':
					return 'exclamation-sign';
					
				case 'danger':
					return 'remove-sign';
				
				default:
					throw new Error('Unknown alertType: ' + alertType + '\nPossible values are success, info, warning or danger');
			}
		};
	}
}