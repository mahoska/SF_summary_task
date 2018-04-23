public with sharing class L_ClientSummaryController {
    private static List<String> summaryTypes = new List<String>{'All', 'Projects', 'Hours', 'Resources', 'Devs', 'Qas'};
        
    @AuraEnabled
    public static Map<String, List<Object>>  getPickListData() {
        CheckAccessRight.checkPermission();
        List<Account> clients =  getClients();
        Map<String, List<Object>>  data =  new  Map<String, List<Object>>();
        data.put('clients', clients);
        data.put('summaryTypes', summaryTypes);
        return data;
    }
    
    public static List<Account> getClients(){
        CheckAccessRight.checkAccPermission();
        return [SELECT Id, Name	FROM Account];
    }
    
    @AuraEnabled
    public static String getSummaryByPicklistSelect(String selectedClient){
        CheckAccessRight.checkAccPermission();
        List<Account> accs = new List<Account>();
        accs.add(new Account(Id=selectedClient));
        return getSearchInfoByAccounts(accs);
    }
    
    @AuraEnabled
    public static String getSummaryBySerchInputAdd(String searchText){
        if(!String.isEmpty(searchText)){
            CheckAccessRight.checkAccPermission();
            String s = 'Select Id FROM Account WHERE Name Like \'' + searchText + '%\'';
            List<Account> accs = Database.query(s);
            return getSearchInfoByAccounts(accs);
        }else{
            return '';
        }
    }
    
    @AuraEnabled
    public static String getSummaryBySerchCheckBox(){
        CheckAccessRight.checkPermission();
        List<Account> accs  =  [SELECT  Id  FROM Account];
        List<AggregateResult> info = [
            SELECT COUNT(Id) projects, SUM(Hours__c) hours, SUM( Developers__c) devs, 
            SUM(QA_s__c) qas, SUM( Team_Members__c ) skills
            FROM Project__c 
            WHERE Account__c =: accs
        ];
        
        List<SummaryInfo> resList = new List<SummaryInfo>();
        resList.add(new SummaryInfo(
            String.valueOf(accs.size()), 
                (Integer)info[0].get('projects'),
                ((Decimal)info[0].get('hours')).intValue(),
                ((Decimal)info[0].get('skills')).intValue(),
                ((Decimal)info[0].get('devs')).intValue(),
                ((Decimal)info[0].get('qas')).intValue()
        ));
        
        return JSON.serialize(resList); 
    }
    
    public static String getSearchInfoByAccounts(List<Account> accs){
        CheckAccessRight.checkPermission();
        List<AggregateResult> info;
        info = [	
            SELECT Account__r.Name acname, COUNT(Id) projects, SUM(Hours__c) hours, 
            SUM( Developers__c) devs, SUM(QA_s__c) qas, SUM( Team_Members__c ) skills
            FROM Project__c 
            WHERE Account__c =: accs
            GROUP BY Account__r.Name, Account__r.Id 
        ];
        
        List<SummaryInfo> resList = new List<SummaryInfo>();
        for(AggregateResult item : info){
            resList.add(new SummaryInfo(
                (String)item.get('acname'), 
                (Integer)item.get('projects'),
                ((Decimal)item.get('hours')).intValue(),
                ((Decimal)item.get('skills')).intValue(), 
                ((Decimal)item.get('devs')).intValue(), 
                ((Decimal)item.get('qas')).intValue()
            ));
        }
        return JSON.serialize(resList); 
    }
    
    public class SummaryInfo {
        public String Client{set; get;}
        public Integer Projects{set; get;}
        public Integer Hours{set; get;}
        public Integer Resources{set; get;}
        public Integer Devs{set; get;}
        public Integer Qas{set; get;}  
        
        public SummaryInfo(String cln, Integer projs, Integer hs, Integer res, Integer ds, Integer qs){
            Client = cln;
            Projects = projs;
            Hours = hs;
            Resources = res;
            Devs = ds;
            Qas = qs;
        }
        
    }   
}