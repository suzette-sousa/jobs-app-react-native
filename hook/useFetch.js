import { useState, useEffect } from 'react';
import axios from 'axios';
import config_pe from '../config-pe.json';

const useFetch = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  let url =
    'https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire';

  const testtt = async (response) => {
    const options = {
      method: 'GET',
      url: `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/${endpoint}`,
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
      params: { ...query },
    };

    await axios
      .request(options)
      .then((response) => {
        setData(query ? response.data.resultats : response.data);
        setIsLoading(false);
        setError(false);
      })
      .catch((err) => setError(err))
      .finally(setIsLoading(false));
  };
  //TODO: TO IMPROVE
  const fetchData = async () => {
    setIsLoading(true);
    try {
      await axios({
        method: 'post',
        url,
        data: config_pe,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then((response) => {
          try {
            if (endpoint) {
              testtt(response);
            }
          } catch (error) {
            setError(error);
          } finally {
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setError(error);
        });
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default useFetch;
