///<reference path="../reference.ts" />
module application {
	export interface Section {
        path?: string;
        template?: string;
        name: string;
        groups: string[];
        controller?: any;
        subsections?: util.StringMap<Section>;
    }
    
    export class Routes {
		
        private defaultSection = 'home';
        
        private templatePath: string = 'app/templates/';
        
        private sections: util.StringMap<Section> = new util.StringMap<Section>();
        
        
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
                name: 'Google Analytics',
                groups: ['loginOnly'],
                subsections: new util.StringMap<Section>().put(
                    'ga.accounts',
                        {
                            path: '/ga/accounts',
                            name: 'Accounts',
                            template: 'ga_accounts.html',
                            groups: ['loginOnly']
                        } 
                    )
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
                    
                    if(!route.subsections){
                        routeObject.path = route.path;    
                    }
                    else {
                        routeObject.subsections = route.subsections
                    }
                    
                    routeObject.name = route.name;
                    routeObject.groups = route.groups;
                    
                    menus.push(routeObject);
            }
            
            
            return menus;
        }
        
        
        public setRoutes($routeProvider){
            var sectionObjects = this.sections.toArray();
            
            for(var i:number = 0; i < sectionObjects.length; i++){
                if(sectionObjects[i].subsections){
                    var subsections = sectionObjects[i].subsections.toArray();
                    for(var y: number = 0; y < subsections.length; y++){
                        $routeProvider
                            .when(subsections[y].path, { 
                                controller: subsections[y].controller,
                                templateUrl: this.templatePath + subsections[y].template
                            })   
                    }
                }
                else {
                    $routeProvider
                        .when(sectionObjects[i].path, { 
                            controller: sectionObjects[i].controller,
                            templateUrl: this.templatePath + sectionObjects[i].template
                        })    
                }
                
            }
            
            $routeProvider.otherwise({redirectTo: this.sections.get(this.defaultSection).path});
        };
	}
}