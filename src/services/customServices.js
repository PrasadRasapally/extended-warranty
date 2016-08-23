import SessionManagerService from './sessionManagerService';
import IdentityService from './identityService';
import ExtendedWarrantyService from './extendedWarrantyService';
import PartnerRepService from './partnerRepService';
import RegistrationLogService from './registrationLogService';
import DiscountCodeService from './discountCodeService';
import TermsPriceService from './termsPriceService';

angular
    .module("extendedWarrantyWebApp.services",[])
    .service("sessionManagerService", SessionManagerService)
    .service("identityService", IdentityService)
    .service("extendedWarrantyService", ExtendedWarrantyService)
    .service("partnerRepService", PartnerRepService)
    .service("registrationLogService", RegistrationLogService)
    .service("discountCodeService", DiscountCodeService)
    .service("termsPriceService", TermsPriceService);


