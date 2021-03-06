module application {
	export class Strings {
		public static ERROR_REQUEST_TIMEOUT: string = 'Promiň, trvá to nějak dlouho. Můžeš čekat dál, zkontrolovat připojení k internetu nebo to zkus později.';
		public static ERROR_NOT_AUTHORIZED: string = 'Nepodařilo se autorizovat tvůj Google účet.\n Zpráva chyby: ';
        public static ERROR_IMMEDIATE_FAILED: string = 'Platnost tvého přihlášení zřejmě vypršela. Přihlaš se prosím znovu.\nPokud potíže přetrvávají obrať se na technickou podporu.';
        public static ERROR_PLUS_NOT_FOUND: string = 'Nepodařilo se stáhnout zdroje potřebné pro tvoji identifikaci.';
		public static ERROR_USER_DATA: string = 'Nepodařilo se stáhnout uživatelská data.';
        public static ERROR_TECH_PLEASE_REPEAT: string = 'Došlo k technickým problémům. Zkus aplikaci načíst znovu.';
        
        
        
        public static SUCCESS_USER_LOGGED_IN: string = 'Nazdar %s! Přihlášení proběhlo v pohodě.';
        public static SUCCESS_USER_LOGGED_IN_IMMEDIATE: string = 'Čus %s! Vítej zpět! Platnost tvého přihlášení byla prodloužena.';
        public static SUCCESS_USER_LOGGED_OUT: string = 'Odhlášení proběhlo v pohodě.';
        
        public static ERROR_404: string = 'Promiň, ale vypadá to, že tahle stránka neexistuje.';
        public static ERROR_BASICDATA_NOT_LOAD: string = 'Nepodařilo se stáhnout pořebná data.';
   
		
	}
}

module analytics {
	export class Strings {
		public static ERROR_ANALYTICS_NOT_FOUND: string = 'Nepodařilo se stáhnout knihovnu Google Analytics'; 
		public static ERROR_ANALYTICS_NOT_RESPONSE: string = 'Služba Google Analytics momentálně neodpovídá.';
		public static ERROR_ACCOUNT_SUMMARIES_SAVE: string = 'Nepodařilo s uložit informace o všech účtech.';
		
		
		public static ERROR_PARCIAL_INSTANCE: string = 'Tato instance zatím nebyla stežena celá. Tuto metodu nelze použít.';
		
		
		public static WARN_PROPERTY_COMPLETE: string = 'Toto webové property je již kompletně stažené.';
		public static WARN_ACCOUNT_COMPLETE: string = '';
	}
}