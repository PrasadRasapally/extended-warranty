import Config from './config';
import {IdentityServiceSdkConfig} from 'identity-service-sdk';
import {SessionManagerConfig} from 'session-manager';
import {PartnerRepServiceSdkConfig} from 'partner-rep-service-sdk';
import {ExtendedWarrantyServiceSdkConfig} from 'extended-warranty-service-sdk';
import {DiscountCodeServiceSdkConfig} from 'discount-code-service-sdk';
import {TermsPriceServiceSdkConfig} from 'terms-price-service-sdk';
import {AccountPermissionsServiceSdkConfig} from 'account-permissions-service-sdk';

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
        
        const extendedWarrantyServiceSdkConfig = 
              new ExtendedWarrantyServiceSdkConfig(
                  data.precorConnectApiBaseUrl
              );
        
        const discountCodeServiceSdkConfig = 
              new DiscountCodeServiceSdkConfig(
                  data.precorConnectApiBaseUrl
              );
        
        const termsPriceServiceSdkConfig = 
              new TermsPriceServiceSdkConfig(
                  data.precorConnectApiBaseUrl
              );
        
        const accountPermissionsServiceSdkConfig = 
              new AccountPermissionsServiceSdkConfig(
                  data.precorConnectApiBaseUrl
              );
        
        return new Config(
            identityServiceSdkConfig,
            sessionManagerConfig,
            partnerRepServiceSdkConfig,
            extendedWarrantyServiceSdkConfig,
            discountCodeServiceSdkConfig,
            termsPriceServiceSdkConfig,
            accountPermissionsServiceSdkConfig
        );
    }

}
