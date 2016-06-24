/**
 * @class {PrepareTermsPriceRequestFactory}
 */

export default class PrepareTermsPriceRequestFactory {

    constructor(){
        
    }
    prepareTermsPriceRequest( term , selectedAssetsList ){
        var request = {};
        
        request.term = term.split(' ')[1];
        
        request.simpleSerialCode = [];
        
        request.compositeSerialCode = [];
        
        if( selectedAssetsList.simpleLineItems.length ){
            selectedAssetsList.simpleLineItems.forEach(function( val , ind ) {
                request.simpleSerialCode.push( {"serialNumber" : val.serialNumber.substr(0,4)} );
            });
        }
        
        if( selectedAssetsList.compositeLineItems.length ){
            selectedAssetsList.compositeLineItems.forEach(function( component , index ) {
                request.compositeSerialCode.push( {"components" : []} );
                component.components.forEach(function( val , ind ) {
                    request.compositeSerialCode[index].components.push( {"serialNumber" : val.serialNumber.substr(0,4)} );
                });
            });
        }
        
        return request;
    };
    
    prepareSelectedAssetsList( selectedAssets ){
        var selectedAssetsList = {};
        selectedAssetsList.simpleLineItems = [];
        selectedAssetsList.compositeLineItems = [];
        
        selectedAssets.forEach(function( value , index ) {
            if(value.components){
                selectedAssetsList.compositeLineItems.push( value );
            } else {
                selectedAssetsList.simpleLineItems.push( value );
            }
        });
        
        return selectedAssetsList;
    };
    
    static prepareTermsPriceRequestFactory(){
        return new PrepareTermsPriceRequestFactory();
    }
}

PrepareTermsPriceRequestFactory.prepareTermsPriceRequestFactory.$inject = [];