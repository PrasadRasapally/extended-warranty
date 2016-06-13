/**
 * @class {PrepareExtendedWarrantyTermsRequestFactory}
 */

export default class PrepareExtendedWarrantyTermsRequestFactory {

    constructor(){
        
    }
    prepareRequest( term , selectedAssetsList ){
        var request = {};
        
        request.term = term;
        
        request.simpleSerialCode = [];
        
        request.compositeSerialCode = [];
        
        if( selectedAssetsList.simpleLineItems.length ){
            selectedAssetsList.simpleLineItems.forEach(function( val , ind ) {
                request.simpleSerialCode.push( {"serialNumber" : val.serialNumber} );
            });
        }
        
        if( selectedAssetsList.compositeLineItems.length ){
            selectedAssetsList.compositeLineItems.forEach(function( component , index ) {
                request.compositeSerialCode.push( {"components" : []} );
                component.components.forEach(function( val , ind ) {
                    request.compositeSerialCode[index].components.push( {"serialNumber" : val.serialNumber} );
                });
            });
        }
        
        return request;
    }
    
    static prepareExtendedWarrantyTermsRequestFactory(){
        return new PrepareExtendedWarrantyTermsRequestFactory();
    }
}

PrepareExtendedWarrantyTermsRequestFactory.prepareExtendedWarrantyTermsRequestFactory.$inject = [];