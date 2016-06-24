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
        this.isDiscountApplied = localStorage.getItem("isDiscountApplied");
        
        this.calculateTotalPrice();
        
        this.submittedDate = this.convertUTCDateToLocalDate(new Date(this.submittedDate)).toLocaleString();
    }    
    calculateTotalPrice(){
        var self = this;
        self.totalPrice = 0;
        angular.forEach(self.selectedAssets.simpleLineItems, function(value, key) {
            self.totalPrice += value.selectedPrice;
        });
        angular.forEach(self.selectedAssets.compositeLineItems, function(value, key) {
            self.totalPrice += value.selectedPrice;
        });
        
        this.afterDiscountPrice = this.totalPrice - ( this.discountPrice || 0 );
        
        if(this.discountPrice % 1 !== 0){
            this.totalPrice = this.totalPrice.toFixed(2);
            this.afterDiscountPrice = this.afterDiscountPrice.toFixed(2);
        }
        
        this._$timeout(function(){ localStorage.clear(); }, 3000);
    };
    
    convertUTCDateToLocalDate( date ) {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var minutes = date.getMinutes() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset + minutes);
        return newDate;
    };
}

ExtendedWarrantyReviewCtrl.$inject = [
    '$scope',
    '$location',
    '$timeout'
];
