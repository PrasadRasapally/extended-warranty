import extendedWarrantyRegistrationsTemplate from './templates/extendedWarrantyRegistrations.html!text';
import extendedWarrantyRegistrationsCtrl from './controllers/extendedWarrantyRegistrationsCtrl';

export default class RouteConfig {

    constructor($routeProvider) {

        $routeProvider
            .when('/',
                {
                    template:extendedWarrantyRegistrationsTemplate,
                    controller: extendedWarrantyRegistrationsCtrl,
                    controllerAs:'ctrl'
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