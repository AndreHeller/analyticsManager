///<reference path="../reference.ts" />
module application {
	export interface Route {
        path: string;
        template: string;
        name: string;
        groups: string[];
        controller: any;
    }
    
    export class Routes {
		
        private defaultSection = 'home';
        
        private templatePath: string = 'app/templates/';
        
        private defaultSectionPath = '/';
        
        private sections: util.StringMap<Route> = new util.StringMap<Route>();
        
        
        constructor(){
            this.sections.put('home',{
                path: '/',
                template: 'home.html',
                name: 'Home',
                groups: ['always'],
                controller: controllers.HomeCtrl
            })
            .put('login',{
                path: '/login',
                template: 'login.html',
                name: 'Login',
                groups: ['anonymous'],
                controller: controllers.LoginCtrl
            })
            .put('ga', {
                path: '/ga',
                template: 'ga.html',
                name: 'Google Analytics',
                groups: ['loginOnly'],
                controller: controllers.GACtrl
            }); 
        }
        
        
        public  getRoutePath(route: string): string{
            return this.sections.get(route).path;
        }
        
        
        public getDefaultSectionPath(): string {
            return this.getRoutePath(this.defaultSection);
        }
        
        
        public  createMenuObject(): Object[] {
            var menus = [],
                routes = this.sections.toArray();
            
            for(var i: number = 0; i < this.sections.getSize(); i++){
                var route = routes[i],
                    routeObject: any = {};
                    
                    routeObject.name = route.name;
                    routeObject.link = route.path;
                    routeObject.groups = route.groups;
                    
                    menus.push(routeObject);
            }
            
            
            return menus;
        }
        
        
        public setRoutes($routeProvider){
            var sectionObjects = this.sections.toArray();
            
            for(var i:number = 0; i < sectionObjects.length; i++){
                $routeProvider
                    .when(sectionObjects[i].path, { 
                        controller: sectionObjects[i].controller,
                        templateUrl: this.templatePath + sectionObjects[i].template
                    })
            }
            
            $routeProvider.otherwise({redirectTo: this.sections.get(this.defaultSection).path});
        };
	}
}