/**
 * @class {PrepareExtendedWarrantySubmitRequestFactory}
 */

export default class PrepareExtendedWarrantySubmitRequestFactory {

    constructor(){
        
    }
    prepareExtendedWarrantySubmitRequest( baseObject ){
        var self = baseObject , request = {};
        
        request.extendedWarrantyId = self.extendedWarrantyId;
        request.partnerSaleRegistrationId = parseInt(self.selectedRecord.id);
        request.purchaseOrder = self.purchaseOrder;
        request.partnerAccountId = self.accountId;
        request.sapAccountNumber = self.SAPAccountNumber;
        request.totalPrice = self.totalPrice;
        request.discountAppliedPrice = self.discountPrice;
        
        return request;
    }
    
    static prepareExtendedWarrantySubmitRequestFactory(){
        return new PrepareExtendedWarrantySubmitRequestFactory();
    }
}

PrepareExtendedWarrantySubmitRequestFactory.prepareExtendedWarrantySubmitRequestFactory.$inject = [];