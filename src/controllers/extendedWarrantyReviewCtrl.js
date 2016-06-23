export default class ExtendedWarrantyReviewCtrl {
    
    _$scope;
    
    _$location;
    
    _partnerRepService;
    
    _extendedWarrantyService;
    
    _prepareExtendedWarrantySubmitRequestFactory;

    constructor(
        $scope,
        $location,
        sessionManagerService,
        identityService,
        partnerRepService,
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
        
        if (!partnerRepService) {
            throw new TypeError('partnerRepService required');
        }
        this._partnerRepService = partnerRepService;
        
        if (!extendedWarrantyService) {
            throw new TypeError('extendedWarrantyService required');
        }
        this._extendedWarrantyService = extendedWarrantyService;
        
        if (!prepareExtendedWarrantySubmitRequestFactory) {
            throw new TypeError('prepareExtendedWarrantySubmitRequestFactory required');
        }
        this._prepareExtendedWarrantySubmitRequestFactory = prepareExtendedWarrantySubmitRequestFactory;
        
        this.loader = true;  
        
        var self = this;
        
        this.selectedRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.selectedAssets = JSON.parse(localStorage.getItem('selectedAssets'));
        this.extendedWarrantyId = localStorage.getItem('extendedWarrantyId');
        //this.discountCoupon = localStorage.getItem("discountCoupon");
        this.discountPrice = localStorage.getItem("discountPrice");
        this.isDiscountApplied = localStorage.getItem("discountPrice");
        
        sessionManagerService.getAccessToken()
            .then( accessToken => {
                    this.accessToken = accessToken;

                    sessionManagerService.getUserInfo()
                        .then( result => {
                                this._partnerRepService
                                .getDealerRep(result._sub , accessToken)
                                    .then( response => {
                                            this.SAPAccountNumber = response._sapAccountNumber;
                                            localStorage.setItem("SAPAccountNumber", this.SAPAccountNumber);
                                            this.loader = false;
                                        }
                                    )
                            }
                        )

                    identityService.getUserInfo( accessToken )
                        .then( userInfo => {
                                this.accountId = userInfo._account_id;
                            }
                        )
                }
            );
        
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
        
        this.afterDiscountPrice = this.totalPrice - ( this.discountPrice || 0 );
    };
    
    editSelectionList(){
        localStorage.setItem('navigatedFrom' , 'reviewPage');
    };
    
    gotoConfirmationPage(){
        var self = this;
        if( this.purchaseOrder ){
            this.loader = true;
            localStorage.setItem('purchaseOrder' , this.purchaseOrder);
            
            var request = this._prepareExtendedWarrantySubmitRequestFactory.prepareExtendedWarrantySubmitRequest( this );
            
            
            this._extendedWarrantyService.submitExtendedWarranty( request, this.accessToken )
                .then( response => {
                        localStorage.setItem('submittedDate' , response.submittedTimestamp);
                
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
    'partnerRepService',
    'extendedWarrantyService',
    'prepareExtendedWarrantySubmitRequestFactory'
];
