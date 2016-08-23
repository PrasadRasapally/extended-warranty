import {IdentityServiceSdkConfig} from 'identity-service-sdk';
import {SessionManagerConfig} from 'session-manager';
import {PartnerRepServiceSdkConfig} from 'partner-rep-service-sdk';
import {RegistrationLogServiceSdkConfig} from 'registration-log-service-sdk';
import {ExtendedWarrantyServiceSdkConfig} from 'extended-warranty-service-sdk';
import {DiscountCodeServiceSdkConfig} from 'discount-code-service-sdk';
import {TermsPriceServiceSdkConfig} from 'terms-price-service-sdk';
import {AccountPermissionsServiceSdkConfig} from 'account-permissions-service-sdk';

export default class Config {

    _identityServiceSdkConfig : IdentityServiceSdkConfig;

    _sessionManagerConfig : SessionManagerConfig;
    
    _partnerRepServiceSdkConfig : PartnerRepServiceSdkConfig;

    _registrationLogServiceSdkConfig : RegistrationLogServiceSdkConfig;
    
    _extendedWarrantyServiceSdkConfig : ExtendedWarrantyServiceSdkConfig;
    
    _discountCodeServiceSdkConfig : DiscountCodeServiceSdkConfig;
    
    _termsPriceServiceSdkConfig : TermsPriceServiceSdkConfig;
    
    _accountPermissionsServiceSdkConfig : AccountPermissionsServiceSdkConfig;

    constructor(

        identityServiceSdkConfig:IdentityServiceSdkConfig,
        
        sessionManagerConfig : SessionManagerConfig,
        
        partnerRepServiceSdkConfig : PartnerRepServiceSdkConfig,

        registrationLogServiceSdkConfig : RegistrationLogServiceSdkConfig,
        
        extendedWarrantyServiceSdkConfig : ExtendedWarrantyServiceSdkConfig,
        
        discountCodeServiceSdkConfig : DiscountCodeServiceSdkConfig,
        
        termsPriceServiceSdkConfig : TermsPriceServiceSdkConfig,
        
        accountPermissionsServiceSdkConfig : AccountPermissionsServiceSdkConfig
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

        if (!registrationLogServiceSdkConfig) {
            throw new TypeError('registrationLogServiceSdkConfig required');
        }
        this._registrationLogServiceSdkConfig = registrationLogServiceSdkConfig;
        
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
        
        if (!accountPermissionsServiceSdkConfig) {
            throw new TypeError('accountPermissionsServiceSdkConfig required');
        }
        this._accountPermissionsServiceSdkConfig = accountPermissionsServiceSdkConfig;
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

    get registrationLogServiceSdkConfig(){
        return this._registrationLogServiceSdkConfig;
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
    
    get accountPermissionsServiceSdkConfig(){
        return this._accountPermissionsServiceSdkConfig;
    }
}