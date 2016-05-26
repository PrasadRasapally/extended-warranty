import pageNavigationTemplate from './templates/pageNavigation.html!text';

angular.module('extendedWarrantyWebApp.customDirectives',[])
    .directive('precorPageIndicator', function() {
        return {
            template : pageNavigationTemplate,
            link : function(scope, element, attrs) {
                console.log(scope);
                console.log(element);
            }
        };
    }).directive('focusOnEmpty', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {

                // set up event handler on the form element
                elem.on('submit', function () {

                    // find the first invalid element
                    var firstInvalid = elem[0].querySelector('.ng-invalid');

                    // if we find one, set focus
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                });
            }
        };
    });