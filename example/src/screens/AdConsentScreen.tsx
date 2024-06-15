import * as React from "react";

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentInfo,
  AdsConsentUserChoices
} from "react-native-admanager-mobile-ads";
import { ListItem } from "../components/ListItem";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray"
  },
  infoText: {
    marginHorizontal: 16,
    marginBottom: 16
  }
});
export function AdConsentScreen() {
  const [userChoices, setUserChoices] = React.useState<
    AdsConsentUserChoices | undefined
  >(undefined);

  const [consentInfo, setConsentInfo] = React.useState<
    AdsConsentInfo | undefined
  >(undefined);

  const [purposeConsents, setPurposeConsents] = React.useState<string>("");
  const [gdprApplies, setGdprApplies] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const bootstrap = async () => {
      const info = await AdsConsent.getConsentInfo();
      setConsentInfo(info);
      AdsConsent.requestConsentInfoUpdate({
        debugGeography: AdsConsentDebugGeography.EEA
        // tagForUnderAgeOfConsent: false,
        // testDeviceIdentifiers: []
      }).then((_info) => setConsentInfo(_info));
      AdsConsent.loadAndShowConsentFormIfRequired().catch((error) => {
        console.log(error);
        Alert.alert(
          "Error loadAndShowConsentFormIfRequired",
          (error as Error).message
        );
      });
    };
    bootstrap();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Text>ConsentInfo: {JSON.stringify(consentInfo)}</Text>
      <ScrollView style={styles.container} contentContainerStyle={{}}>
        <ListItem
          title="showForm"
          onPress={() => {
            AdsConsent.showForm();
          }}
        />
        <ListItem
          title="showPrivacyOptionsForm"
          onPress={() => {
            AdsConsent.showPrivacyOptionsForm();
          }}
        />
        <ListItem
          title="loadAndShowConsentFormIfRequired"
          onPress={() => {
            AdsConsent.loadAndShowConsentFormIfRequired();
          }}
        />
        <ListItem
          title="requestConsentInfoUpdate"
          onPress={() => {
            AdsConsent.requestConsentInfoUpdate();
          }}
        />
        <ListItem
          title="getPurposeConsents"
          onPress={() => {
            AdsConsent.getPurposeConsents().then((uc) =>
              setPurposeConsents(uc)
            );
          }}
        />
        <Text style={styles.infoText}>
          PurposeConsents: {JSON.stringify(purposeConsents)}
        </Text>
        <ListItem
          title="getUserChoices"
          onPress={() => {
            AdsConsent.getUserChoices().then((uc) => setUserChoices(uc));
          }}
        />

        <Text style={styles.infoText}>
          UserChoices: {JSON.stringify(userChoices)}
        </Text>
        <ListItem
          title="getGdprApplies"
          onPress={() => {
            AdsConsent.getGdprApplies().then((uc) => setGdprApplies(uc));
          }}
        />
        <Text style={styles.infoText}>
          GDPR Applies: {JSON.stringify(gdprApplies)}
        </Text>
        <ListItem
          title="Reset (only for testing purposes)"
          onPress={() => {
            AdsConsent.reset();
          }}
        />
      </ScrollView>
    </View>
  );
}
