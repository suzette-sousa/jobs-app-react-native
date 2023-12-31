import { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter, useSearchParams } from 'expo-router';
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from '../../components';

import { COLORS, icons, SIZES } from '../../constants';
import useFetch from '../../hook/useFetch';

const tabs = ['À propos', 'Compétences', 'Responsabilités'];

const JobDetails = () => {
  const params = useSearchParams();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useFetch(params?.id);

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [params]);

  const displayTabContent = () => {
    switch (activeTab) {
      case 'À propos':
        return <JobAbout info={data?.description ?? ['N/A']} />;

      case 'Compétences':
        return (
          <Specifics
            title={'Compétences'}
            points={data?.competences ?? ['N/A']}
          />
        );

      /*       case 'Responsabilités':
        return (
          <Specifics
            title={'Responsabilités'}
            points={data?.competences ?? ['N/A']}
          />
        ); */

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
          headerTitle: '',
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Quelque chose s'est mal passé</Text>
          ) : data?.length === 0 ? (
            <Text>Pas de données</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              {data?.length !== 0 && (
                <>
                  <Company
                    companyLogo={data?.entreprise?.logo}
                    jobTitle={data?.intitule}
                    companyName={data?.entreprise.nom}
                    location={data?.lieuTravail?.libelle}
                  />
                  <JobTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                  {displayTabContent()}
                </>
              )}
            </View>
          )}
        </ScrollView>

        <JobFooter
          url={
            data[0]?.job_google_link ??
            'https://careers.google.com/jobs/results'
          }
        />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
