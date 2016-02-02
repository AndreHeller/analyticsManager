///<reference path='../../reference.ts' />
module application.services {
	/**
	 * Class LoaderService represent sercice which managaing loading screen. 
	 * It can show or hide it and automatically sets timout for it. 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export class LoaderService {
	//== CLASS ATTRIBUTES ==========================================================
	
		public static $inject = ['$document', '$timeout'];
	
	//== INSTANCE ATTRIBUTES =======================================================
	
		/** Element which should class-changed */
		public generalElement: HTMLElement;
		
		/** Shows if loader is visible (true) od hide (false) */
		public loadingState: boolean;
			
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 
			
		constructor(
			private $document: ng.IDocumentService,
			private $timeout: ng.ITimeoutService
		) {
			this.generalElement = this.$document.find('body')[0];
			this.loadingState = false;
		}
	
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
	
		/**
		 * Show loader. Return false if loader is already visible;
		 */
		public showLoader(): boolean {
			if (!this.loadingState ) {		
				
				this.addClass(this.generalElement, 'loading');
				
				this.loadingState = true;
				
				return true;
			} else {
				return false;
			}
		}
		
		
		/**
		 * Hide loader. Return false if loader is already hide.
		 */
		public hideLoader(): boolean {
			if (this.loadingState) {
				this.removeClass(this.generalElement, 'loading');
				this.addClass(this.generalElement, 'loaded');
				
				this.$timeout(
					() => {
						this.removeClass(this.generalElement, 'loaded');
					},
					3000
				);
				
				this.loadingState = false;
				
				return true;
			} else {
				return false;
			}
		}
	
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
		
		/**
		 * Add class to an element. Return false if there already is one.
		 */
		private addClass(element: HTMLElement, className: string): boolean {
			if (!element.className.search(new RegExp('.*' + className + '.*'))) {
				return false;
			} else {
				element.className += ' ' + className;
				return true; 
			}
		};
		
		
		/**
		 * Remove class from an alement. return false of there is no class.
		 */
		private removeClass(element: HTMLElement, className: string): boolean {
			if (element.className.search(new RegExp('.*' + className + '.*'))) {
				return false; 
			} else {
				var finalClassName: string = '',
					classes = element.className.split(' ');
				
				for (var i: number; i < classes.length; i++) {
					if (classes[i] !== className) {
						finalClassName += ' ' + classes[i];
					} else {
						//never should happen
						return false;
					}		                 
				}	
				
				element.className = finalClassName;	
				return true;
			}
		}
	
	}
}