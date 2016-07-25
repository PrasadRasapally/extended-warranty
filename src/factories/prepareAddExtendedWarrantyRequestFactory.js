/**
 * @class {PrepareAddExtendedWarrantyRequestFactory}
 */

export default class PrepareAddExtendedWarrantyRequestFactory {

    constructor(){
        
    }
    prepareAddExtendedWarrantyRequest( baseObject ){
        var self = baseObject;
        
        var request = {};
        request.simpleLineItems = [];
        request.compositeLineItems = [];            

        angular.forEach(self.assetsList.simpleLineItems, function(value, key) {
            if(value.selectedPrice){
                value.terms = self.defaultTerm;
                value.price = value.defaultPrice;
                
                delete value.isTermSelected;
                delete value.$$hashKey;

                request.simpleLineItems.push(value);
            }
        });            

        angular.forEach(self.assetsList.compositeLineItems, function(value, key) {
            if(value.selectedPrice){                    
                value.terms = self.defaultTerm;
                value.price = value.defaultPrice;

                delete value.isTermSelected;
                delete value.$$hashKey;

                value.components.forEach(function(val, key){
                    delete val.id;
                    delete val.$$hashKey;
                });

                request.compositeLineItems.push(value);
            }
        });

        request.partnerSaleRegistrationId = self.selectedRecord.id;
        request.facilityName = self.selectedRecord.facilityName;
        request.partnerAccountId = self.selectedRecord.partnerAccountId;
        //request.discountCode = self.discountCoupon;
        request.isSubmitted = false;
        
        return request;
    }
    
    static prepareAddExtendedWarrantyRequestFactory(){
        return new PrepareAddExtendedWarrantyRequestFactory();
    }
}

PrepareAddExtendedWarrantyRequestFactory.prepareAddExtendedWarrantyRequestFactory.$inject = [];