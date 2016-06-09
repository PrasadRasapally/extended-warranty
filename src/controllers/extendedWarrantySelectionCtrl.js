import PromptOnCancelTemplate from './templates/promptOnCancel.html!text';

export default class ExtendedWarrantySelectionCtrl {

    constructor(
        $scope,
        $uibModal,
        $location,
        sessionManagerService,
        identityService,
        extendedWarrantyService,
        prepareAddExtendedWarrantyRequestFactory,
        discountCodeService
    ){
        
        this.loader = true;
        this.navigatedFrom = localStorage.getItem('navigatedFrom');
        this.extendedWarrantyId = parseInt( localStorage.getItem('extendedWarrantyId') );
        this.selectedRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.assetsList = {};
        
        sessionManagerService.getAccessToken()
            .then( accessToken => {
                this.accessToken = accessToken;
                    this.loader = false;
                    this.loadAssets( this.accessToken );
                }
            ); 
        
        this.loadAssets = function( accessToken ){
        
            if( this.navigatedFrom == "registrationPage" ) {
                this.assetsList.simpleLineItems = this.selectedRecord.simpleLineItems;
                this.assetsList.compositeLineItems = this.selectedRecord.compositeLineItems;

                console.log("this.assetsList from registration", this.assetsList);
            } else if( this.navigatedFrom == "reviewPage" ) {
                this.loader = true;
                extendedWarrantyService.getExtendedWarranty( this.extendedWarrantyId , accessToken )
                    .then( assetsList => {
                            console.log("this.assetsList from edit " ,assetsList);
                            this.assetsList.simpleLineItems = assetsList.simpleLineItems;
                            this.assetsList.compositeLineItems = assetsList.compositeLineItems;
                            this.loader = false;
                        }
                    )  
            }
            this.getDiscountAmountOrPercentage( "G553QT" );
        };
        
        this.getDiscountAmountOrPercentage = function( discountCode ){
            discountCodeService.getDiscountCode( discountCode , this.accessToken )
                .then( response => {
                        console.log("response code ", response );
                    }
                );
        };
        
        this.tempSelectList = [];
        
        this.terms = [
            {
              id: 1,
              name: 'EW 3/1',
              label: 'EW 3/1',
              value: 100
            }, {
              id: 2,
              name: 'EW 3/2',
              label: 'EW 3/2',
              value: 200
            }, {
              id: 3,
              name: 'EW 3/3',
              label: 'EW 3/3',
              value: 300
            }
        ];
        
        this.defaultTerm = "EW 3/1";
        this.defaultPrice = 100;
        this.totalPrice = 0;
        this.validCouponCodes = ["1111","2222","3333","4444"];
        
        this.selectedTerms = "EW 3/1";
        this.selectedPrice = 100;
        
        this.selectAllProducts = function(){
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
        
        this.selectNoProducts = function(){            
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
        
        this.selectAsset = function( asset ){
            if(!asset.isSelected && this.tempSelectList.indexOf(asset) == -1){
                this.tempSelectList.push( asset );
                asset.isSelected = true;
            } else {
                if(this.tempSelectList.indexOf(asset) !== -1)
                this.tempSelectList.splice( this.tempSelectList.indexOf(asset) , 1 );
                asset.isSelected = false;
            }
        };
        
        this.removeAsset = function( asset ){ 
            asset.selectedTerms = undefined;
            asset.selectedPrice = undefined;
            asset.isTermSelected = false;
            this.calculateTotalPrice();
        };
        
        this.applyTermAndPrice = function(){
            var self = this;
            this.selectedPrice = this.selectedTerms.split('/')[1] * 100;
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
        
        this.validateCouponCode = function(){
            if(this.validCouponCodes.indexOf(this.discountCoupon) !== -1){
                this.discountCouponStatus = true;
            } else {
                this.discountCouponStatus = false;
            }
            this.discountCouponStatusChecked = true;
        };
        
        this.cancelSelection = function(){
            this.modalInstance = $uibModal.open({
                scope:$scope,
                template: PromptOnCancelTemplate,
                size:'sm'
            });
            
            this.confirmCancelSelection = function(){                
                $location.path('/');
            };
            
            this.revertCancelSelection = function(){
                this.modalInstance.dismiss('cancel');
            }
        };
        
        this.calculateTotalPrice = function(){
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
        
        this.gotoReview = function(){            
            var request = prepareAddExtendedWarrantyRequestFactory.prepareAddExtendedWarrantyRequest( this ); 
            
            this.loader = true;
            
            extendedWarrantyService.addExtendedWarranty( request , this.accessToken)
                .then( response => {
                        this.loader = false;
                        console.log("request " , request);
                        localStorage.setItem('selectedAssets' , JSON.stringify( request ));
                        localStorage.setItem('extendedWarrantyId' ,  response );

                        console.log("response " , response);
                        $location.path('/extendedWarrantyReview');
                    }
                );
        };
    }
}

ExtendedWarrantySelectionCtrl.$inject = [
    '$scope',
    '$uibModal',
    '$location',
    'sessionManagerService',
    'identityService',
    'extendedWarrantyService',
    'prepareAddExtendedWarrantyRequestFactory',
    'discountCodeService'
];
