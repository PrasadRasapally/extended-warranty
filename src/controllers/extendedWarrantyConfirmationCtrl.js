export default class ExtendedWarrantyReviewCtrl {

    constructor(
        $scope,
        $location
    ){
        this.selectRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.selectedAssets = JSON.parse(localStorage.getItem('selectedAssets'));
        this.purchaseOrder = localStorage.getItem('purchaseOrder');
        this.submittedDate = localStorage.getItem('submittedDate');
        this.submissionId = localStorage.getItem('extendedWarrantyId');
        
        this.totalPrice = "$400";
        this.discountPrice = "$100";
        this.afterDiscountPrice = "$300";
        this.appliedDiscountCoupon = "1111";
        this.SAPAccountNumber = "123456";
        
        //this.submittedDate = new Date().toLocaleString();
        //this.submissionId = 100011;
    }
}

ExtendedWarrantyReviewCtrl.$inject = [
    '$scope',
    '$location'
];
