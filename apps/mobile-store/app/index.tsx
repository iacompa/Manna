import { getStoredLanguage, isOnboardingComplete } from '@/lib/onboarding-storage';
import { setAppLanguage, type AppLanguage } from '@/i18n';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexGate() {
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const [done, lang] = await Promise.all([isOnboardingComplete(), getStoredLanguage()]);
      if (lang === 'en' || lang === 'es') {
        setAppLanguage(lang as AppLanguage);
      }
      if (mounted) {
        setComplete(done);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!complete) {
    return <Redirect href="/onboarding/language" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
