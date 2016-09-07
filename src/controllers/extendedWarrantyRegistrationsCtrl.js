export default class ExtendedWarrantyRegistrationsCtrl {
    
    _$scope;
    
    _$q;
    
    _$location;
    
    _$timeout;    
    
    _sessionManagerService;
    
    _identityService;
    
    _extendedWarrantyService;
    
    _registrationLogService;
    
    _partnerRepService;

    constructor(
        $scope,
        $q,
        $location,
        $timeout,
        sessionManagerService,
        identityService,
        extendedWarrantyService,
        registrationLogService,
        partnerRepService
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
        
        if (!partnerRepService) {
            throw new TypeError('partnerRepService required');
        }
        this._partnerRepService = partnerRepService;
        
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
        this.registrations = 
            this._extendedWarrantyService
            .getRegistrations( accountId, accessToken )
            .then( registrationsList => {
                    this.registrations = registrationsList;
                    if(this.registrations.length){
                        this.getDealerWithId();
                    } else {
                        this.loader = false;
                    }
                }
            ).catch( error => {
                this.errorMessage = error;
                this.isError = true;
                this._$timeout(() => { this.isError = false; }, 3000);
            })
    };

    getDealerWithId(){
        var registrationIdList = [];

        angular.forEach( this.registrations , ( val , key ) => {
            if( val.partnerRepUserId ){
                registrationIdList.push( val.partnerRepUserId );
            }
        });

        var partnerRepUserIds = registrationIdList.sort();
        
        //console.log("partnerRepUserIds ",partnerRepUserIds);
        
        this._partnerRepService
            .getDealerRepsWithIds( partnerRepUserIds , this.accessToken)
            .then( partnerRepsList => {
            
                //console.log("partnerRepsList ",partnerRepsList);
                
                angular.forEach( this.registrations ,  (val1 , key1) => {
                    
                    if(val1.partnerRepUserId){
                        
                        angular.forEach( partnerRepsList , ( val2 , key2 ) => {

                            if(val1.partnerRepUserId == val2.id){
                                val1.dealerName = 
                                    ((val2.firstName) ? (val2.firstName) : "") 
                                    + " " + 
                                    ((val2.lastName) ? (val2.lastName) : "");
                            }
                            
                        });
                    }
                    
                });
            
                this.loader = false;
            })
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
    'registrationLogService',
    'partnerRepService'
];
