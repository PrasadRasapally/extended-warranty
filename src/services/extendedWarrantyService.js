import ExtendedWarrantyServiceSdk from 'extended-warranty-service-sdk';

/**
 * @class {ExtendedWarrantyService}
 */

export default class ExtendedWarrantyService {
    _$q;

    _extendedWarrantyServiceSdk : ExtendedWarrantyServiceSdk;

    constructor(
        $q,

        extendedWarrantyServiceSdk : ExtendedWarrantyServiceSdk

    ){
        /**
         initialization
         */
        if(!$q){
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if(!extendedWarrantyServiceSdk){
            throw new TypeError('extendedWarrantyServiceSdk required');
        }
        this._extendedWarrantyServiceSdk = extendedWarrantyServiceSdk;
    }
    /**
     methods
     */
    getRegistrations( partnerAccountId , accessToken ){
        return this._$q((resolve , reject) =>
            this._extendedWarrantyServiceSdk
                .listSubmittedPartnerCommercialSaleRegDraftWithAccountId( partnerAccountId , accessToken )
                .then(
                    registrationsList => resolve( registrationsList )
                ).catch(function(error){
                    reject('Unable to load the Registrations List. There is some issue with the server.');
                })
        )
    };
    
    addExtendedWarranty( request , accessToken ){
        return this._$q(resolve =>
            this._extendedWarrantyServiceSdk
                .addExtendedWarrantyPurchase( request , accessToken )
                .then(
                    response => resolve( response )
                ).catch(function(error){
                    console.log("error in ExtendedWarrantyService - addExtendedWarranty......", error);
                })
        )
    };
    
    updateExtendedWarranty( extendedWarrantyId, request , accessToken ){
        return this._$q(resolve =>
            this._extendedWarrantyServiceSdk
                .updateExtendedWarrantyPurchase( extendedWarrantyId, request , accessToken )
                .then(
                    response => resolve( response )
                ).catch(function(error){
                    console.log("error in ExtendedWarrantyService - updateExtendedWarranty...", error);
                })
        )
    };
    
    submitExtendedWarranty( request , accessToken ){
        return this._$q(resolve =>
            this._extendedWarrantyServiceSdk
                .submitExtendedWarrantyDraft( request , accessToken )
                .then(
                    response => resolve( response )
                ).catch(function(error){
                    console.log("error in ExtendedWarrantyService - submitExtendedWarranty......", error);
                })
        )
    };
    
    checkDiscountCouponIsAvailed( discountCoupon , accessToken ){
        return this._$q(resolve =>
            this._extendedWarrantyServiceSdk
                .checkDiscountAvailOnExtendedWarranty( discountCoupon , accessToken )
                .then(
                    response => resolve( response )
                ).catch(function(error){
                    console.log("error in ExtendedWarrantyService - checkDiscountCouponAppliedOrNot......", error);
                })
        )
    };
}

ExtendedWarrantyService.$inject = [
    '$q',
    'extendedWarrantyServiceSdk'
];