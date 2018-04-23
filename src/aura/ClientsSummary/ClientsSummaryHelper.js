({
    getSummary : function(component, fromWhat) {
        var action;
        switch(fromWhat){
            case 'picklist':
                action = component.get("c.getSummaryByPicklistSelect");
                action.setParams({ 
                    'selectedClient' : component.get("v.selectedClient")
                });   
                break;
            case 'input': 
                action = component.get("c.getSummaryBySerchInputAdd");
                action.setParams({ 
                    'searchText' : component.get("v.searchStr")
                }); 
                break;
            case 'All': 
                action = component.get("c.getSummaryBySerchCheckBox");
                break;
        }
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(response.getReturnValue() != ''){
                    var data = JSON.parse(response.getReturnValue());
                    //we keep all the data for the customers of interest
                    component.set("v.resSearchBase", data);
                    
                    var selectedSummaryType =  component.get("v.selectedSummaryType");
                    var res = self.parseData(data,selectedSummaryType);
                    component.set("v.resSearch", res);
                    //console.log(res);
                }else{
                    component.set("v.searchStr", '');
                    component.set("v.resSearch", null);
                    //console.log("Empty serchString!"); 
                }
            }else if (response.getState() === 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log(errors[0].message);
                        component.set("v.isShow", false);
                        self.showErrorToast();
                    }
                } 
            }
        });
        
        $A.enqueueAction(action); 
    },
    
    parseData : function(data, selectedSummaryType) {
        var res = {'keys': [],  'data' : [] };
        if(selectedSummaryType=='All'){
            var step=0;
            for(var item in data){
                var row = [];
                if(step==0){
                    res['keys'].push('Client');
                    res['keys'].push('Projects');
                    res['keys'].push('Hours');
                    res['keys'].push('Resources');
                    res['keys'].push('Devs');
                    res['keys'].push('Qas');
                }
                row.push(['Client',data[item].Client]);
                row.push(['Projects', data[item].Projects]);
                row.push(['Hours', data[item].Hours]);
                row.push(['Resources', data[item].Resources]);
                row.push(['Devs', data[item].Devs]);
                row.push(['Qas', data[item].Qas]);
                
                res['data'].push(row);
                step++;
            }
        }else{
            var step = 0;
            for(var item in data){
                var row = [];
                if(step==0){
                    res['keys'].push('Client');
                    res['keys'].push(selectedSummaryType);
                }                
                row.push(['Client', data[item].Client]);
                row.push([selectedSummaryType, data[item][selectedSummaryType]]);
                
                res['data'].push(row);
                step++;
            }
        } 
        return res;
    },
    
    showErrorToast: function(){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "You have not permission for view this information!",
            "duration": 2000,
            "type": "error"
        });
        toastEvent.fire();
    }
})