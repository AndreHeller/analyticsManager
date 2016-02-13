///<reference path='../../reference.ts' />
module application.services {
	/**
	 * Class 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export class UUIDService {
	//== CLASS ATTRIBUTES ==========================================================
			
		//Angular DI 
		public static $inject = [];
		
	//== INSTANCE ATTRIBUTES =======================================================		
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 	
		
		constructor() {
			
		} 
		
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
    
        public s4(): string {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}

		public generateShort(): string {
			return this.s4() + this.s4();
		}

		public generate (): string {
			return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
		}
        		
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================	
	}
}