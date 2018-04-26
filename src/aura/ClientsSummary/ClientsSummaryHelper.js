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
            case 'AllForClients':
                action = component.get("c.getSummaryBySerchCheckBoxForClients");
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
                    
                    if(fromWhat == 'All' || fromWhat == 'picklist'){
                        self.createDashboard(component, res['data'][0]);
                    }else if(fromWhat == 'input' || fromWhat == 'AllForClients'){
                        self.createDashboardForSearch(component, res);
                    }
                    
                }else{
                    component.set("v.searchStr", '');
                    component.set("v.resSearch", null);
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
        if(selectedSummaryType =='All'){
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
    },
    
    createDashboard: function(component, dataSource){
        try{
            var res = component.get("v.resSearch")
            if(res.data.length == 0 || res.keys.length == 0 ){
                document.getElementById('DashboardDiv').style.display = 'none';
                return;
            }
            document.getElementById('DashboardDiv').style.display = 'block';
            
            var dataInfo = [];
            var client = '';
            for(var item in dataSource){
                if(dataSource[item][0]=='Client') {
                    client = dataSource[item][1];
                    if(parseInt(dataSource[item][1])>0){
                        dataInfo.push( {'name': dataSource[item][0] ,  'y' :  parseInt(dataSource[item][1])});
                    }
                    continue;
                }
                dataInfo.push( {'name': dataSource[item][0] ,  'y' :  dataSource[item][1]});
            }
            
            var newChart = new Highcharts.chart({
                chart: {
                    renderTo: component.find("container").getElement(),
                    type: 'column'
                },
                title: {
                    text: 'Current report on projects by '+client+' client(s)'
                },
                xAxis: {
                    type: 'category',
                    title: {
                        text: 'Summary category'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Total number of objects for a category'
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    }
                },
                
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                },
                
                "series": [
                    {
                        "name": "Summary type",
                        "colorByPoint": true,
                        "data": dataInfo
                    }
                ] 
            }); 
        } catch(e) {
            //console.log('Error ' + e.name + ":" + e.message + "\n" + e.stack); 
        }
    },
    
    createDashboardForSearch: function(component, dataSource){
        try{
            document.getElementById('DashboardDiv').style.display = 'block';
            var res = component.get("v.resSearch")
            if(res.data.length == 0 || res.keys.length == 0 ){
                document.getElementById('DashboardDiv').style.display = 'none'
                return;
            }
            document.getElementById('DashboardDiv').style.display = 'block';
            
            var categoriesInfo = [];
            for(var i in dataSource['keys']){
                if(dataSource['keys'][i]!='Client') {
                    categoriesInfo.push(dataSource['keys'][i]);            
                } 
            }
            
            var dataInfo = [];
            for(var item in dataSource['data']){
                var obj = {'name': [] ,  'data' :  []};
                for(var i in dataSource['data'][item]){
                    if( dataSource['data'][item][i][0]=='Client'){
                        obj['name'].push(dataSource['data'][item][i][1])
                    }else{
                        obj['data'].push(dataSource['data'][item][i][1])
                    }
                }
                dataInfo.push(obj);
            }
            
            var chart  = new Highcharts.chart( {
                chart: {
                    renderTo: component.find("containerInput").getElement(),
                    type: 'column'
                },
                title: {
                    text: 'Current report on projects by  client(s)'
                },
                
                legend: {
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'vertical'
                },
                
                xAxis: {
                    title: {
                        text: 'Summary category'
                    },
                    categories: categoriesInfo,
                    labels: {
                        x: -10
                    }
                },
                
                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: 'Total number of objects for a category'
                    }
                },
                
                series: dataInfo,
                
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                align: 'center',
                                verticalAlign: 'bottom',
                                layout: 'horizontal'
                            },
                            yAxis: {
                                labels: {
                                    align: 'left',
                                    x: 0,
                                    y: -5
                                },
                                title: {
                                    text: null
                                }
                            },
                            subtitle: {
                                text: null
                            },
                            credits: {
                                enabled: false
                            }
                        }
                    }]
                }
            });
        } catch(e) {
            //console.log('Error ' + e.name + ":" + e.message + "\n" + e.stack); 
        }
    },
    
    settings: function(component, selectedSummaryType, selectedClient, checkbox, isCheck, isCheckForClients, checkboxForClients, searchStr) {
        component.set("v.selectedSummaryType", selectedSummaryType);
        component.set("v.selectedClient", selectedClient);
        component.find("checkbox").set("v.value", checkbox);
        component.set("v.isCheck", isCheck);
        component.set("v.isCheckForClients", isCheckForClients);
        component.find("checkboxForClients").set("v.value", checkboxForClients);
        component.set("v.searchStr", searchStr);
    }
    
})