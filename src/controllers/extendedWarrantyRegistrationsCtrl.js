export default class ExtendedWarrantyRegistrationsCtrl {
    
    _$scope;
    
    _$q;
    
    _$location;
    
    _$timeout;    
    
    _sessionManagerService;
    
    _identityService;
    
    _extendedWarrantyService;
    
    _registrationLogService;

    constructor(
        $scope,
        $q,
        $location,
        $timeout,
        sessionManagerService,
        identityService,
        extendedWarrantyService,
        registrationLogService
    ){                
        if (!$scope) {
            throw new TypeError('$scope required');
        }
        this._$scope = $scope;  
        
        if (!$q) {
            throw new TypeError('$q required');
        }
        this._$q = $q;      
        
        if (!$location) {
            throw new TypeError('$location required');
        }
        this._$location = $location;
        
        if (!$timeout) {
            throw new TypeError('$timeout required');
        }
        this._$timeout = $timeout;
        
        if (!sessionManagerService) {
            throw new TypeError('sessionManagerService required');
        }
        this._sessionManagerService = sessionManagerService;
        
        if (!identityService) {
            throw new TypeError('identityService required');
        }
        this._identityService = identityService;
        
        if (!extendedWarrantyService) {
            throw new TypeError('extendedWarrantyService required');
        }
        this._extendedWarrantyService = extendedWarrantyService;
        
        if (!registrationLogService) {
            throw new TypeError('registrationLogService required');
        }
        this._registrationLogService = registrationLogService;
        
        this.loader = true;
        
        //Here getting the accessToken and userInfo.
        sessionManagerService.getAccessToken()
            .then( accessToken => {
                this.accessToken = accessToken;
                identityService.getUserInfo( accessToken )
                    .then( userInfo => {
                            this.getPartnerSaleRegistrations( userInfo._account_id , accessToken )
                        }
                    )
                }
            );
    };
    
    getPartnerSaleRegistrations( accountId, accessToken ){
        var self = this;
        this.registrations = this._extendedWarrantyService.getRegistrations( accountId, accessToken )
            .then( registrationsList => {
                    this.registrations = registrationsList;
                    if(this.registrations.length){
                        this.getDealerWithId();
                    } else {
                        this.loader = false;
                    }
                }
            ).catch(function(error){
                self.errorMessage = error;
                self.isError = true;
                self._$timeout(function(){ self.isError = false; }, 3000);
            })
    };

    getDealerWithId(){
        var self = this;
        var registrationIdList = [];

        angular.forEach( this.registrations , function( val , key ){
            registrationIdList.push(val.id);
        });

        var regIds = registrationIdList.sort(function(a, b){return b - a});
        
        self._registrationLogService
            .getDealerRep( regIds, self.accessToken )
            .then( partnerReps => {

                    angular.forEach( partnerReps , function( val1 , key1 ){                        
                        
                        angular.forEach( self.registrations , function( val2 , key2 ){
                            
                            if(val1.registrationId == val2.id){
                                val2.dealerName = ((val1.firstName) ? (val1.firstName) : "") + " " + ((val1.lastName) ? (val1.lastName) : "");
                            }
                            
                        });
                    });
                
                    self.loader = false;
                }
            );
    };



    selectRecord(record){
        this.selectedRecord = record;
        this.selectedRecordId = record.id;
        
        this.setSelectedRecord();
    };    
        
    setSelectedRecord(){
        localStorage.setItem('selectedRecord' , JSON.stringify(this.selectedRecord));
        localStorage.setItem('navigatedFrom' , 'registrationPage');
        
        this._$location.path('/extendedWarrantySelection');
    }
}

ExtendedWarrantyRegistrationsCtrl.$inject = [
    '$scope',
    '$q',
    '$location',
    '$timeout',
    'sessionManagerService',
    'identityService',
    'extendedWarrantyService',
    'registrationLogService'
];
