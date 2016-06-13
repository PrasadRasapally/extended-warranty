/**
 * @class {PrepareExtendedWarrantySubmitRequestFactory}
 */

export default class PrepareExtendedWarrantySubmitRequestFactory {

    constructor(){
        
    }
    prepareExtendedWarrantySubmitRequest( extendedWarrantyId , purchaseOrder, accountId, SAPAccountNumber ){
        var request = {};
        
        request.extendedWarrantyId = extendedWarrantyId;
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