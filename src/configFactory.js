import Config from './config';
import {IdentityServiceSdkConfig} from 'identity-service-sdk';
import {SessionManagerConfig} from 'session-manager';
import {PartnerRepServiceSdkConfig} from 'partner-rep-service-sdk';

export default class ConfigFactory {

    /**
     * @param {object} data
     * @returns {Config}
     */
    static construct(data):Config {

        const identityServiceSdkConfig =
            new IdentityServiceSdkConfig(
                data.precorConnectApiBaseUrl
            );

        const sessionManagerConfig =
            new SessionManagerConfig(
                data.precorConnectApiBaseUrl,
                data.sessionManagerConfig.loginUrl,
                data.sessionManagerConfig.logoutUrl
            );
        
        const partnerRepServiceSdkConfig = 
              new PartnerRepServiceSdkConfig(
                  data.precorConnectApiBaseUrl
              );
        
        return new Config(
            identityServiceSdkConfig,
            sessionManagerConfig,
            partnerRepServiceSdkConfig
        );
    }

}
