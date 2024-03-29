define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', onRequestedInteraction);
    connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
        connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestDataSources');  

    }

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        console.log(interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }
	
    function onRequestedDataSources(dataSources){
        console.log('*** requestedEndpoints ***');
        console.log(dataSources);
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();

       // console.log("dataExtensionName"+dataExtensionName);
        console.log('Save Executed');
        payload['arguments'].execute.inArguments = [
		{"tokens": authTokens},
		 { "Title": "{{Event.943F1CE9-2D1B-4F77-AFD9-9F3FE44DD234.Title}}"},
		   { "Data": "{{Contact.Attribute.PushyAPIDataDictionaryV2.Data}}"},
		   {"DeviceToken": "{{Contact.Attribute.PushyAPIDataDictionaryV2.DeviceToken}}"}
            
        ];
        
        
        payload['metaData'].isConfigured = true;

        console.log(payload);
        
        //call pushy
        
               var settings = {
          "url": "https://api.pushy.me/push?api_key=d7d75e43ed88d5a8a4b27ed84548c78c687c0cf2e2c865e6790e58dd293c5ae5",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({"to":"e726da50548bb85ecc63d0","data":{"title":"Hello World Shashi","body":"Hello World!"},"notification":{"body":"Hello World ✌"}}),
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
            connection.trigger('updateActivity', payload);
        }).fail(function (jqXHR, textStatus) {
            alert('Something went wrong');
        });     
        
        //end call

        
       // connection.trigger('updateActivity', payload);
    }


});
     
