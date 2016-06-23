import AccountPermissionsServiceSdk from 'account-permissions-service-sdk';
import PartnerRepServiceSdk from 'partner-rep-service-sdk';
import IdentityServiceSdk from 'identity-service-sdk';
import SessionManager from 'session-manager';

export default class AccountPermissionController {

    constructor(
                $scope,
                $q,
                partnerRepServiceSdk,
                accountPermissionsServiceSdk,
                identityServiceSdk:IdentityServiceSdk,
                sessionManager:SessionManager
            ) {

        this._sessionManager = sessionManager;

        $scope.checkAccountAuthorization = function() {

            return $q((resolve, reject) => {
                sessionManager
                    .getAccessToken()
                    .then(accessToken => {
                        $scope.loader = true;
                        $q((resolve, reject) => {
                                identityServiceSdk
                                    .getUserInfo(accessToken)
                                    .then(userInfo => {
                                        $q((resolve, reject) =>
                                            partnerRepServiceSdk
                                                .getPartnerRepWithId(
                                                    userInfo._sub,
                                                    accessToken
                                                ).then(res => {
                                                    accountPermissionsServiceSdk
                                                        .getAccountPermissionsWithId(res.sapAccountNumber, accessToken)
                                                        .then(response => {
                                                            $scope.loader = false;
                                                            if (response == null) {
                                                                reject(false);
                                                            } else {
                                                                if (response.extendedWarranty) {
                                                                    resolve(true);
                                                                } else {
                                                                    reject(false);
                                                                }
                                                            }
                                                        })
                                                }
                                            )
                                        )
                                            .then(result => resolve(result))
                                            .catch(error => reject(false));
                                    });
                            }
                        ).then((result)=>
                            resolve(result)
                        ).catch(error=>reject(false));
                    });
            });

        };
    }

}

AccountPermissionController.$inject = [
    '$scope',
    '$q',
    'partnerRepServiceSdk',
    'accountPermissionsServiceSdk',
    'identityServiceSdk',
    'sessionManager'
];
