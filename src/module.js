import angular from 'angular';
import 'angular-route';
import 'angular-bootstrap';
import 'angular-messages';
import './bootstrap';
import 'header';
import 'footer';
import RouteConfig from './routeConfig';
import ConfigFactory from './configFactory';
import Config from './config';
import configData from './configData.json!json';
import IdentityServiceSdk from 'identity-service-sdk';
import SessionManager from 'session-manager';
import PartnerRepServiceSdk from 'partner-rep-service-sdk';
import ExtendedWarrantyServiceSdk from 'extended-warranty-service-sdk';
import DiscountCodeServiceSdk from 'discount-code-service-sdk';
import TermsPriceServiceSdk from 'terms-price-service-sdk';

import './directives/customDirectives';
import './services/customServices';
import './factories/utilityFactory';
import './style.css!css';

angular
    .module(
        "extendedWarrantyWebApp.module",
        [   
            'ngRoute',
            'ui.bootstrap',
            'ngMessages',
            'header.module',
            'footer.module',
            'extendedWarrantyWebApp.customDirectives',
            'extendedWarrantyWebApp.services',
            'extendedWarrantyWebApp.factories'
        ]
    )
    .factory(
        'config',
         function(){return ConfigFactory.construct(configData);}
    )
    .factory(
        'identityServiceSdk',
        [
            'config',
             config => new IdentityServiceSdk(config.identityServiceSdkConfig)
        ]
    )
    .factory(
        'sessionManager',
        [
            'config',
             config => new SessionManager(config.sessionManagerConfig)
        ]
    )
    .factory(
        'partnerRepServiceSdk',
        [
            'config',
             config => new PartnerRepServiceSdk(config.partnerRepServiceSdkConfig)
        ]
    )
    .factory(
        'extendedWarrantyServiceSdk',
        [
            'config',
             config => new ExtendedWarrantyServiceSdk(config.extendedWarrantyServiceSdkConfig)
        ]
    )
    .factory(
        'discountCodeServiceSdk',
        [
            'config',
             config => new DiscountCodeServiceSdk(config.discountCodeServiceSdkConfig)
        ]
    )
    .factory(
        'termsPriceServiceSdk',
        [
            'config',
             config => new TermsPriceServiceSdk(config.termsPriceServiceSdkConfig)
        ]
    )
    .config(['$routeProvider', $routeProvider => new RouteConfig($routeProvider)]);