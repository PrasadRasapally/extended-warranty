import PromptOnCancelTemplate from './templates/promptOnCancel.html!text';
import PromptOnEmptyRequestTemplate  from './templates/promptOnEmptyRequest.html!text';

export default class ExtendedWarrantySelectionCtrl {
    
    _$scope;
    
    _$uibModal;
    
    _$location;
    
    _extendedWarrantyService;
    
    _termsPriceService;
    
    _prepareAddExtendedWarrantyRequestFactory;
    
    _prepareTermsPriceRequestFactory;
    
    _applyDefaultOrSelectedTermsFactory;
    
    _discountCodeService;

    constructor(
        $scope,
        $uibModal,
        $location,
        sessionManagerService,
        identityService,
        extendedWarrantyService,
        termsPriceService,
        prepareAddExtendedWarrantyRequestFactory,
        prepareTermsPriceRequestFactory,
        applyDefaultOrSelectedTermsFactory,
        discountCodeService
    ){
        /**
         * initialization
         */
        if (!$scope) {
            throw new TypeError('$scope required');
        }
        this._$scope = $scope;
        
        if (!$uibModal) {
            throw new TypeError('$uibModal required');
        }
        this._$uibModal = $uibModal;
        
        if (!$location) {
            throw new TypeError('$location required');
        }
        this._$location = $location;
        
        if (!extendedWarrantyService) {
            throw new TypeError('extendedWarrantyService required');
        }
        this._extendedWarrantyService = extendedWarrantyService;
        
        if (!termsPriceService) {
            throw new TypeError('termsPriceService required');
        }
        this._termsPriceService = termsPriceService;
        
        if (!prepareAddExtendedWarrantyRequestFactory) {
            throw new TypeError('prepareAddExtendedWarrantyRequestFactory required');
        }
        this._prepareAddExtendedWarrantyRequestFactory = prepareAddExtendedWarrantyRequestFactory;
        
        if (!prepareTermsPriceRequestFactory) {
            throw new TypeError('prepareTermsPriceRequestFactory required');
        }
        this._prepareTermsPriceRequestFactory = prepareTermsPriceRequestFactory;
        
        if (!applyDefaultOrSelectedTermsFactory) {
            throw new TypeError('applyDefaultOrSelectedTermsFactory required');
        }
        this._applyDefaultOrSelectedTermsFactory = applyDefaultOrSelectedTermsFactory;
        
        if (!discountCodeService) {
            throw new TypeError('discountCodeService required');
        }
        this._discountCodeService = discountCodeService;
        
        this.loader = true;
        this.navigatedFrom = localStorage.getItem('navigatedFrom');
        this.selectedRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        
        sessionManagerService.getAccessToken()
            .then( accessToken => {
                this.accessToken = accessToken;
                    this.loadAssets( this.accessToken );
                    this.loadTermsList( this.accessToken );
                }
            ); 
        
        this.assetsList = {};
        this.tempSelectList = [];        
        this.defaultTerm = "3/1";        
        this.selectedTerms = "3/1";
        this.totalPrice = 0;
    }
    /**
     * methods
     */
    loadAssets( accessToken ){
        if( this.navigatedFrom == "registrationPage" ) {
            this.assetsList.simpleLineItems = this.selectedRecord.simpleLineItems;
            this.assetsList.compositeLineItems = this.selectedRecord.compositeLineItems;
        } else if( this.navigatedFrom == "reviewPage" ) {
            this.assetsList = JSON.parse(localStorage.getItem('assetsList'));
            this.setTempSelectedAssets( this.assetsList );
            this.calculateTotalPrice();
            
            this.discountCoupon = localStorage.getItem("discountCoupon");
            this.disableDiscountCoupon = true;
        }
    };
    
    loadTermsList( accessToken ){
        this._termsPriceService.getAvailableTerms( accessToken )
            .then( terms => {
                    this.terms = terms;
                    angular.forEach(this.terms , function(value, key) {
                        value.label = value._term;
                    });
                    if( this.navigatedFrom == "registrationPage" ){
                        this.loadDefaultTermsAndPrice( this.defaultTerm );
                    } else {
                        this.loader = false;
                    }
                }
            )
    };
    
    loadDefaultTermsAndPrice( term ){
        var request = this._prepareTermsPriceRequestFactory.prepareTermsPriceRequest( term , this.assetsList );
        this._termsPriceService.searchExtendedWarrantyTermsPrice( request , this.accessToken )
            .then( response => {
                    if( response.simpleSerialCode || response.compositeSerialCode){
                        this.assetsList = this._applyDefaultOrSelectedTermsFactory.applyDefaultTermsAndPrice( this.assetsList , response );
                    }
                    this.loader = false;
                }
            )
    };
    
    selectAllProducts(){
        var self = this;
        if( this.assetsList.simpleLineItems.length ){
            angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
                value.selectedTerms = value.defaultTerm
                value.selectedPrice = value.defaultPrice;
                value.isTermSelected = value.selectedPrice ? true : false;
            });
        }
        if( this.assetsList.compositeLineItems.length ){
            angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
                value.selectedTerms = value.defaultTerm
                value.selectedPrice = value.defaultPrice;
                value.isTermSelected = value.selectedPrice ? true : false;
            });
        }
        this.calculateTotalPrice();
    };
    
    selectNoProducts(){            
        angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
            value.selectedTerms = undefined;
            value.selectedPrice = undefined;
            value.isTermSelected = false;
        });
        angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
            value.selectedTerms = undefined;
            value.selectedPrice = undefined;
            value.isTermSelected = false;
        });
        this.calculateTotalPrice();
    };
    
    selectOrDeselectAsset( asset ){
        if(!asset.isSelected && this.tempSelectList.indexOf(asset) == -1){
            this.tempSelectList.push( asset );
            asset.isSelected = true;
        } else {
            if(this.tempSelectList.indexOf(asset) !== -1)
            this.tempSelectList.splice( this.tempSelectList.indexOf(asset) , 1 );
            asset.isSelected = false;
        }
    };
    
    removeAsset( asset ){ 
        asset.selectedTerms = undefined;
        asset.selectedPrice = undefined;
        asset.isTermSelected = false;
        this.calculateTotalPrice();
    };
    
    applyTermAndPrice(){
        var self = this, selectedAssetsList;        
        this.loader = true;
        
        if(this.tempSelectList.length > 0){            
            selectedAssetsList = this._prepareTermsPriceRequestFactory.prepareSelectedAssetsList( this.tempSelectList );
            
            var request = this._prepareTermsPriceRequestFactory.prepareTermsPriceRequest( this.selectedTerms , selectedAssetsList );
            
            this._termsPriceService.searchExtendedWarrantyTermsPrice( request , this.accessToken )
                .then( response => {
                        this.assetsList = this._applyDefaultOrSelectedTermsFactory.applySelectedTermsAndPrice( this.assetsList , selectedAssetsList, response );
                        this.calculateTotalPrice();
                        this.loader = false;
                    }
                )            
        } else {
            this.defaultTerm = this.selectedTerms;
            this.defaultPrice = this.selectedPrice;
            this.loadDefaultTermsAndPrice( this.defaultTerm );
        }
    };
    
    cancelSelection(){
        this.modalInstance = this._$uibModal.open({
            animation : true,
            scope : this._$scope,
            template : PromptOnCancelTemplate,
            size : 'sm'
        });

        this.confirmCancelSelection = function(){                
            this._$location.path('/');
        };

        this.revertCancelSelection = function(){
            this.modalInstance.dismiss('cancel');
        }
    };
    
    calculateTotalPrice(){
        var self = this;
        self.totalPrice = 0;
        angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
            if(value.selectedPrice && value.selectedPrice != "NA"){
                self.totalPrice += value.selectedPrice;
            }
        });
        angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
            if(value.selectedPrice && value.selectedPrice != "NA"){
                self.totalPrice += value.selectedPrice;
            }
        });
    };
    
    gotoReview(){
        var request = this._prepareAddExtendedWarrantyRequestFactory.prepareAddExtendedWarrantyRequest( this ); 
        
        if( !request.simpleLineItems.length && !request.compositeLineItems.length ){
            this.modalInstance = this._$uibModal.open({
                animation : true,
                scope : this._$scope,
                template : PromptOnEmptyRequestTemplate,
                size : 'md'
            });

            this.closeEmptyRequestPrompt = function(){
                this.modalInstance.dismiss('cancel');
            }
        } 
        else {
            localStorage.setItem('assetsList' , JSON.stringify( this.assetsList ));            

            this.loader = true;
            console.log("request", request)
            if( this.navigatedFrom == "registrationPage"){

                this._extendedWarrantyService.addExtendedWarranty( request , this.accessToken)
                    .then( response => {
                            this.loader = false;
                            localStorage.setItem('selectedAssets' , JSON.stringify( request ));
                            localStorage.setItem('extendedWarrantyId' , response);
                            this._$location.path('/extendedWarrantyReview');
                        }
                    );
            } else {
                request.extendedWarrantyId = localStorage.getItem("extendedWarrantyId");
                this._extendedWarrantyService.updateExtendedWarranty( request.extendedWarrantyId, request , this.accessToken)
                    .then( response => {
                            this.loader = false;
                            localStorage.setItem('selectedAssets' , JSON.stringify( request ));
                            localStorage.setItem('extendedWarrantyId' , response);
                            this._$location.path('/extendedWarrantyReview');
                        }
                    );
            }
        }
    };
    
    setTempSelectedAssets( assetsList ){
        var self = this;
        this.tempSelectList.length = 0;
        if(assetsList.simpleLineItems.length){
            angular.forEach(assetsList.simpleLineItems, function(value, key) {
                if( value.isSelected ) { self.tempSelectList.push( value ); }
                if( value.selectedPrice){ value.isTermSelected = true; }
            });
        }
        if(assetsList.compositeLineItems.length){
            angular.forEach(assetsList.compositeLineItems, function(value, key) {
                if( value.isSelected ) { self.tempSelectList.push( value ); }
                if( value.selectedPrice){ value.isTermSelected = true; }
            });
        }
    };
    
    getDiscountAmountOrPercentage(){
        if( this.navigatedFrom == "registrationPage" ){
            this.chechDiscountCouponStatus();
        } else if( this.navigatedFrom == "reviewPage" ){
            /*this._extendedWarrantyService.checkIsDiscountCouponApplied( this.selectedRecord.id, this.accessToken)
                .then( response => {
                        this.isDiscountCouponApplied = response;
                        localStorage.setItem("isDiscountCouponApplied", this.isDiscountCouponApplied);
                        if( this.isDiscountCouponApplied ){
                            
                        } else {
                            this.chechDiscountCouponStatus();
                        }
                    }
                )*/ 
            this.disableDiscountCoupon = true;
        }
    };
    
    chechDiscountCouponStatus(){
        if(this.discountCoupon){
            this.loader = true;
            this._discountCodeService.getDiscountCode( this.discountCoupon , this.accessToken )
                .then( response => {
                        this.discountCouponData = response;
                        if(response.type == "$"){
                            this.discountPrice = response.value;
                            this.discountCouponStatus = true;
                            this.discountCouponStatusChecked = true;
                            localStorage.setItem("discountPrice", this.discountPrice);
                        } else if(response.type == "%"){
                            this.discountPrice = this.totalPrice * (response.value / 100);
                            if( this.discountPrice > this.discountCouponData.maxValue && this.discountCouponData.maxValue ){
                                this.discountPrice = this.discountCouponData.maxValue;
                            }
                            this.discountCouponStatus = true;
                            this.discountCouponStatusChecked = true;
                            localStorage.setItem("discountPrice", this.discountPrice);
                        } 
                        this.loader = false;
                    }
                ).catch( error => {
                        console.log("error code ", error );
                        this.discountCouponStatus = false;
                        this.discountCouponStatusChecked = true;
                        this.loader = false;
                    }   
                )
            
            localStorage.setItem("discountCoupon", this.discountCoupon);
        }
    };
}

ExtendedWarrantySelectionCtrl.$inject = [
    '$scope',
    '$uibModal',
    '$location',
    'sessionManagerService',
    'identityService',
    'extendedWarrantyService',
    'termsPriceService',
    'prepareAddExtendedWarrantyRequestFactory',
    'prepareTermsPriceRequestFactory',
    'applyDefaultOrSelectedTermsFactory',
    'discountCodeService'
];
