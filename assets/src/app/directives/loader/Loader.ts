///<reference path="../../../reference.ts" />
module application.directives {
	export function Loader($templateCache: ng.ITemplateCacheService): ng.IDirective {
		return {
			restrict: 'E',
			template: $templateCache.get('app/directives/loader/Loader.html'),
			scope: {}
		};

	}
}