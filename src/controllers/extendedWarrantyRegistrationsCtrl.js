export default class ExtendedWarrantyRegistrationsCtrl {
    
    _extendedWarrantyService;
    
    _partnerRepService;
    
    _$q;
    
    _$timeout;

    constructor(
        $scope,
        $q,
        $timeout,
        sessionManagerService,
        identityService,
        extendedWarrantyService,
        partnerRepService
    ){        
        
        if (!$q) {
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if (!$timeout) {
            throw new TypeError('$timeout required');
        }
        this._$timeout = $timeout;
        
        if (!extendedWarrantyService) {
            throw new TypeError('extendedWarrantyService required');
        }
        this._extendedWarrantyService = extendedWarrantyService;
        
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
        var self = this;
        this.registrations = this._extendedWarrantyService.getRegistrations( accountId, accessToken )
            .then( registrationsList => {
                    console.log('registrationsList ',registrationsList)
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
        self.dealerRepsPromises = [];

        angular.forEach( this.registrations , function( val , key ){
            if(val.partnerRepUserId){
                self.dealerRepsPromises.push( self._partnerRepService.getDealerRep( val.partnerRepUserId, self.accessToken ))                
            }
        });

        this._$q.all( self.dealerRepsPromises ).then(function( value ) {

            angular.forEach( self.registrations , function( val , key ){
                if(!val.partnerRepUserId){
                    value.splice( key, 0, undefined );
                }
            });

            angular.forEach( value , function( val , key ){  
                if(!self.registrations[ key ].partnerRepUserId){

                } else if(self.registrations[ key ].partnerRepUserId){
                    self.registrations[ key ].dealerName = val.firstName + " " + val.lastName;
                }
            });

            self.loader = false;
        }, function( reason ) { 
            console.log( reason );
            self.loader = false;
        });
    };
    
    selectRecord(record){
        this.selectedRecord = record;
        this.selectedRecordId = record.id;
    };    
        
    setSelectedRecord(){
        localStorage.setItem('selectedRecord' , JSON.stringify(this.selectedRecord));
        localStorage.setItem('navigatedFrom' , 'registrationPage');
    }
}

ExtendedWarrantyRegistrationsCtrl.$inject = [
    '$scope',
    '$q',
    '$timeout',
    'sessionManagerService',
    'identityService',
    'extendedWarrantyService',
    'partnerRepService'
];
