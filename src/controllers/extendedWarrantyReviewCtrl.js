export default class ExtendedWarrantyReviewCtrl {

    constructor(
        $scope,
        $location
    ){
        this.selectedRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.selectedAssets = JSON.parse(localStorage.getItem('selectedAssets'));
        
        //this.totalPrice = "$400";
        this.discountPrice = "$100";
        this.afterDiscountPrice = "$300";
        this.appliedDiscountCoupon = "1111";
        this.SAPAccountNumber = "123456";
        
        this.calculateTotalPrice = function(){
            var self = this;
            self.totalPrice = 0;
            angular.forEach(this.selectedAssets.simpleLineItems, function(value, key) {
                self.totalPrice += value.selectedPrice;
            });
            angular.forEach(this.selectedAssets.compositeLineItems, function(value, key) {
                self.totalPrice += value.selectedPrice;
            });
        };
        
        this.gotoConfirmationPage = function(){
            if(this.purchaseOrder){
                localStorage.setItem('puschaseOrder' , this.purchaseOrder);
                $location.path('/extendedWarrantyConfirmation');
            } else {
                this.invalidPurchaseOrder = true;
            }
        }
        
        this.calculateTotalPrice();
    }
}

ExtendedWarrantyReviewCtrl.$inject = [
    '$scope',
    '$location'
];
