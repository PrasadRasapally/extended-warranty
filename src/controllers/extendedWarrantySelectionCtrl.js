import PromptOnCancelTemplate from './templates/promptOnCancel.html!text';
import PromptOnEmptyRequest from './templates/promptOnEmptyRequest.html!text';

export default class ExtendedWarrantySelectionCtrl {
    
    _$scope;
    
    _$uibModal;
    
    _$location;
    
    _extendedWarrantyService;
    
    _termsPriceService;
    
    _prepareAddExtendedWarrantyRequestFactory;
    
    _prepareExtendedWarrantyTermsRequestFactory;
    
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
        prepareExtendedWarrantyTermsRequestFactory,
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
        
        if (!prepareExtendedWarrantyTermsRequestFactory) {
            throw new TypeError('prepareExtendedWarrantyTermsRequestFactory required');
        }
        this._prepareExtendedWarrantyTermsRequestFactory = prepareExtendedWarrantyTermsRequestFactory;
        
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
                    this.loadTerms( this.accessToken );
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
    
    loadTerms( accessToken ){
        this._termsPriceService.getAvailableTerms( accessToken )
            .then( terms => {
                    this.terms = terms;
                    angular.forEach(this.terms , function(value, key) {
                        value.label = value._term;
                    });                    
                    this.loader = false;
                }
            )
    };
    
    selectAllProducts(){
        var self = this;
        if( this.assetsList.simpleLineItems.length ){
            angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
                value.selectedTerms = self.defaultTerm
                value.selectedPrice = self.defaultPrice;
                value.isTermSelected = true;
            });
        }
        if( this.assetsList.compositeLineItems.length ){
            angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
                value.selectedTerms = self.defaultTerm
                value.selectedPrice = self.defaultPrice;
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
        var self = this;
        
        //this.selectedPrice = this.selectedTerms.split('/')[1] * 100;
        
        this.selectedPriceList = this.getSelectedPriceList( this.assetsList );
        
        if(this.tempSelectList.length > 0){
            angular.forEach(this.tempSelectList, function(value, key) {
                value.selectedTerms = self.selectedTerms;
                value.selectedPrice = self.selectedPrice;
                value.isTermSelected = true;
            });
        } else {
            this.defaultTerm = self.selectedTerms;
            this.defaultPrice = this.selectedPrice;
        }
        this.calculateTotalPrice();
    };
    
    getSelectedPriceList( selectedAssets ){
        var request = this._prepareExtendedWarrantyTermsRequestFactory.prepareRequest( this.selectedTerms , selectedAssets );
        console.log(request);
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
            if(value.selectedPrice){
                self.totalPrice += value.selectedPrice;
            }
        });
        angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
            if(value.selectedPrice){
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
    'prepareExtendedWarrantyTermsRequestFactory',
    'discountCodeService'
];
