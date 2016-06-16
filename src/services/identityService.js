import IdentityServiceSdk from 'identity-service-sdk';

/**
 * @class {IdentityService}
 */

export default class IdentityService {

    _$q;

    _identityServiceSdk : IdentityServiceSdk;

    constructor(
        $q,
        identityServiceSdk : IdentityServiceSdk
    ){
        if(!$q){
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if(!identityServiceSdk){
            throw new TypeError('identityServiceSdk required');
        }
        this._identityServiceSdk = identityServiceSdk;
    }
    getUserInfo( accessToken ){
        return this._$q( resolve =>
            this._identityServiceSdk
                .getUserInfo(accessToken)
                .then(
                    userInfo => resolve(userInfo)
                ).catch(function(error){
                    console.log("error in IdentityService......", error);
                })
        )
    }
}

IdentityService.$inject = [
    '$q',
    'identityServiceSdk'
];