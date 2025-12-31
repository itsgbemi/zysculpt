
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

export const initDatadog = () => {
  // @ts-ignore
  const env = import.meta.env || {};

  const appId = env.VITE_DD_APPLICATION_ID;
  const clientToken = env.VITE_DD_CLIENT_TOKEN;
  const site = env.VITE_DD_SITE || 'datadoghq.com';
  const service = env.VITE_DD_SERVICE || 'zysculpt-ui';
  const environment = env.VITE_DD_ENV || 'development';

  if (appId && clientToken) {
    try {
      // Initialize Real User Monitoring (RUM)
      datadogRum.init({
        applicationId: appId,
        clientToken: clientToken,
        site: site,
        service: service,
        env: environment,
        version: '1.0.0',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20, // Record 20% of sessions for replay
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input',
      });
      
      datadogRum.startSessionReplayRecording();

      // Initialize Remote Logging
      datadogLogs.init({
        clientToken: clientToken,
        site: site,
        service: service,
        env: environment,
        forwardErrorsToLogs: true,
        sessionSampleRate: 100,
      });

      console.log('Datadog RUM & Logs Initialized');
    } catch (error) {
      console.error('Failed to initialize Datadog', error);
    }
  } else {
    console.warn('Datadog credentials missing in environment variables (VITE_DD_APPLICATION_ID, VITE_DD_CLIENT_TOKEN). Monitoring disabled.');
  }
};

export const setDatadogUser = (user: { id: string; email?: string; name?: string }) => {
  if (datadogRum.getInternalContext()) {
    datadogRum.setUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    datadogLogs.setUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }
};

export const clearDatadogUser = () => {
  if (datadogRum.getInternalContext()) {
    datadogRum.removeUser();
    datadogLogs.removeUser();
  }
};
