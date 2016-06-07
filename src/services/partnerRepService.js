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
        this.getDealerRep = function( partnerRepId, accessToken ){
            return $q(
                resolve =>
                    partnerRepServiceSdk
                        .getPartnerRepWithId( partnerRepId, accessToken )
                        .then(partnerReps =>
                            resolve(partnerReps)
                        )
            )
        }
    }
}

PartnerRepService.$inject = [
    '$q',
    'partnerRepServiceSdk'
];