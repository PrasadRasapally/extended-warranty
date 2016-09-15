/**
 * @class {ApplyDefaultOrSelectedTermsFactory}
 */

export default class ApplyDefaultOrSelectedTermsFactory {

    constructor(){
        
    }
    
    applyDefaultTermsAndPrice( assetsList , termsPriceList ){
        if( assetsList.simpleLineItems.length ){
            assetsList.simpleLineItems.forEach(function( val , ind ) {
                val.defaultTerm = termsPriceList.simpleSerialCode[ ind ].term;
                val.defaultPrice = termsPriceList.simpleSerialCode[ ind ].price;
                val.defaultMaterialNumber = termsPriceList.simpleSerialCode[ ind ].materialNumber;
            });
        }
        
        if( assetsList.compositeLineItems.length ){
            assetsList.compositeLineItems.forEach(function( component , index ) {
                component.defaultTerm = termsPriceList.compositeSerialCode[ index ].term;
                component.defaultPrice = termsPriceList.compositeSerialCode[ index ].price;
                component.defaultMaterialNumber = termsPriceList.compositeSerialCode[ index ].materialNumber;
            });
        }
        
        return assetsList;
    };
    
    /*applySelectedTermsAndPrice( TotalAssetsList , selectedAssetsList, selectedAssetsTermsPriceList ){
        if( TotalAssetsList.simpleLineItems ){
            TotalAssetsList.simpleLineItems.forEach(function( value , index ) {
                if(selectedAssetsList.simpleLineItems.indexOf(value) !== -1){
                    if( selectedAssetsTermsPriceList.simpleSerialCode ){
                        selectedAssetsTermsPriceList.simpleSerialCode.forEach(function( val , ind ) {
                            if( value.serialNumber.substr(0,4) == val.serialNumber ){
                                value.selectedTerms = val.term;
                                value.selectedPrice = val.price;
                                value.materialNumber = val.materialNumber;
                            }
                        });
                    }
                }
            });
        }
        if( TotalAssetsList.compositeLineItems ){
            TotalAssetsList.compositeLineItems.forEach(function( component , index1 ) {
                if(selectedAssetsList.compositeLineItems.indexOf(component) !== -1){
                    if( selectedAssetsTermsPriceList.compositeSerialCode ){
                        selectedAssetsTermsPriceList.compositeSerialCode.forEach(function( value , index2 ) {
                            var counter = 0;
                            component.components.forEach(function( val1 , ind1 ) {
                                value.components.forEach(function( val2 , ind2 ) {
                                    if( val1.serialNumber.substr(0,4) == val2.serialNumber){
                                        counter++;
                                        if( counter == component.components.length ){
                                            counter = 0;
                                            component.selectedTerms = value.term;
                                            component.selectedPrice = value.price;
                                            component.materialNumber = value.materialNumber;
                                        }
                                    }
                                });
                            });
                        });
                    }
                }
            });
        }
        return TotalAssetsList;
    };*/
    
    static applyDefaultOrSelectedTermsFactory(){
        return new ApplyDefaultOrSelectedTermsFactory();
    }
}

ApplyDefaultOrSelectedTermsFactory.applyDefaultOrSelectedTermsFactory.$inject = [];