import { useEffect } from 'react';
import { AppState, Platform, AppStateStatus } from 'react-native';
import { focusManager } from '@tanstack/react-query';

function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
    }
}

export function useOnlineManager() {
    useEffect(() => {
      const subscription = AppState.addEventListener('change', onAppStateChange);
      return () => subscription.remove();
    }, []);
}