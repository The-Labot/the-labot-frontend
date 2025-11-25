import { Platform } from 'react-native';

export const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'   // ← /api 포함
    : 'http://localhost:8080/api';