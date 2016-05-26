import {IdentityServiceSdkConfig} from 'identity-service-sdk';
import {SessionManagerConfig} from 'session-manager';
import {PartnerRepServiceSdkConfig} from 'partner-rep-service-sdk';

export default class Config {

    _identityServiceSdkConfig : IdentityServiceSdkConfig;

    _sessionManagerConfig : SessionManagerConfig;
    
    _partnerRepServiceSdkConfig : PartnerRepServiceSdkConfig;

    constructor(
        identityServiceSdkConfig:IdentityServiceSdkConfig,
        
        sessionManagerConfig : SessionManagerConfig,
        
        partnerRepServiceSdkConfig : PartnerRepServiceSdkConfig
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
}