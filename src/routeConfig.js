import extendedWarrantyRegistrationsTemplate from './templates/extendedWarrantyRegistrations.html!text';
import ExtendedWarrantyRegistrationsCtrl from './controllers/extendedWarrantyRegistrationsCtrl';

import extendedWarrantySelectionTemplate from './templates/extendedWarrantySelection.html!text';
import ExtendedWarrantySelectionCtrl from './controllers/extendedWarrantySelectionCtrl';

import extendedWarrantyReviewTemplate from './templates/extendedWarrantyReview.html!text';
import ExtendedWarrantyReviewCtrl from './controllers/extendedWarrantyReviewCtrl';

import extendedWarrantyConfirmationTemplate from './templates/extendedWarrantyConfirmation.html!text';
import ExtendedWarrantyConfirmationCtrl from './controllers/extendedWarrantyConfirmationCtrl';

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
            ).when('/extendedWarrantyReview',
                {
                    template : extendedWarrantyReviewTemplate,
                    controller : ExtendedWarrantyReviewCtrl,
                    controllerAs : 'ctrl'
                }
            ).when('/extendedWarrantyConfirmation',
                {
                    template : extendedWarrantyConfirmationTemplate,
                    controller : ExtendedWarrantyConfirmationCtrl,
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