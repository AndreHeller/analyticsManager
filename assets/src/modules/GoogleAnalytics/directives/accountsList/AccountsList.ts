///<reference path="../../../../reference.ts" />
module analytics.directives {
	export function AccountsList($templateCache: ng.ITemplateCacheService): ng.IDirective {
		return {
			restrict: 'E',
			template: $templateCache.get('modules/GoogleAnalytics/directives/accountsList/AccountsList.html'),
			scope: {
					
			},
			controller: AccountsListCtrl
		};

	}
}