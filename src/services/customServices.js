import SessionManagerService from './sessionManagerService';
import IdentityService from './identityService';
import ExtendedWarrantyService from './extendedWarrantyService';
import PartnerRepService from './partnerRepService';

angular
    .module("extendedWarrantyWebApp.services",[])
    .service("sessionManagerService", SessionManagerService)
    .service("identityService", IdentityService)
    .service("extendedWarrantyService", ExtendedWarrantyService)
    .service("partnerRepService", PartnerRepService);


