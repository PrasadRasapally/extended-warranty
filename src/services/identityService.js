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
        this.getUserInfo = function(accessToken){
            return $q(resolve =>
                identityServiceSdk
                    .getUserInfo(accessToken)
                    .then(
                        userInfo => resolve(userInfo)
                    ).catch(function(error){
                        console.log("error in IdentityService......", error);
                    })
            )
        }
    }
}

IdentityService.$inject = [
    '$q',
    'identityServiceSdk'
];