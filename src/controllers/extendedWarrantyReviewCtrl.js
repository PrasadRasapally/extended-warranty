export default class ExtendedWarrantyReviewCtrl {
    
    _$scope;
    
    _$location;
    
    _partnerRepService;
    
    _extendedWarrantyService;
    
    _prepareExtendedWarrantySubmitRequestFactory;
    
    _discountCodeService;

    constructor(
        $scope,
        $location,
        sessionManagerService,
        identityService,
        partnerRepService,
        extendedWarrantyService,
        prepareExtendedWarrantySubmitRequestFactory,
        discountCodeService
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
        
        if (!discountCodeService) {
            throw new TypeError('discountCodeService required');
        }
        this._discountCodeService = discountCodeService;
        
        this.loader = true;  
        
        var self = this;
        
        this.selectedRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.selectedAssets = JSON.parse(localStorage.getItem('selectedAssets'));
        this.extendedWarrantyId = localStorage.getItem('extendedWarrantyId');
        this.discountCoupon = localStorage.getItem("discountCoupon");
        
        sessionManagerService.getAccessToken()
            .then( accessToken => {
                    this.accessToken = accessToken;
            
                    this.calculateTotalPrice();        

                    sessionManagerService.getUserInfo()
                        .then( result => {
                                this.loader = true;
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
        
        self.calculateDiscountPrice( self.totalPrice , self.discountCoupon );
    };
    
    calculateDiscountPrice( totalPrice , discountCoupon ){
        var self = this;
        if(discountCoupon){
            self.loader = true;
            self._discountCodeService.getDiscountInfo( discountCoupon , self.accessToken )
                .then( response => {
                        if(response.type == "$"){
                            self.discountPrice = response.value; 
                            self.afterDiscountPrice = self.totalPrice - ( self.discountPrice || 0 );
                        } else if(response.type == "%"){
                            self.discountPrice = parseFloat(totalPrice * (response.value / 100)).toFixed(2);
                            if( response.maxValue && self.discountPrice > response.maxValue ){
                                self.discountPrice = response.maxValue.toFixed(2);
                            }
                            self.totalPrice = self.totalPrice.toFixed(2);
                            self.afterDiscountPrice = (self.totalPrice - ( self.discountPrice || 0 )).toFixed(2);
                        }                        
                        self.isDiscountApplied = true;
                        localStorage.setItem("isDiscountApplied" , self.isDiscountApplied);
                        localStorage.setItem("discountPrice" , self.discountPrice);
                        self.loader = false;
                    }
                ).catch( error => {
                        console.log("error code ", error );
                        self.loader = false;
                    }   
                )
        }
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
                        localStorage.setItem('submittedDate' , response.submittedTimeStamp);
                
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
    'prepareExtendedWarrantySubmitRequestFactory',
    'discountCodeService'
];
