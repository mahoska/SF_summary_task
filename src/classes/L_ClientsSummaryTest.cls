@isTest
private class L_ClientsSummaryTest {
    
    @testSetup static void setup() {
        List<Account> accs =  new List<Account>();
        List<Employee__c> empls =  new List<Employee__c>();
        for(Integer i=0; i<10; i++){
            Account acc = new Account(
                Name = 'TestAccount'+i
            );
            
            accs.add(acc);
            
            Employee__c employee1 = new Employee__c(
                First_Name__c = 'Name'+i, 
                Last_Name__c='Surname', 
                Birthday__c=system.today(), 
                IT_Department__c='DEV', 
                Level__c='Middle', 	
                isActive__c = True,
                Start_Date__c=system.today(),
                Availability__c = 8
            );
            
            Employee__c employee2 = new Employee__c(
                First_Name__c = 'Name', 
                Last_Name__c='Surname'+i, 
                Birthday__c=system.today(), 
                IT_Department__c='QA', 
                Level__c='Middle', 
                isActive__c = True,
                Start_Date__c=system.today(),
                Availability__c = 8
            );    
            empls.add(employee1);
            empls.add(employee2);
        }
        
        insert accs;
        insert empls;
        
        List<Project__c> prjs =  new List<Project__c>();
        for(Integer i=0; i<10; i++){
            Project__c pr = new Project__c(
                Name = 'Test'+i,
                Start_Date__c=system.today(),
                Account__c = accs[i].Id
            );
            prjs.add(pr); 
        }
        
        insert prjs; 
        
        List<EmployeeSkill__c> emplsks =  new List<EmployeeSkill__c>();
        for(Integer i=0; i<10; i++){
            EmployeeSkill__c emplSk = new EmployeeSkill__c(
                Assigned_Time__c = 7, 
                Position__c='Developer',
                Employee__c = empls[i].Id, 
                Project__c = prjs[i].Id
            );
            emplsks.add(emplSk);
        }
        
        insert emplsks;      
    }
    
    @isTest 
    static void TestGetClients() { 
        Test.startTest();
        	List<Account> result = L_ClientSummaryController.getClients();
        Test.stopTest();
        
        System.assertEquals(10, result.size());
    }
    
    @isTest 
    static void TestGetSummaryByPicklistSelect() {
        Account acc = [SELECT Id FROM Account WHERE Name = 'TestAccount0'];
        
        Test.startTest();
        	String result = L_ClientSummaryController.getSummaryByPicklistSelect(acc.Id);
			List<L_ClientSummaryController.SummaryInfo> res = (List<L_ClientSummaryController.SummaryInfo>)JSON.deserialize(result, List<L_ClientSummaryController.SummaryInfo>.class);
        Test.stopTest();
        
        System.assertEquals('TestAccount0', res[0].Client);
        System.assertEquals(1, res[0].Projects);
        System.assertEquals(7, res[0].Hours);
        System.assertEquals(1, res[0].Resources);
    }
    
    @isTest 
    static void TestGetSummaryBySerchCheckBox() {
        Test.startTest();
        	String result = L_ClientSummaryController.getSummaryBySerchCheckBox();
			List<L_ClientSummaryController.SummaryInfo> res = (List<L_ClientSummaryController.SummaryInfo>)JSON.deserialize(result, List<L_ClientSummaryController.SummaryInfo>.class);
        Test.stopTest();
        
        System.assertEquals(String.valueOf(10), res[0].Client);
        System.assertEquals(10, res[0].Projects);
        System.assertEquals(70, res[0].Hours);
        System.assertEquals(10, res[0].Resources);
        System.assertEquals(5, res[0].Devs);
        System.assertEquals(5, res[0].Qas);
    }
    
    @isTest 
    static void TestGetSummaryBySerchInputAdd() {
        Test.startTest();
        	String result = L_ClientSummaryController.getSummaryBySerchInputAdd('Test');
			List<L_ClientSummaryController.SummaryInfo> res = (List<L_ClientSummaryController.SummaryInfo>)JSON.deserialize(result, List<L_ClientSummaryController.SummaryInfo>.class);
        Test.stopTest();
        
        System.assertEquals('TestAccount0', res[0].Client);
        System.assertEquals(1, res[0].Projects);
        System.assertEquals(7, res[0].Hours);
        System.assertEquals(1, res[0].Resources);
    }
    
    @isTest 
    static void TestGetPickListData() {
        Test.startTest();
        	Map<String, List<Object>>  data =  L_ClientSummaryController.getPickListData();
        Test.stopTest();
        
        System.assertEquals(10,data.get('clients').size());
        System.assertEquals('All',data.get('summaryTypes')[0]);
       
    }
    
    
    
}