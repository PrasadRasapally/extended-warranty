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
    
    applyDefaultTermsAndPrice( assetsList , termsPriceList ){
        if( assetsList.simpleLineItems.length ){
            assetsList.simpleLineItems.forEach(function( val , ind ) {
                val.defaultTerm = termsPriceList.simpleSerialCode[ ind ].term;
                val.defaultPrice = termsPriceList.simpleSerialCode[ ind ].price;
            });
        }
        
        if( assetsList.compositeLineItems.length ){
            assetsList.compositeLineItems.forEach(function( component , index ) {
                component.defaultTerm = termsPriceList.compositeSerialCode[ index ].term;
                component.defaultPrice = termsPriceList.compositeSerialCode[ index ].price;
            });
        }
        
        return assetsList;
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
    
    applySelectedTermsAndPrice( TotalAssetsList , selectedAssetsTermsPriceList ){        
        if( TotalAssetsList.simpleLineItems ){
            TotalAssetsList.simpleLineItems.forEach(function( value , index ) {
                if( selectedAssetsTermsPriceList.simpleSerialCode ){
                    selectedAssetsTermsPriceList.simpleSerialCode.forEach(function( val , ind ) {
                        if( value.serialNumber.substr(0,4) == val.serialNumber ){
                            value.selectedTerms = val.term;
                            value.selectedPrice = val.price;
                            value.isTermSelected = true;
                        }
                    });
                }
            });
        }
        if( TotalAssetsList.compositeLineItems ){
            TotalAssetsList.compositeLineItems.forEach(function( component , index1 ) {
                if( selectedAssetsTermsPriceList.compositeSerialCode ){
                    selectedAssetsTermsPriceList.compositeSerialCode.forEach(function( value , index2 ) {
                        component.components.forEach(function( val1 , ind1 ) {
                            value.components.forEach(function( val2 , ind2 ) {
                                if( val1.serialNumber.substr(0,4) == val2.serialNumber){
                                    component.selectedTerms = value.term;
                                    component.selectedPrice = value.price;
                                }
                            });
                        });
                    });
                }
            });
        }
        return TotalAssetsList;
    };
    
    static prepareExtendedWarrantyTermsRequestFactory(){
        return new PrepareExtendedWarrantyTermsRequestFactory();
    }
}

PrepareExtendedWarrantyTermsRequestFactory.prepareExtendedWarrantyTermsRequestFactory.$inject = [];