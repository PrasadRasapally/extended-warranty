import PromptOnCancelTemplate from './templates/promptOnCancel.html!text';
import PromptOnEmptyRequestTemplate  from './templates/promptOnEmptyRequest.html!text';

export default class ExtendedWarrantySelectionCtrl {
    
    _$scope;
    
    _$q;
    
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
        $q,
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
        
        if (!$q) {
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if (!$uibModal) {
            throw new TypeError('$uibModal required');
        }
        this._$uibModal = $uibModal;
        
        if (!$location) {
            throw new TypeError('$location required');
        }
        this._$location = $location;
        
        if (!identityService) {
            throw new TypeError('identityService required');
        }
        this._identityService = identityService;
        
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
                    this._identityService.getUserInfo( this.accessToken )
                        .then( userInfo => {
                                this.userInfo = userInfo;                                
                    
                                this.loadAssets( this.accessToken );
                                this.loadTermsList( this.accessToken );
                            }
                        )
                }
            ); 
        
        this.assetsList = {};
        //this.tempSelectList = []; 
        this.defaultTerm = "EW 3/1";        
        this.selectedTerms = "EW 3/1";
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
			
            this.calculateTotalPrice(); 
			
            this.discountCoupon = localStorage.getItem("discountCoupon");
			
        } else if( this.navigatedFrom == "commercialRegistration" ){
			
			this.selectedRecord = JSON.parse(localStorage.getItem('extendedWarrantyAssets'));
			
			this.assetsList.simpleLineItems = this.selectedRecord.simpleLineItems;
			
            this.assetsList.compositeLineItems = this.selectedRecord.compositeLineItems;
			
			localStorage.setItem('selectedRecord' , JSON.stringify(this.selectedRecord));
			
		}
    };
    
    loadTermsList( accessToken ){
        this._termsPriceService.getAvailableTerms( accessToken )
            .then( terms => {
                    this.terms = terms;
                    angular.forEach(this.terms , function(value, key) {
                        value.label = value._term;
                    });
                    if( this.navigatedFrom == "registrationPage" || this.navigatedFrom == "commercialRegistration" ){
                        this.loadDefaultTermsAndPrice( this.defaultTerm );
                    } else {
                        this.loader = false;
                    }
                }
            )
    };
    
    loadDefaultTermsAndPrice( term ){
        var request = this._prepareTermsPriceRequestFactory.prepareTermsPriceRequest( term , this.assetsList );
        console.log( "Term Price request " , request );
        this._termsPriceService.searchExtendedWarrantyTermsPrice( request , this.accessToken )
            .then( response => {
                    console.log( "Term Price response " , response );
                    if( response.simpleSerialCode || response.compositeSerialCode){
                        this.assetsList = this._applyDefaultOrSelectedTermsFactory.applyDefaultTermsAndPrice( this.assetsList , response );
                    }
                    this.loader = false;
                }
            ).catch( error => {
                    console.log( error );
                    this.loader = false;
                }
            )
    };
    
    selectAllProducts(){
        if( this.assetsList.simpleLineItems.length ){
            angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
                value.selectedTerms = value.defaultTerm
                value.selectedPrice = value.defaultPrice;
                value.materialNumber = value.defaultMaterialNumber;
            });
        }
        if( this.assetsList.compositeLineItems.length ){
            angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
                value.selectedTerms = value.defaultTerm
                value.selectedPrice = value.defaultPrice;
                value.materialNumber = value.defaultMaterialNumber;
            });
        }
        this.calculateTotalPrice();
    };
    
    selectNoProducts(){            
        angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
            value.selectedTerms = undefined;
            value.selectedPrice = undefined;
            value.materialNumber = undefined;
        });
        angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
            value.selectedTerms = undefined;
            value.selectedPrice = undefined;
            value.materialNumber = undefined;
        });
        this.calculateTotalPrice();
    };
    
    /*selectOrDeselectAsset( asset ){
        if(!asset.isSelected && this.tempSelectList.indexOf(asset) == -1){
            this.tempSelectList.push( asset );
            asset.isSelected = true;
        } else {
            if(this.tempSelectList.indexOf(asset) !== -1)
            this.tempSelectList.splice( this.tempSelectList.indexOf(asset) , 1 );
            asset.isSelected = false;
        }
    };*/
    
    addAsset( asset ){ 
        asset.selectedTerms = asset.defaultTerm;
        asset.selectedPrice = asset.defaultPrice;
        asset.materialNumber = asset.defaultMaterialNumber;
        
        this.calculateTotalPrice();
    };
    
    removeAsset( asset ){ 
        asset.selectedTerms = undefined;
        asset.selectedPrice = undefined;
        //asset.isTermSelected = false;
        this.calculateTotalPrice();
    };
    
    applyTermAndPrice(){
        /*var self = this, selectedAssetsList;        
        this.loader = true;
        
        if(this.tempSelectList.length > 0){            
            selectedAssetsList = this._prepareTermsPriceRequestFactory.prepareSelectedAssetsList( this.tempSelectList );
            
            var request = this._prepareTermsPriceRequestFactory.prepareTermsPriceRequest( this.selectedTerms , selectedAssetsList );
            
            this._termsPriceService.searchExtendedWarrantyTermsPrice( request , this.accessToken )
                .then( response => {
                        console.log("Pricing List ", response );
                        this.assetsList = this._applyDefaultOrSelectedTermsFactory.applySelectedTermsAndPrice( this.assetsList , selectedAssetsList, response );
                        this.calculateTotalPrice();
                        this.loader = false;
                    }
                )            
        } else {*/
            this.defaultTerm = this.selectedTerms;
            this.defaultPrice = this.selectedPrice;
            this.loader = true;
            this.loadDefaultTermsAndPrice( this.defaultTerm );
        /*}*/
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
        this.totalPrice = 0;
        angular.forEach(this.assetsList.simpleLineItems, (value, key) => {
            if(value.selectedPrice && value.selectedPrice != "NA"){
                this.totalPrice += value.selectedPrice;
            }
        });
        angular.forEach(this.assetsList.compositeLineItems, (value, key) => {
            if(value.selectedPrice && value.selectedPrice != "NA"){
                this.totalPrice += value.selectedPrice;
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
            
            console.log("request", request);
            
            if(!this.discountCouponStatusChecked){            
                this.getDiscountAmountOrPercentage();
            }
            
            this._$q.all( [this.discountPromise1, this.discountPromise2] ).then(value => {
                if( this.navigatedFrom == "registrationPage" || this.navigatedFrom == "commercialRegistration"){
                    this._extendedWarrantyService.addExtendedWarranty( request , this.accessToken)
                        .then( response => {
                                this.loader = false;
                                localStorage.setItem('selectedAssets' , JSON.stringify( request ));
                                localStorage.setItem('extendedWarrantyId' , response.id);
                                this._$location.path('/extendedWarrantyReview');
                            }
                        );
                } else {
                    request.extendedWarrantyId = localStorage.getItem("extendedWarrantyId");
                    this._extendedWarrantyService.updateExtendedWarranty( request.extendedWarrantyId, request , this.accessToken)
                        .then( response => {
                                this.loader = false;
                                localStorage.setItem('selectedAssets' , JSON.stringify( request ));
                                localStorage.setItem('extendedWarrantyId' , response.id);
                                this._$location.path('/extendedWarrantyReview');
                            }
                        );
                }
            }, function( reason ) {                
                this.loader = false;
            });
        }
    };
    
    /*setTempSelectedAssets( assetsList ){
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
    };*/
    
    checkDiscountCouponIsAvailed(){
        
        this.discountPromise2 = this._extendedWarrantyService
            .checkDiscountCouponIsAvailed( this.discountCoupon , this.accessToken )
            .then( response => {
                    this.discountCouponIsAvailed = response;
            
                    //console.log("discountCouponIsAvailed ", this.discountCouponIsAvailed);
                
                    if(this.discountCouponIsAvailed){                    
                        this.discountCouponStatus = "redeemed";
                        localStorage.setItem("discountCoupon", "");
                    } else {                        
                        this.discountCouponStatus = "valid";
                        localStorage.setItem("discountCoupon", this.discountCoupon);
                    }
            
                    this.loader = false;
                }
            )
    };
    
    getDiscountAmountOrPercentage(){
        if(this.discountCoupon){
            this.loader = true;
            this.discountPromise1 = this._discountCodeService.getDiscountInfo( this.discountCoupon , this.accessToken )
                .then( response => {
                        this.discountCouponData = response;
                
                        this.discountCouponData.value = 
                            this.discountCouponData.value <= this.totalPrice 
                            ? this.discountCouponData.value 
                            : this.totalPrice;
                        
                        this.discountCouponStatusChecked = true;
                
                        this.checkDiscountCouponIsAvailed();
                    }
                ).catch( error => {
                        console.log("error code ", error );
                        this.discountCouponStatus = "invalid";
                        this.discountCouponStatusChecked = true;
                        localStorage.setItem("discountCoupon", "");
                        this.loader = false;
                    }   
                )
        } else {
            localStorage.setItem("discountCoupon", "");
        }
    };
}

ExtendedWarrantySelectionCtrl.$inject = [
    '$scope',
    '$q',
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
