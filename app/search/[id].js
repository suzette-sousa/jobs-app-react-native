import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { Text, SafeAreaView } from 'react-native';
import axios from 'axios';

import { ScreenHeaderBtn, NearbyJobCard } from '../../components';
import { COLORS, icons, SIZES } from '../../constants';
import styles from '../../styles/search';

import config_pe from '../../config-pe.json';

const JobSearch = () => {
  const params = useSearchParams();
  const router = useRouter();

  const [searchResult, setSearchResult] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [page, setPage] = useState(10);

  let url =
    'https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire';

  const handleSearch = async () => {
    setSearchLoader(true);
    setSearchResult([]);
    try {
      await axios({
        method: 'post',
        url,
        data: config_pe,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then((response) => {
          try {
            const options = {
              method: 'GET',
              url: `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search`,
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
              params: { motsCles: params?.id, range: `${page - 9}-${page}` },
            };

            axios.request(options).then((response) => {
              setSearchResult(response.data.resultats);
              setSearchLoader(false);
            });
          } catch (error) {
            setSearchError(error);
          } finally {
            setSearchLoader(false);
          }
        })
        .catch((error) => {
          setSearchError(error);
        });
    } catch (error) {
      setSearchError(error);
    }
  };

  const handlePagination = (direction) => {
    if (direction === 'left' && page > 1) {
      setPage(page - 10);
      handleSearch();
    } else if (direction === 'right') {
      setPage(page + 10);
      handleSearch();
    }
  };

  useEffect(() => {
    if (params.id) handleSearch();
  }, [params]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerTitle: '',
        }}
      />

      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <NearbyJobCard
            job={item}
            handleNavigate={() => router.push(`/job-details/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SIZES.medium, rowGap: SIZES.medium }}
        ListHeaderComponent={() => (
          <>
            <View style={styles.container}>
              <Text style={styles.noOfSearchedJobs}>
                Votre recherche contenant le mot-clé :
              </Text>
              <Text style={styles.searchTitle}>{params.id}</Text>
            </View>
            <View style={styles.loaderContainer}>
              {searchLoader ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                searchError && <Text>Oups quelque chose s'est mal passé</Text>
              )}
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <>
            {searchResult?.length ? (
              <View style={styles.footerContainer}>
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => handlePagination('left')}
                >
                  <Image
                    source={icons.chevronLeft}
                    style={styles.paginationImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <View style={styles.paginationTextBox}>
                  <Text style={styles.paginationText}>
                    {page - 9}-{page}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => handlePagination('right')}
                >
                  <Image
                    source={icons.chevronRight}
                    style={styles.paginationImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {!searchResult && !searchLoader && <Text>Aucun résultat</Text>}
              </>
            )}
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default JobSearch;
