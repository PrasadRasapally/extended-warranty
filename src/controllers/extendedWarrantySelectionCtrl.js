import PromptOnCancelTemplate from './templates/promptOnCancel.html!text';
import PromptOnEmptyRequest from './templates/promptOnEmptyRequest.html!text';

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
        this.assetsList = {};
        
        sessionManagerService.getAccessToken()
            .then( accessToken => {
                this.accessToken = accessToken;
                    this.loadAssets( this.accessToken );
                    this.loadTermsList( this.accessToken );
                }
            ); 
        
        this.tempSelectList = [];        
        this.defaultTerm = "3/1";        
        this.selectedTerms = "3/1";
        
        this.defaultPrice = 100;
        this.totalPrice = 0;
        this.selectedPrice = 100;
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
        console.log("request ",request);
        this._termsPriceService.searchExtendedWarrantyTermsPrice( request , this.accessToken )
            .then( response => {
                    console.log("response ",response);
                    if( response.simpleSerialCode || response.compositeSerialCode){
                        this.assetsList = this._applyDefaultOrSelectedTermsFactory.applyDefaultTermsAndPrice( this.assetsList , response );
                    }
                    console.log("this.assetsList ", this.assetsList);
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
                value.isTermSelected = true;
            });
        }
        if( this.assetsList.compositeLineItems.length ){
            angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
                value.selectedTerms = value.defaultTerm
                value.selectedPrice = value.defaultPrice;
                value.isTermSelected = true;
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
            console.log("request ",request);
            
            this._termsPriceService.searchExtendedWarrantyTermsPrice( request , this.accessToken )
                .then( response => {
                        console.log("response ",response);
                        this.assetsList = this._applyDefaultOrSelectedTermsFactory.applySelectedTermsAndPrice( this.assetsList , selectedAssetsList, response );
                        console.log("this.assetsList ", this.assetsList);                        
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
                template : PromptOnEmptyRequest,
                size : 'md'
            });

            this.closeEmptyRequestPrompt = function(){
                this.modalInstance.dismiss('cancel');
            }
        } 
        else {        
            localStorage.setItem('assetsList' , JSON.stringify( this.assetsList ));            

            this.loader = true;

            this._extendedWarrantyService.addExtendedWarranty( request , this.accessToken)
                .then( response => {
                        this.loader = false;
                        localStorage.setItem('selectedAssets' , JSON.stringify( request ));
                        localStorage.setItem('extendedWarrantyId' , response);
                        this._$location.path('/extendedWarrantyReview');
                    }
                );
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
    
    /*getDiscountAmountOrPercentage( discountCode ){
        this._discountCodeService.getDiscountCode( discountCode , this.accessToken )
            .then( response => {
                    console.log("response code ", response );
                }
            );
    };*/
    
    validateCouponCode(){
        if(this.validCouponCodes.indexOf(this.discountCoupon) !== -1){
            this.discountCouponStatus = true;
        } else {
            this.discountCouponStatus = false;
        }
        this.discountCouponStatusChecked = true;
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
