import TermsPriceServiceSdk from 'terms-price-service-sdk';

/**
 * @class {TermsPriceService}
 */

export default class TermsPriceService {
    _$q;

    _termsPriceServiceSdk : TermsPriceServiceSdk;

    constructor(
        $q,

        termsPriceServiceSdk : TermsPriceServiceSdk

    ){
        /**
         initialization
         */
        if (!$q) {
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if (!termsPriceServiceSdk) {
            throw new TypeError('termsPriceServiceSdk required');
        }
        this._termsPriceServiceSdk = termsPriceServiceSdk;
    }
    /**
     methods
     */
    getAvailableTerms( accessToken ){
        return this._$q(resolve =>
            this._termsPriceServiceSdk
                .extendedWarrantyTerms( accessToken )
                .then(
                    response => resolve( response )
                ).catch(function(error){
                    console.log("error in TermsPriceService - loadAvailableTerms......", error);
                })
        )
    }
}

TermsPriceService.$inject = [
    '$q',
    'termsPriceServiceSdk'
];