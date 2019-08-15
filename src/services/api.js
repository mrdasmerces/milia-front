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
}

export default MiliaService;