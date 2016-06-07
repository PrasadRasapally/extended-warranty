export default class ExtendedWarrantyRegistrationsCtrl {

    constructor(
        $scope,
        $q,
        sessionManagerService,
        identityService,
        extendedWarrantyService,
        partnerRepService
    ){
        this.loader = true;
        
        sessionManagerService.getAccessToken()
            .then( accessToken => {
                this.accessToken = accessToken;
                identityService.getUserInfo( accessToken )
                    .then( userInfo => {
                        this.registrations = extendedWarrantyService.getRegistrations( userInfo._account_id, accessToken )
                            .then( registrationsList => {
                                    this.registrations = registrationsList;
                                    if(this.registrations.length){
                                        this.getDealerWithId();
                                    }
                                }
                            )
                        }
                    )
                }
            );
        
        this.getDealerWithId = function(){
            var self = this;
            self.dealerRepsPromises = [];
            
            angular.forEach( this.registrations , function( val , key ){
                if(val.partnerRepUserId){
                    self.dealerRepsPromises.push( partnerRepService.getDealerRep( val.partnerRepUserId, self.accessToken ))                
                }
            });
            
            $q.all( self.dealerRepsPromises ).then(function( value ) {
                
                angular.forEach( value , function( val , key ){
                    if(self.registrations[ key ].partnerRepUserId){
                        self.registrations[ key ].dealerName = val.firstName + " " + val.lastName;
                    }
                });
                
                self.loader = false;
            }, function( reason ) {                
                self.loader = true;
            });
        }
    
        this.selectRecord = function(record){
            this.selectedRecord = record;
            this.selectedRecordId = record.id;
        };
        
        this.setSelectedRecord = function(){
            localStorage.setItem('selectedRecord' , JSON.stringify(this.selectedRecord));
        }
    }
}

ExtendedWarrantyRegistrationsCtrl.$inject = [
    '$scope',
    '$q',
    'sessionManagerService',
    'identityService',
    'extendedWarrantyService',
    'partnerRepService'
];
