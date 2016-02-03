module application.directives {
	export function Alert($templateCache: ng.ITemplateCacheService): ng.IDirective {
		return {
			restrict: 'E',
			template: $templateCache.get('app/directives/alert/Alert.html'),
			scope: {
				type: '@',
				close: '=',
				icon: '@' 
			},
			transclude: true
		};

	}
}