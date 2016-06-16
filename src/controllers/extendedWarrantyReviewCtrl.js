export default class ExtendedWarrantyReviewCtrl {
    
    _$scope;
    
    _$location;
    
    _extendedWarrantyService;
    
    _prepareExtendedWarrantySubmitRequestFactory;

    constructor(
        $scope,
        $location,
        sessionManagerService,
        identityService,
        extendedWarrantyService,
        prepareExtendedWarrantySubmitRequestFactory
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
        
        if (!extendedWarrantyService) {
            throw new TypeError('extendedWarrantyService required');
        }
        this._extendedWarrantyService = extendedWarrantyService;
        
        if (!prepareExtendedWarrantySubmitRequestFactory) {
            throw new TypeError('prepareExtendedWarrantySubmitRequestFactory required');
        }
        this._prepareExtendedWarrantySubmitRequestFactory = prepareExtendedWarrantySubmitRequestFactory;
        
        this.loader = true;        
        
        this.selectedRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.selectedAssets = JSON.parse(localStorage.getItem('selectedAssets'));
        this.extendedWarrantyId = localStorage.getItem('extendedWarrantyId');
        
        sessionManagerService.getAccessToken()
            .then( accessToken => {
                this.accessToken = accessToken;
                identityService.getUserInfo( accessToken )
                    .then( userInfo => {
                            this.accountId = userInfo._account_id;
                            this.loader = false;
                        }
                    )
                }
            );
        
        this.isDiscountApplied = false;
        this.discountPrice = "$100";        
        this.afterDiscountPrice = "$300";
        this.appliedDiscountCoupon = "1111";
        this.SAPAccountNumber = "163687";
        
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
        var self = this;
        if( this.purchaseOrder ){
            this.loader = true;
            localStorage.setItem('purchaseOrder' , this.purchaseOrder);
            
            var request = this._prepareExtendedWarrantySubmitRequestFactory.prepareExtendedWarrantySubmitRequest(this.extendedWarrantyId, this.selectedRecord.id, this.purchaseOrder, this.accountId, this.SAPAccountNumber);
            
            //console.log(request);
            
            this._extendedWarrantyService.submitExtendedWarranty( request, this.accessToken )
                .then( response => {
                        localStorage.setItem('submittedDate' , response.submittedTimestamp);
                
                        //console.log(response);
                        this.loader = false;

                        self._$location.path('/extendedWarrantyConfirmation');
                    }
                )
        } else {
            this.invalidPurchaseOrder = true;
        }
    };
}

ExtendedWarrantyReviewCtrl.$inject = [
    '$scope',
    '$location',    
    'sessionManagerService',
    'identityService',
    'extendedWarrantyService',
    'prepareExtendedWarrantySubmitRequestFactory'
];
