// ⭐ 새 마이페이지 - 현장 정보 fetch 후 표시하는 버전

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { getTempAccessToken } from "../api/auth";
import { BASE_URL } from "../api/config";

type Props = NativeStackScreenProps<RootStackParamList, "ManagerMyPage">;

interface SiteDetail {
  siteId: number;
  headOfficeId: number;
  projectName: string;
  contractType: string;
  siteManagerName: string;
  contractAmount: number;
  clientName: string;
  primeContractorName: string;
  address: string;
  latitude: number;
  longitude: number;
  contractDate: string;
  startDate: string;
  endDate: string;

  laborCostAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    informPhoneNumber: string;
  };

  insuranceResponsibility: string;
  employmentInsuranceSiteNum: string;
  primeContractorMgmtNum: string;

  socialIns: {
    pensionDailyBizSymbol: string;
    pensionDailyJoinDate: string;
    pensionRegularBizSymbol: string;
    pensionRegularJoinDate: string;
    pensionFee: number;
    pensionPaid: number;
    pensionRate: number;

    healthDailyBizSymbol: string;
    healthDailyJoinDate: string;
    healthRegularBizSymbol: string;
    healthRegularJoinDate: string;
    healthFee: number;
    healthPaid: number;
    healthRate: number;

    employDailyMgmtNum: string;
    employDailyJoinDate: string;
    employRegularMgmtNum: string;
    employRegularJoinDate: string;
    employFee: number;
    employPaid: number;
    employRate: number;

    accidentDailyMgmtNum: string;
    accidentDailyJoinDate: string;
    accidentRegularMgmtNum: string;
    accidentRegularJoinDate: string;
    accidentFee: number;
    accidentPaid: number;
    accidentRate: number;

    severanceTarget: boolean;
    severanceType: string;
    severanceDeductionNum: string;
    severanceJoinDate: string;
    dailyDeductionAmount: number;
    totalSeverancePaidAmount: number;
    severancePaymentRate: number;
  };

  kisconReportTarget: boolean;
}

export default function ManagerMyPageScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState<SiteDetail | null>(null);

    // 동료 관리자 목록 타입
  interface CoManager {
    id: number;
    name: string;
    role: string;
    phone: string;
    isMe: boolean;
  }

  // state 추가
  const [coWorkers, setCoWorkers] = useState<CoManager[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  /** ⭐ 현장 데이터 조회 */
  const fetchMySite = async () => {
  try {
    const token = getTempAccessToken();
    if (!token) throw new Error("로그인이 필요합니다.");

    const res = await fetch(`${BASE_URL}/manager/sites`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) throw new Error(`현장 조회 실패 (status ${res.status})`);

    // 🔥 JSON 대신 text로 안전하게 받기
    const text = await res.text();

    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      console.log("❌ JSON 파싱 실패:", e);
    }

    setSite(json?.data ?? null);
  } catch (err) {
    console.log("🔥 현장 조회 Error:", err);
    Alert.alert("오류", "현장 정보를 불러오지 못했습니다.");
  } finally {
    setLoading(false);
  }
};
  // 동료 관리자 API 호출
  const fetchCoWorkers = async () => {
    try {
      const token = getTempAccessToken();
      console.log("현재 토큰:", getTempAccessToken());
      const res = await fetch(`${BASE_URL}/manager/co-workers`, {
        method: "GET",
        headers: { Authorization: token },
      });
     console.log("📡 응답 status:", res.status);

      const text = await res.text();
        console.log("📡 응답 text:", text);

      const json = text ? JSON.parse(text) : null;

      setCoWorkers(json?.data ?? []);
    } catch (err) {
      console.log("🔥 동료 관리자 조회 실패:", err);
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    fetchMySite();
    fetchCoWorkers();   // ⭐ 동료 관리자 함께 불러오기

  }, []);

  /** 로그아웃 */
  const handleLogout = () => {
    Alert.alert("로그아웃", "로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: () => navigation.replace("Login"),
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>로딩중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>마이페이지</Text>
            <Text style={styles.headerSubtitle}>My Page</Text>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.headerLogoutBtn}>
            <Text style={styles.headerLogoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 메인 내용 */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: isTablet ? 40 : 20,
            paddingVertical: isTablet ? 24 : 16,
          }}
        >
          {/* 계정 관리 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>계정 관리</Text>
            <View style={styles.accountButtonRow}>
              <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]}>
                <Text style={styles.primaryBtnText}>비밀번호 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineRedBtn, { flex: 1 }]}
                onPress={handleLogout}
              >
                <Text style={styles.outlineRedBtnText}>로그아웃</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ⭐ 현장 정보 카드 */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionIcon}>🏗️</Text>
              <Text style={styles.cardTitle}>현장 정보</Text>
            </View>

            {!site ? (
              <Text style={{ padding: 10, color: "#6B7280" }}>현장 정보 없음</Text>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>현장명</Text>
                  <Text style={styles.infoValue}>{site.projectName}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>현장 주소</Text>
                  <Text style={styles.infoValue}>{site.address}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>기간</Text>
                  <Text style={styles.infoValue}>
                    {site.startDate} ~ {site.endDate}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>현장 관리자</Text>
                  <Text style={styles.infoValue}>{site.siteManagerName}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>계좌</Text>
                  <Text style={styles.infoValue}>
                    {site.laborCostAccount.bankName} / {site.laborCostAccount.accountNumber}
                  </Text>
                </View>
                <View style={styles.infoRow}>
  <Text style={styles.infoLabel}>계약 형태</Text>
  <Text style={styles.infoValue}>{site.contractType}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>계약 금액</Text>
  <Text style={styles.infoValue}>{site.contractAmount.toLocaleString()} 원</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>발주처</Text>
  <Text style={styles.infoValue}>{site.clientName}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>시공사</Text>
  <Text style={styles.infoValue}>{site.primeContractorName}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>계약일</Text>
  <Text style={styles.infoValue}>{site.contractDate}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>위도</Text>
  <Text style={styles.infoValue}>{site.latitude}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>경도</Text>
  <Text style={styles.infoValue}>{site.longitude}</Text>
</View>

{/* 보험 책임 */}
<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>보험 책임</Text>
  <Text style={styles.infoValue}>{site.insuranceResponsibility}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>고용보험 번호</Text>
  <Text style={styles.infoValue}>{site.employmentInsuranceSiteNum}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>원도급사 관리번호</Text>
  <Text style={styles.infoValue}>{site.primeContractorMgmtNum}</Text>
</View>


              </>
            )}
          </View>
            {/* ⭐ 동료 관리자 카드 */}
<View style={styles.card}>
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionIcon}>👥</Text>
    <Text style={styles.cardTitle}>현장 관리자</Text>
    <Text style={styles.managerCountText}>총 {coWorkers.length}명</Text>
  </View>

  {loadingWorkers ? (
    <Text style={{ padding: 10, color: "#6B7280" }}>불러오는 중...</Text>
  ) : coWorkers.length === 0 ? (
    <Text style={{ padding: 10, color: "#6B7280" }}>등록된 관리자가 없습니다</Text>
  ) : (
    coWorkers.map((m, index) => {
      const isMe = m.isMe;

      return (
        <View
          key={`${m.id}-${index}`}
          style={[
            styles.managerRow,
            isMe ? styles.managerRowActive : null,
          ]}
        >
          {/* 아바타 */}
          <View
            style={[
              styles.avatar,
              isMe ? styles.avatarActive : styles.avatarNormal,
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                isMe ? styles.avatarTextActive : null,
              ]}
            >
              {m.name[0]}
            </Text>
          </View>

          {/* 텍스트 */}
          <View style={{ flex: 1 }}>
            <View style={styles.managerNameRow}>
              <Text
                style={[
                  styles.managerName,
                  isMe ? styles.managerNameActive : null,
                ]}
              >
                {m.name}
              </Text>

              {isMe && (
                <View style={styles.meBadge}>
                  <Text style={styles.meBadgeText}>나</Text>
                </View>
              )}
            </View>

            <Text style={styles.managerRole}>{m.role}</Text>
            <Text style={styles.managerContact}>{m.phone}</Text>
          </View>
        </View>
      );
    })
  )}
</View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  root: {
    flex: 1,
  },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  backArrow: {
    fontSize: 18,
    color: '#4B5563',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerLogoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  headerLogoutText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },

  scrollContent: {
    paddingBottom: 32,
    gap: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },

  /* 계정 관리 */
  accountButtonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  outlineRedBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
  },
  outlineRedBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },

  /* 섹션 공통 */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 6,
  },

  /* 현장 정보 */
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    width: 80,
    fontSize: 12,
    color: '#6B7280',
  },
  infoLabelWithIcon: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabelIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },

  /* 현장 관리자 */
  managerCountText: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#6B7280',
  },
  managerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  managerRowActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarNormal: {
    backgroundColor: '#E5E7EB',
  },
  avatarActive: {
    backgroundColor: '#2563EB',
  },
  avatarText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
  },
  avatarTextActive: {
    color: '#FFFFFF',
  },
  managerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  managerName: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  managerNameActive: {
    color: '#1D4ED8',
  },
  meBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  meBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  managerRole: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 1,
  },
  managerContact: {
    fontSize: 11,
    color: '#9CA3AF',
  },


});
