import {IdentityServiceSdkConfig} from 'identity-service-sdk';
import {SessionManagerConfig} from 'session-manager';
import {PartnerRepServiceSdkConfig} from 'partner-rep-service-sdk';
import {ExtendedWarrantyServiceSdkConfig} from 'extended-warranty-service-sdk';
import {DiscountCodeServiceSdkConfig} from 'discount-code-service-sdk';
import {TermsPriceServiceSdkConfig} from 'terms-price-service-sdk';

export default class Config {

    _identityServiceSdkConfig : IdentityServiceSdkConfig;

    _sessionManagerConfig : SessionManagerConfig;
    
    _partnerRepServiceSdkConfig : PartnerRepServiceSdkConfig;
    
    _extendedWarrantyServiceSdkConfig : ExtendedWarrantyServiceSdkConfig;
    
    _discountCodeServiceSdkConfig : DiscountCodeServiceSdkConfig;
    
    _termsPriceServiceSdkConfig : TermsPriceServiceSdkConfig;

    constructor(
        identityServiceSdkConfig:IdentityServiceSdkConfig,
        
        sessionManagerConfig : SessionManagerConfig,
        
        partnerRepServiceSdkConfig : PartnerRepServiceSdkConfig,
        
        extendedWarrantyServiceSdkConfig : ExtendedWarrantyServiceSdkConfig,
        
        discountCodeServiceSdkConfig : DiscountCodeServiceSdkConfig,
        
        termsPriceServiceSdkConfig : TermsPriceServiceSdkConfig
    ) {

        if (!identityServiceSdkConfig) {
            throw new TypeError('identityServiceSdkConfig required');
        }
        this._identityServiceSdkConfig = identityServiceSdkConfig;

        if (!sessionManagerConfig) {
            throw new TypeError('sessionManagerConfig required');
        }
        this._sessionManagerConfig = sessionManagerConfig;
        
        if (!partnerRepServiceSdkConfig) {
            throw new TypeError('partnerRepServiceSdkConfig required');
        }
        this._partnerRepServiceSdkConfig = partnerRepServiceSdkConfig;
        
        if (!extendedWarrantyServiceSdkConfig) {
            throw new TypeError('extendedWarrantyServiceSdkConfig required');
        }
        this._extendedWarrantyServiceSdkConfig = extendedWarrantyServiceSdkConfig;
        
        if (!discountCodeServiceSdkConfig) {
            throw new TypeError('discountCodeServiceSdkConfig required');
        }
        this._discountCodeServiceSdkConfig = discountCodeServiceSdkConfig;
        
        if (!termsPriceServiceSdkConfig) {
            throw new TypeError('termsPriceServiceSdkConfig required');
        }
        this._termsPriceServiceSdkConfig = termsPriceServiceSdkConfig;
    }

    get identityServiceSdkConfig() {
        return this._identityServiceSdkConfig;
    }

    get sessionManagerConfig() {
        return this._sessionManagerConfig;
    }
    
    get partnerRepServiceSdkConfig(){
        return this._partnerRepServiceSdkConfig;
    }
    
    get extendedWarrantyServiceSdkConfig(){
        return this._extendedWarrantyServiceSdkConfig;
    }
    
    get discountCodeServiceSdkConfig(){
        return this._discountCodeServiceSdkConfig;
    }
    
    get termsPriceServiceSdkConfig(){
        return this._termsPriceServiceSdkConfig;
    }
}