import { Platform } from 'react-native';

/**
 * 1. 배포용 실제 서버 주소 (Production)
 * 배포 빌드(Release Build)를 하면 이 주소가 사용됩니다.
 */
const PROD_URL = 'https://www.the-labot.site/api';

/**
 * 2. 개발용 로컬 주소 (Development)
 * 팀원들이 npm run android 등으로 실행할 때 이 주소가 사용됩니다.
 */
const DEV_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api'  // 안드로이드 에뮬레이터용
  : 'http://localhost:8080/api'; // iOS 시뮬레이터용

/**
 * 3. 최종 결정 로직
 * __DEV__가 true면 개발 중, false면 배포된 상태입니다.
 */
export const BASE_URL = __DEV__ ? DEV_URL : PROD_URL;