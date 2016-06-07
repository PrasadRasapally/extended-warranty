export default class ExtendedWarrantySelectionCtrl {

    constructor(
        $scope,
        $uibModal,
        $location,
        sessionManagerService,
        identityService,
        extendedWarrantyService
    ){
        this.loader = true;
        sessionManagerService.getAccessToken()
        .then( accessToken => {
            this.accessToken = accessToken;
            //identityService.getUserInfo( accessToken )
                //.then( userInfo => {
                        //this.userInfo = userInfo;
                        this.loader = false;
                    //}
                //)
            }
        );
        
        this.selectedRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.assetsList = {};
        
        this.assetsList.simpleLineItems = this.selectedRecord.simpleLineItems;
        this.assetsList.compositeLineItems = this.selectedRecord.compositeLineItems;
        
        console.log(this.assetsList)
        
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
        
        this.selectedTerm = "EW 3/1";
        this.selectedPrice = 100;
        
        this.selectAllRecords = function(){
            var self = this;
            if( this.assetsList.simpleLineItems.length ){
                angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
                    value.selectedTerm = self.defaultTerm
                    value.selectedPrice = self.defaultPrice;
                    value.isTermSelected = true;
                });
            }
            if( this.assetsList.compositeLineItems.length ){
                angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
                    value.selectedTerm = self.defaultTerm
                    value.selectedPrice = self.defaultPrice;
                    value.isTermSelected = true;
                });
            }
            this.calculateTotalPrice();
        };
        
        this.selectNoRecords = function(){            
            angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
                value.selectedTerm = undefined;
                value.selectedPrice = undefined;
                value.isTermSelected = false;
            });
            angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
                value.selectedTerm = undefined;
                value.selectedPrice = undefined;
                value.isTermSelected = false;
            });
            this.calculateTotalPrice();
        };
        
        this.selectAsset = function( asset ){
            if(!asset.isTempSelect && this.tempSelectList.indexOf(asset) == -1){
                this.tempSelectList.push( asset );
                asset.isTempSelect = true;
            } else {
                if(this.tempSelectList.indexOf(asset) !== -1)
                this.tempSelectList.splice( this.tempSelectList.indexOf(asset) , 1 );
                asset.isTempSelect = false;
            }
        };
        
        this.removeAsset = function( asset ){ 
            asset.selectedTerm = undefined;
            asset.selectedPrice = undefined;
            asset.isTermSelected = false;
            this.calculateTotalPrice();
        };
        
        this.applyTermAndPrice = function(){
            var self = this;
            this.selectedPrice = this.selectedTerm.split('/')[1] * 100;
            if(this.tempSelectList.length > 0){
                angular.forEach(this.tempSelectList, function(value, key) {
                    value.selectedTerm = self.selectedTerm;
                    value.selectedPrice = self.selectedPrice;
                    value.isTermSelected = true;
                });
            } else {
                this.defaultTerm = self.selectedTerm;
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
                template: '<div class="modal-header"> <h4 class="modal-title">Warning !</h4></div>' +
                    '<div class="modal-body">Do you want to cancel the selection ?</div>' +
                    '<div class="modal-footer">' +
                        '<button class="btn btn-primary" type="button" ng-click="ctrl.confirmCancelSelection()">Yes</button>' +
                        '<button class="btn btn-warning" type="button" ng-click="ctrl.revertCancelSelection()">No</button>'+
                    '</div>',
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
            var self = this;
            this.selectedAssets = {};
            this.selectedAssets.simpleLineItems = [];
            this.selectedAssets.compositeLineItems = [];            
            
            angular.forEach(this.assetsList.simpleLineItems, function(value, key) {
                if(value.selectedPrice){
                    self.selectedAssets.simpleLineItems.push(value);
                    self.selectedAssets.simpleLineItems.terms = self.defaultTerm;
                    self.selectedAssets.simpleLineItems.price = self.defaultPrice;
                }
            });            
            
            angular.forEach(this.assetsList.compositeLineItems, function(value, key) {
                if(value.selectedPrice){
                    self.selectedAssets.compositeLineItems.push(value);
                }
            });
            
            self.selectedAssets.registrationId = this.selectedRecord.id;
            self.selectedAssets.facilityName = this.selectedRecord.facilityName;
            self.selectedAssets.partnerAccountId = this.selectedRecord.partnerAccountId;
            self.selectedAssets.discountCode = "DIS007";
            self.selectedAssets.isSubmitted = false;
            
            this.loader = true;
            extendedWarrantyService.addExtendedWarranty( this.selectedAssets , this.accessToken)
            .then( response => {
                this.loader = false;
                localStorage.setItem('selectedAssets' , JSON.stringify(self.selectedAssets));            
                $location.path('/extendedWarrantyReview');
            });
        };
    }
}

ExtendedWarrantySelectionCtrl.$inject = [
    '$scope',
    '$uibModal',
    '$location',
    'sessionManagerService',
    'identityService',
    'extendedWarrantyService'
];
