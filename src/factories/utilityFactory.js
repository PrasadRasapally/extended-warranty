import PrepareAddExtendedWarrantyRequestFactory from './prepareAddExtendedWarrantyRequestFactory';
import PrepareExtendedWarrantySubmitRequestFactory from './prepareExtendedWarrantySubmitRequestFactory';
import PrepareTermsPriceRequestFactory from './prepareTermsPriceRequestFactory';
import ApplyDefaultOrSelectedTermsFactory from './applyDefaultOrSelectedTermsFactory';

angular
    .module("extendedWarrantyWebApp.factories",[])
    .factory("prepareAddExtendedWarrantyRequestFactory", PrepareAddExtendedWarrantyRequestFactory.prepareAddExtendedWarrantyRequestFactory)
    .factory("prepareExtendedWarrantySubmitRequestFactory", PrepareExtendedWarrantySubmitRequestFactory.prepareExtendedWarrantySubmitRequestFactory)
    .factory("prepareTermsPriceRequestFactory", PrepareTermsPriceRequestFactory.prepareTermsPriceRequestFactory)
    .factory("applyDefaultOrSelectedTermsFactory", ApplyDefaultOrSelectedTermsFactory.applyDefaultOrSelectedTermsFactory);


