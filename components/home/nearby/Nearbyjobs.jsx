import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import styles from './nearbyjobs.style';
import { COLORS } from '../../../constants';
import NearbyJobCard from '../../common/cards/nearby/NearbyJobCard';
import useFetch from '../../../hook/useFetch';

const Nearbyjobs = () => {
  const router = useRouter();

  const { data, isLoading, error } = useFetch('search', {
    sort: '2',
    range: '1-5',
    commune: '51230',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs autour de toi</Text>
        <TouchableOpacity>
          <Text style={styles.headerBtn}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" colors={COLORS.primary} />
        ) : error ? (
          <Text>Quelquechose ne s'est pas bien passé</Text>
        ) : (
          data?.map((job) => (
            <NearbyJobCard
              job={job}
              key={`nearby-job-${job?.id}`}
              handleNavigate={() => router.push(`/job-details/${job?.id}`)}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default Nearbyjobs;
