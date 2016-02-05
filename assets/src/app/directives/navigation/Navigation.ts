///<reference path="../../../reference.ts" />
module application.directives {
	export function Navigation($templateCache: ng.ITemplateCacheService): ng.IDirective {
		return {
			restrict: 'E',
			template: $templateCache.get('app/directives/navigation/Navigation.html'),
			scope: {
				
			},
			controller: NavigationCtrl
		};

	}
}