import DiscountCodeServiceSdk from 'discount-code-service-sdk';

/**
 * @class {DiscountCodeService}
 */

export default class DiscountCodeService {
    _$q;

    _discountCodeServiceSdk : DiscountCodeServiceSdk;

    constructor(
        $q,

        discountCodeServiceSdk : DiscountCodeServiceSdk
    ){
        if (!$q) {
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if(!discountCodeServiceSdk){
            throw new TypeError('discountCodeServiceSdk required');
        }
        this._discountCodeServiceSdk = discountCodeServiceSdk;
    }
    
    getDiscountCode( code , accessToken){
        return this._$q( resolve => {
                this._discountCodeServiceSdk.getDiscountCode( code , accessToken )
                .then( 
                    response =>  resolve( response ) 
                ).catch(function(error){
                    console.log("error in DiscountCodeService - getDiscountCode......", error);
                })
            }
        )        
    };
}

DiscountCodeService.$inject = [
    '$q',
    'discountCodeServiceSdk'
];