export default class ExtendedWarrantyReviewCtrl {

    constructor(
        $scope,
        $location,
        $timeout
    ){
        if (!$scope) {
            throw new TypeError('$scope required');
        }
        this._$scope = $scope;
        
        if (!$location) {
            throw new TypeError('$location required');
        }
        this._$location = $location;
        
        if (!$timeout) {
            throw new TypeError('$timeout required');
        }
        this._$timeout = $timeout;
        
        this.selectRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.selectedAssets = JSON.parse(localStorage.getItem('selectedAssets'));
        this.purchaseOrder = localStorage.getItem('purchaseOrder');
        this.submittedDate = localStorage.getItem('submittedDate');
        this.submissionId = localStorage.getItem('extendedWarrantyId');
        this.SAPAccountNumber = localStorage.getItem("SAPAccountNumber");
        this.discountPrice = localStorage.getItem("discountPrice");
        this.isDiscountApplied = localStorage.getItem("discountPrice");
        
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
        
        this.afterDiscountPrice = this.totalPrice - ( this.discountPrice || 0 );
        
        this._$timeout(function(){ localStorage.clear(); }, 2000);        
    };
}

ExtendedWarrantyReviewCtrl.$inject = [
    '$scope',
    '$location',
    '$timeout'
];
