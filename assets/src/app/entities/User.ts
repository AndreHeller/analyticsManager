///<reference path="../../reference.ts" />
module application.entities {
    /**
	 * Interface User represents whole user with all his parameters and properties.  
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 02/2016
	 */
	export interface User {
		logged: boolean;
        name: string;
        lastName: string;
        image: string;
        googleId: string;
        time: Date;
	}
}