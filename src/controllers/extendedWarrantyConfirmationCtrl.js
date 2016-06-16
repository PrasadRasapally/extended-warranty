export default class ExtendedWarrantyReviewCtrl {

    constructor(
        $scope,
        $location
    ){
        if (!$scope) {
            throw new TypeError('$scope required');
        }
        this._$scope = $scope;
        
        if (!$location) {
            throw new TypeError('$location required');
        }
        this._$location = $location;
        
        this.selectRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.selectedAssets = JSON.parse(localStorage.getItem('selectedAssets'));
        this.purchaseOrder = localStorage.getItem('purchaseOrder');
        this.submittedDate = localStorage.getItem('submittedDate');
        this.submissionId = localStorage.getItem('extendedWarrantyId');
        
        this.isDiscountApplied = false;
        this.discountPrice = "$100";
        this.afterDiscountPrice = "$300";
        this.SAPAccountNumber = "123456";
        
        this.calculateTotalPrice();
    }
    calculateTotalPrice(){
        var self = this;
        self.totalPrice = 0;
        angular.forEach(this.selectedAssets.simpleLineItems, function(value, key) {
            self.totalPrice += value.selectedPrice;
        });
        angular.forEach(this.selectedAssets.compositeLineItems, function(value, key) {
            self.totalPrice += value.selectedPrice;
        });
    };
}

ExtendedWarrantyReviewCtrl.$inject = [
    '$scope',
    '$location'
];
