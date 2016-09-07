import pageNavigationTemplate from './templates/pageNavigation.html!text';
import accountPermissionTemplate from './templates/accountPermission.html!text';
import AccountPermissionController from './controllers/accountPermissionController'
import 'bootstrap/css/bootstrap.css!css'
import 'bootstrap'

angular.module('extendedWarrantyWebApp.customDirectives',['ui.bootstrap'])
    .directive('precorPageIndicator', function() {
        return {
            templateUrl : './directives/templates/pageNavigation.html',
            link : function(scope, element, attrs) {
                console.log(scope);
                console.log(element);
            }
        };
    }).directive('accountPermission', function( $uibModal ) {
        return {
            replace: false,
            controller: AccountPermissionController,
            controllerAs: 'controller',
            bindToController: true,
            link : function (scope,element,attributes) {
                scope.checkAccountAuthorization()
                    .then((result)=>{
                        element.show();
                        scope.isAuthorized = true;
                    })
                    .catch(error=>{
                        element.hide();
                        scope.isAuthorized = false;
                        $uibModal.open({
                            scope: scope,
                            template: accountPermissionTemplate,
                            size: 'sm',
                            backdrop: 'static'
                        });
                    });
            }
        }
    }).directive('extendedWarrantyHover', () => {
        return {
            link : function ( scope , element , attributes ) {
                element.mouseenter(() => {
                    element.addClass('hoveredRecord');
                });
                element.mouseleave(() => {
                    element.removeClass('hoveredRecord');
                });
            }
        }
    });