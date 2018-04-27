({
    doInit: function(component, event, helper) {
        helper.getInitPicklistData(component);
    },
    
    search: function(component, event, helper){
        var search = event.getSource().get("v.value");
        helper.settings(component, 'All', '', false, false, false, false, search) ;
        if(search != ''){
            helper.getSummary(component, 'input');
        }else{
            component.set("v.searchStr", '');
            component.set("v.resSearch", null);
            component.set("v.resSearchBase", null);
        }
    },
    
    setSelectedClient: function(component, event, helper){
        var selectClient = event.getSource().get("v.value");
        helper.settings(component, 'All', selectClient, false, false, false, false, '') ;
        if(selectClient != ''){
            helper.getSummary(component, 'picklist');
        }
    },
    
    setSelectedSummaryType: function(component, event, helper){
        var selectedSummaryType =  event.getSource().get("v.value");
        component.set("v.selectedSummaryType", selectedSummaryType);
        
        var baseSearchInfo = component.get("v.resSearchBase");
        if(baseSearchInfo!=null){
            var res = helper.parseData(baseSearchInfo,selectedSummaryType);
            component.set("v.resSearch", res);
            if(component.get("v.selectedClient")!='' ||  component.get("v.isCheck") == true){
                helper.createDashboard(component, res['data'][0]);
            }else if(component.get("v.searchStr")!='' || component.get("v.isCheckForClients") == true){
                helper.createDashboardForSearch(component, res);
            }
        }
    },
    
    onCheck: function(component, event, helper) {
        var check = component.find("checkbox").get("v.value");
        helper.settings(component, 'All', '', check, true, false, false, '') ;
        if(check){
            helper.getSummary(component, 'All');
        }
    },
    
    onCheckForClients: function(component, event, helper) {
        var check = component.find("checkboxForClients").get("v.value"); 
        helper.settings(component, 'All', '', false, false, true, check, '') ;
        if(check){
            helper.getSummary(component, 'AllForClients');
        }
    }
    
})