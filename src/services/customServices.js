import SessionManagerService from './sessionManagerService';
import IdentityService from './identityService';
import ExtendedWarrantyService from './extendedWarrantyService';
import PartnerRepService from './partnerRepService';
import DiscountCodeService from './discountCodeService';

angular
    .module("extendedWarrantyWebApp.services",[])
    .service("sessionManagerService", SessionManagerService)
    .service("identityService", IdentityService)
    .service("extendedWarrantyService", ExtendedWarrantyService)
    .service("partnerRepService", PartnerRepService)
    .service("discountCodeService", DiscountCodeService);


