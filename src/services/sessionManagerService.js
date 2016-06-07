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
        this.getAccessToken = function(){
            return $q( resolve =>
                sessionManager
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
}

SessionManagerService.$inject = [
    '$q',
    'sessionManager'
];