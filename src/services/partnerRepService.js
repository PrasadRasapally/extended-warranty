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
       if(!$q){
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if(!partnerRepServiceSdk){
            throw new TypeError('partnerRepServiceSdk required');
        }
        this._partnerRepServiceSdk = partnerRepServiceSdk; 
    }
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
}

PartnerRepService.$inject = [
    '$q',
    'partnerRepServiceSdk'
];