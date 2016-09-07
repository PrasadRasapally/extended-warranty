import PartnerRepServiceSdk from 'partner-rep-service-sdk';

/**
 * @class {PartnerRepService}
 */

export default class PartnerRepService {

    _$q;

    _partnerRepServiceSdk : PartnerRepServiceSdk;

    constructor(
        $q,
        partnerRepServiceSdk : PartnerRepServiceSdk
    ){ 
        /**
        * Initialization
        */       
        if(!$q){
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if(!partnerRepServiceSdk){
            throw new TypeError('partnerRepServiceSdk required');
        }
        this._partnerRepServiceSdk = partnerRepServiceSdk; 
    }
    /**
     * Methods
     */
    getDealerRep( partnerRepId, accessToken ){
        return this._$q(
            resolve =>
                this._partnerRepServiceSdk
                    .getPartnerRepWithId( partnerRepId, accessToken )
                    .then(partnerReps =>
                        resolve(partnerReps)
                    )
        )
    }
    getDealerRepsWithIds( partnerRepIds, accessToken ){
        return this._$q(
            resolve => {
                this._partnerRepServiceSdk
                    .getPartnerRepsWithIds( partnerRepIds, accessToken )
                    .then(partnerRepsList =>
                        resolve( partnerRepsList )
                    ).catch(error => {
                        console.log("error in PartnerRepService - getPartnerRepsWithIds...", error);
                    })
            }
        )
    }
}

PartnerRepService.$inject = [
    '$q',
    'partnerRepServiceSdk'
];