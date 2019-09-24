import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

class MiliaService {
  static api;

  constructor(){
    api = axios.create({
      baseURL: 'https://909qolbumk.execute-api.us-east-1.amazonaws.com/dev',
      //baseURL: 'http://localhost:3001',
    });

    api.interceptors.request.use(async (config) => {
      try {
        const token = await AsyncStorage.getItem('@Milia:token');
    
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers.accessToken = token;
        }
    
        return config;
      } catch (err) {
        alert(err);
      }
    });
  }

  async authenticate(username, password){
    const ret = await api.post('/authenticate', {
      username, 
      password,
    });

    return ret;
  };

  async askMilia(queryText, paramsUser){
    const ret = await api.post('/ask-milia?originChannel=App', {
      queryText, 
      paramsUser,
    });

    return ret;
  };

  async miliaSignup(queryText, idSessionSignup){
    const ret = await api.post('/milia-signup', {
      queryText, 
      idSessionSignup,
    });

    return ret;
  };  

  async getResume(email){
    const ret = await api.get(`/me?email=${email}`);

    return ret;
  };
  
  async getPreviousMessages(email){
    const ret = await api.get(`/messages?email=${email}`);

    return ret;    
  }

  async getItinerary(email){
    const ret = await api.get(`/itinerary?email=${email}`);

    return ret;    
  }  
}

export default MiliaService;