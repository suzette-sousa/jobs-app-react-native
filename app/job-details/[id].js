import { useCallback, useState } from 'react';
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

  const { data, isLoading, error, refetch } = useFetch('job-details', {
    job_id: params.id,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = () => {};

  const displayTabContent = () => {
    switch (activeTab) {
      case 'À propos':
        return <JobAbout info={data[0].job_description ?? ['N/A']} />;

      case 'Compétences':
        return (
          <Specifics
            title={'Compétences'}
            points={data[0].job_highlights?.Qualifications ?? ['N/A']}
          />
        );

      case 'Responsabilités':
        return (
          <Specifics
            title={'Responsabilités'}
            points={data[0].job_highlights?.Responsibilities ?? ['N/A']}
          />
        );

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
          ) : data.length === 0 ? (
            <Text>Pas de données</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
              />

              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
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
