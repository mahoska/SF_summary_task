public without sharing class  CheckAccessRight {
    private static Schema.DescribeSObjectResult AccountDescribe = Account.sObjectType.getDescribe();
    private static String [] accountlistFields = new String [] {'Name'};
    private static Map<String,Schema.SObjectField> accountlistFieldsMap = Schema.SObjectType.Account.fields.getMap();
    
    private static Schema.DescribeSObjectResult ProjectDescribe = Project__c.sObjectType.getDescribe();
    private static String [] projectlistFields = new String [] {'Hours__c', 'Developers__c', 'QA_s__c', 'Team_Members__c', 'Account__c'};
    private static Map<String,Schema.SObjectField> projectlistFieldsMap = Schema.SObjectType.Project__c.fields.getMap();

    /*сhecking account availability*/
    public static Boolean getAccountCRUDAccessAccessible(){
        return AccountDescribe.isAccessible();
    }

   /*сhecking account filds availability*/
    public static Boolean getAccountFLSAccessAccessible(){
        for (String fieldToCheck : accountlistFields) {
            if (!accountlistFieldsMap.get(fieldToCheck).getDescribe().isAccessible()) 
                return  false;
        }
    	return  true;
    }

   /*сhecking project availability*/
   public static Boolean getProjectCRUDAccessAccessible(){
        return ProjectDescribe.isAccessible();
    }

   /*сhecking project filds availability*/
    public static Boolean getProjectFLSAccessAccessible(){       
        for (String fieldToCheck : projectlistFields) {
            if (!projectlistFieldsMap.get(fieldToCheck).getDescribe().isAccessible()) {
                return false;
            }
        }
        return true;
    }
    
    @AuraEnabled
     public static void checkPermission(){
        if(!(getAccountCRUDAccessAccessible() && getAccountFLSAccessAccessible() && true)) 
            throw new AuraHandledException('No permission to Account');
        if(!(getProjectCRUDAccessAccessible() &&  getProjectFLSAccessAccessible() && true)) 
			throw new AuraHandledException('No permission to Project__c');
    }
    
    @AuraEnabled
     public static void checkAccPermission(){
        if(!(getAccountCRUDAccessAccessible() && getAccountFLSAccessAccessible() && true)) 
            throw new AuraHandledException('No permission to Account');
    }
    
    @AuraEnabled
     public static void checkProjPermission(){
        if(!(getAccountCRUDAccessAccessible() && getAccountFLSAccessAccessible() && true)) 
            throw new AuraHandledException('No permission to Account');
    }

   }