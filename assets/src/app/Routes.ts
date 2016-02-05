module application {
	export class Routes {
		
        private static TEMPLATES_PATH: string = 'app/templates/';
        
        private static defaultSectionPath = '/';
        
        private static sectionnames = [
            'home','login'
        ];
        
        private static sections: Object = {
            'home': {
                path: '/',
                template: 'home.html',
                name: 'Home',
                groups: ['always']
            },
            'login': {
                path: '/login',
                template: 'login.html',
                name: 'Login',
                groups: ['anonymous']
            }
        }
        
        public static getRoutePath(route: string): string{
            return Routes.sections[route].path;
        }
        
        public static getRouteTemplateUrl(route: string): string {
            return Routes.TEMPLATES_PATH + Routes.sections[route].template;
        }
        
        public static createMenuObject(): Object[] {
            var menus = [];
            
            for(var i: number = 0; i < Routes.sectionnames.length; i++){
                var route = Routes.sections[Routes.sectionnames[i]],
                    routeObject: any = {};
                    
                    
                    routeObject.name = route.name;
                    routeObject.link = route.path;
                    routeObject.groups = route.groups;
                    
                    menus.push(routeObject);
            }
            
            
            return menus;
        }
        
        public static getDefaultSectionPath(): string {
            return Routes.defaultSectionPath;
        }
	}
}