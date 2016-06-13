import PrepareAddExtendedWarrantyRequestFactory from './prepareAddExtendedWarrantyRequestFactory';
import PrepareExtendedWarrantySubmitRequestFactory from './prepareExtendedWarrantySubmitRequestFactory';
import PrepareExtendedWarrantyTermsRequestFactory from './prepareExtendedWarrantyTermsRequestFactory';

angular
    .module("extendedWarrantyWebApp.factories",[])
    .factory("prepareAddExtendedWarrantyRequestFactory", PrepareAddExtendedWarrantyRequestFactory.prepareAddExtendedWarrantyRequestFactory)
    .factory("prepareExtendedWarrantySubmitRequestFactory", PrepareExtendedWarrantySubmitRequestFactory.prepareExtendedWarrantySubmitRequestFactory)
    .factory("prepareExtendedWarrantyTermsRequestFactory", PrepareExtendedWarrantyTermsRequestFactory.prepareExtendedWarrantyTermsRequestFactory);


