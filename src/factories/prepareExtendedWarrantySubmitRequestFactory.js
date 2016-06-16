/**
 * @class {PrepareExtendedWarrantySubmitRequestFactory}
 */

export default class PrepareExtendedWarrantySubmitRequestFactory {

    constructor(){
        
    }
    prepareExtendedWarrantySubmitRequest(extendedWarrantyId , partnerSaleRegistrationId, purchaseOrder, accountId, SAPAccountNumber ){
        var request = {};        
        
        request.extendedWarrantyId = extendedWarrantyId;
        request.partnerSaleRegistrationId = parseInt(partnerSaleRegistrationId);
        request.purchaseOrder = purchaseOrder;
        request.partnerAccountId = accountId;
        request.sapAccountNumber = SAPAccountNumber;
        
        return request;
    }
    
    static prepareExtendedWarrantySubmitRequestFactory(){
        return new PrepareExtendedWarrantySubmitRequestFactory();
    }
}

PrepareExtendedWarrantySubmitRequestFactory.prepareExtendedWarrantySubmitRequestFactory.$inject = [];