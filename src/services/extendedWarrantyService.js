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
        this.getRegistrations = function( partnerAccountId , accessToken ){
            return $q(resolve =>
                extendedWarrantyServiceSdk
                    .listSubmittedPartnerCommercialSaleRegDraftWithAccountId( partnerAccountId , accessToken )
                    .then(
                        registrationsList => resolve( registrationsList )
                    ).catch(function(error){
                        console.log("error in ExtendedWarrantyService - getRegistrations......", error);
                    })
            )
        };
        
        this.addExtendedWarranty = function( request , accessToken ){
            return $q(resolve =>
                extendedWarrantyServiceSdk
                    .addExtendedWarrantyPurchase( request , accessToken )
                    .then(
                        response => resolve( response )
                    ).catch(function(error){
                        console.log("error in ExtendedWarrantyService - addExtendedWarranty......", error);
                    })
            )
        };
        
        this.getExtendedWarranty = function( extendedWarrantyId , accessToken ){
            return $q(resolve =>
                extendedWarrantyServiceSdk
                    .getExtendedWarrantyPurchase( extendedWarrantyId , accessToken )
                    .then(
                        response => resolve( response )
                    ).catch(function(error){
                        console.log("error in ExtendedWarrantyService - getExtendedWarrantyPurchase......", error);
                    })
            )
        };
    }
}

ExtendedWarrantyService.$inject = [
    '$q',
    'extendedWarrantyServiceSdk'
];