import extendedWarrantyRegistrationsTemplate from './templates/extendedWarrantyRegistrations.html!text';
import ExtendedWarrantyRegistrationsCtrl from './controllers/extendedWarrantyRegistrationsCtrl';

import extendedWarrantySelectionTemplate from './templates/extendedWarrantySelection.html!text';
import ExtendedWarrantySelectionCtrl from './controllers/extendedWarrantySelectionCtrl';

export default class RouteConfig {

    constructor($routeProvider) {

        $routeProvider
            .when('/',
                {
                    template : extendedWarrantyRegistrationsTemplate,
                    controller : ExtendedWarrantyRegistrationsCtrl,
                    controllerAs :'ctrl'
                }
            ).when('/extendedWarrantySelection',
                {
                    template : extendedWarrantySelectionTemplate,
                    controller : ExtendedWarrantySelectionCtrl,
                    controllerAs : 'ctrl'
                }
            )
            .otherwise({
                redirectTo:"/"
            });

    }

}

RouteConfig.$inject = [
    '$routeProvider'
];