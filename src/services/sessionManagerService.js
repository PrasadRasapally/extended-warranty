import SessionManager from 'session-manager';

/**
 * @class {SessionManagerService}
 */

export default class SessionManagerService {

    _$q;

    _sessionManager : SessionManager;

    constructor(
        $q,
        sessionManager : SessionManager
    ){        
        if(!$q){
            throw new TypeError('$q required');
        }
        this._$q = $q;
        
        if(!sessionManager){
            throw new TypeError('sessionManager required');
        }
        this._sessionManager = sessionManager; 
    }
    getAccessToken(){
        return this._$q( resolve =>
            this._sessionManager
                .getAccessToken()
                .then(
                    accessToken =>
                        resolve(accessToken)
                ).catch(function(error){
                    console.log("error in SessionManagerService......", error);
                })
        )
    }
}

SessionManagerService.$inject = [
    '$q',
    'sessionManager'
];