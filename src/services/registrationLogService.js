import RegistrationLogServiceSdk from 'registration-log-service-sdk';

/**
 * @class {RegistrationLogService}
 */

export default class RegistrationLogService {

    _$q;

    _registrationLogServiceSdk : RegistrationLogServiceSdk;

    constructor(
        $q,
        registrationLogServiceSdk : RegistrationLogServiceSdk
    ){
        if(!$q){
            throw new TypeError('$q required');
        }
        this._$q = $q;

        if(!registrationLogServiceSdk){
            throw new TypeError('registrationLogServiceSdk required');
        }
        this._registrationLogServiceSdk = registrationLogServiceSdk;
    }
    getDealerRep( partnerRepId, accessToken ){
        return this._$q(
            resolve =>
                this._registrationLogServiceSdk
                    .listDealerRepFirstAndLastName( partnerRepId, accessToken )
                    .then(partnerReps =>
                        resolve(partnerReps)
                    )
        )
    }
}

RegistrationLogService.$inject = [
    '$q',
    'registrationLogServiceSdk'
];