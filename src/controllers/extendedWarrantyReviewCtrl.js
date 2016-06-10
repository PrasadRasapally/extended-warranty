export default class ExtendedWarrantyReviewCtrl {
    
    _$scope;
    
    _$location;

    constructor(
        $scope,
        $location
    ){        
        /**
         * initialization
         */
        if (!$scope) {
            throw new TypeError('$scope required');
        }
        this._$scope = $scope;
        
        if (!$location) {
            throw new TypeError('$location required');
        }
        this._$location = $location;
        
        this.selectedRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.selectedAssets = JSON.parse(localStorage.getItem('selectedAssets'));
        
        //this.totalPrice = "$400";
        this.discountPrice = "$100";
        this.afterDiscountPrice = "$300";
        this.appliedDiscountCoupon = "1111";
        this.SAPAccountNumber = "123456";
        
        this.calculateTotalPrice();
    }
    /**
     * methods
     */
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
    
    editSelectionList(){
        localStorage.setItem('navigatedFrom' , 'reviewPage');
    };
    
    gotoConfirmationPage(){
        if(this.purchaseOrder){
            localStorage.setItem('puschaseOrder' , this.purchaseOrder);
            this._$location.path('/extendedWarrantyConfirmation');
        } else {
            this.invalidPurchaseOrder = true;
        }
    };
}

ExtendedWarrantyReviewCtrl.$inject = [
    '$scope',
    '$location'
];
