({
    doInit: function(component, event, helper) {
        var action = component.get("c.getPickListData");
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.isShow", true);
                var data = response.getReturnValue();
                
                for(var i=0; i< data['clients'].length; i++){
                    var sliced =(data['clients'][i].Name).slice(0,28);
                    if (sliced.length < (data['clients'][i].Name).length) {
                        sliced += '...';
                        data['clients'][i].Name = sliced;
                    }
                }
                
                component.set("v.clients", data['clients']); 
                component.set("v.typesSummary", data['summaryTypes']);
            }               
            else if (response.getState() === 'ERROR'){
                component.set("v.isShow", false);
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        component.set("v.isShow", false);
                        helper.showErrorToast();
                    }
                } 
            }
        });
        $A.enqueueAction(action);
    },
    
    search: function(component, event, helper){
        component.set("v.selectedSummaryType", 'All');
        component.set("v.selectedClient",'');
        component.find("checkbox").set("v.value", false);
        component.set("v.isCheck", false);
        var search = event.getSource().get("v.value");
        component.set("v.searchStr", search);
        if(search != ''){
            helper.getSummary(component, 'input');
        }else{
            component.set("v.searchStr", '');
            component.set("v.resSearch", null);
            component.set("v.resSearchBase", null);
        }
    },
    
    setSelectedClient: function(component, event, helper){
        //component.set("v.selectedClient",component.find('selectCl').get("v.value"));
        component.set("v.selectedSummaryType", 'All');
        component.set("v.searchStr", '');
        component.find("checkbox").set("v.value", false);
        component.set("v.isCheck", false);
        var selectClient = event.getSource().get("v.value");
        component.set("v.selectedClient", selectClient);
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
        }
    },
    
    onCheck: function(component, event, helper) {
        var check = component.find("checkbox").get("v.value");
        component.set("v.selectedSummaryType", 'All');
        component.set("v.searchStr", '');
        component.set("v.selectedClient",'');
        component.set("v.isCheck", true);
        if(check){
            helper.getSummary(component, 'All');
        }
    }
    
})