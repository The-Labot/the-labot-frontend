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

  socialIns: any;

  kisconReportTarget: boolean;
}

export default function ManagerMyPageScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState<SiteDetail | null>(null);

  // ⭐ 사회보험 접기/펼치기 상태
const [socialOpen, setSocialOpen] = useState(false);

  interface CoManager {
    id: number;
    name: string;
    role: string;
    phone: string;
    isMe: boolean;
  }

  const [coWorkers, setCoWorkers] = useState<CoManager[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  /** ⭐ 현장 정보 fetch */
  const fetchMySite = async () => {
    try {
      const token = getTempAccessToken();
      if (!token) throw new Error("로그인이 필요합니다.");

      const res = await fetch(`${BASE_URL}/manager/sites`, {
        method: "GET",
        headers: { Authorization: token },
      });

      const text = await res.text();

      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {}

      setSite(json?.data ?? null);
    } catch (err) {
      Alert.alert("오류", "현장 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /** ⭐ 동료 관리자 fetch */
  const fetchCoWorkers = async () => {
    try {
      const token = getTempAccessToken();

      const res = await fetch(`${BASE_URL}/manager/co-workers`, {
        method: "GET",
        headers: { Authorization: token },
      });

      const text = await res.text();
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
    fetchCoWorkers();
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

        {/* 메인 */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: isTablet ? 40 : 20,
            paddingVertical: isTablet ? 24 : 16,
          }}
        >

          {/* ⭐ 계정 관리 */}
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

          {/* ⭐ 현장 정보 */}
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
                  <Text style={styles.infoValue}>{site?.projectName ?? "-"}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>현장 주소</Text>
                  <Text style={styles.infoValue}>{site?.address ?? "-"}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>기간</Text>
                  <Text style={styles.infoValue}>
                    {(site?.startDate ?? "-")} ~ {(site?.endDate ?? "-")}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>현장 관리자</Text>
                  <Text style={styles.infoValue}>{site?.siteManagerName ?? "-"}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>계좌</Text>
                  <Text style={styles.infoValue}>
                    {(site?.laborCostAccount?.bankName ?? "-")} / {(site?.laborCostAccount?.accountNumber ?? "-")}
                  </Text>
                </View>
                                {/* 계약 형태 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>계약 형태</Text>
                  <Text style={styles.infoValue}>{site?.contractType ?? "-"}</Text>
                </View>

                {/* 계약 금액 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>계약 금액</Text>
                  <Text style={styles.infoValue}>
                    {site?.contractAmount
                      ? site.contractAmount.toLocaleString() + " 원"
                      : "-"}
                  </Text>
                </View>

                {/* 발주처 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>발주처</Text>
                  <Text style={styles.infoValue}>{site?.clientName ?? "-"}</Text>
                </View>

                {/* 시공사 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>시공사</Text>
                  <Text style={styles.infoValue}>{site?.primeContractorName ?? "-"}</Text>
                </View>

                {/* 계약일 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>계약일</Text>
                  <Text style={styles.infoValue}>{site?.contractDate ?? "-"}</Text>
                </View>

                {/* 위도 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>위도</Text>
                  <Text style={styles.infoValue}>{site?.latitude ?? "-"}</Text>
                </View>

                {/* 경도 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>경도</Text>
                  <Text style={styles.infoValue}>{site?.longitude ?? "-"}</Text>
                </View>

                {/* 보험 책임 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>보험 책임</Text>
                  <Text style={styles.infoValue}>{site?.insuranceResponsibility ?? "-"}</Text>
                </View>

                {/* 고용보험 번호 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>고용보험 번호</Text>
                  <Text style={styles.infoValue}>{site?.employmentInsuranceSiteNum ?? "-"}</Text>
                </View>

                {/* 원도급사 관리번호 */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>원도급사 번호</Text>
                  <Text style={styles.infoValue}>{site?.primeContractorMgmtNum ?? "-"}</Text>
                </View>
              </>
            )}
          </View>
          {/* ⭐ 사회보험 정보 - Accordion */}
<View style={styles.card}>
  <TouchableOpacity
    style={styles.accordionHeader}
    onPress={() => setSocialOpen(!socialOpen)}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles.sectionIcon}>🛡️</Text>
      <Text style={styles.cardTitle}>사회보험 정보</Text>
    </View>

    {/* 화살표 */}
    <Text style={styles.arrow}>{socialOpen ? "▲" : "▼"}</Text>
  </TouchableOpacity>

  {/* 펼쳐졌을 때만 보이는 내용 */}
  {socialOpen && (
    <>
      {!site?.socialIns ? (
        <Text style={{ padding: 10, color: "#6B7280" }}>등록된 정보 없음</Text>
      ) : (
        <>
          {/* 국민연금 */}
          <Text style={styles.socialTitle}>국민연금</Text>
          <Row label="일용 사업장 기호" value={site.socialIns.pensionDailyBizSymbol ?? "-"} />
          <Row label="일용 취득일" value={site.socialIns.pensionDailyJoinDate ?? "-"} />
          <Row label="상용 사업장 기호" value={site.socialIns.pensionRegularBizSymbol ?? "-"} />
          <Row label="상용 취득일" value={site.socialIns.pensionRegularJoinDate ?? "-"} />
          <Row label="보험료" value={site.socialIns.pensionFee?.toLocaleString() ?? "-"} />
          <Row label="납부액" value={site.socialIns.pensionPaid?.toLocaleString() ?? "-"} />
          <Row label="보험율" value={site.socialIns.pensionRate ?? "-"} />

          {/* 건강보험 */}
          <Text style={styles.socialTitle}>건강보험</Text>
          <Row label="일용 사업장 기호" value={site.socialIns.healthDailyBizSymbol ?? "-"} />
          <Row label="일용 취득일" value={site.socialIns.healthDailyJoinDate ?? "-"} />
          <Row label="상용 사업장 기호" value={site.socialIns.healthRegularBizSymbol ?? "-"} />
          <Row label="상용 취득일" value={site.socialIns.healthRegularJoinDate ?? "-"} />
          <Row label="보험료" value={site.socialIns.healthFee?.toLocaleString() ?? "-"} />
          <Row label="납부액" value={site.socialIns.healthPaid?.toLocaleString() ?? "-"} />
          <Row label="보험율" value={site.socialIns.healthRate ?? "-"} />

          {/* 고용보험 */}
          <Text style={styles.socialTitle}>고용보험</Text>
          <Row label="일용 관리번호" value={site.socialIns.employDailyMgmtNum ?? "-"} />
          <Row label="일용 취득일" value={site.socialIns.employDailyJoinDate ?? "-"} />
          <Row label="상용 관리번호" value={site.socialIns.employRegularMgmtNum ?? "-"} />
          <Row label="상용 취득일" value={site.socialIns.employRegularJoinDate ?? "-"} />
          <Row label="보험료" value={site.socialIns.employFee?.toLocaleString() ?? "-"} />
          <Row label="납부액" value={site.socialIns.employPaid?.toLocaleString() ?? "-"} />
          <Row label="보험율" value={site.socialIns.employRate ?? "-"} />

          {/* 산재보험 */}
          <Text style={styles.socialTitle}>산재보험</Text>
          <Row label="일용 관리번호" value={site.socialIns.accidentDailyMgmtNum ?? "-"} />
          <Row label="일용 취득일" value={site.socialIns.accidentDailyJoinDate ?? "-"} />
          <Row label="상용 관리번호" value={site.socialIns.accidentRegularMgmtNum ?? "-"} />
          <Row label="상용 취득일" value={site.socialIns.accidentRegularJoinDate ?? "-"} />
          <Row label="보험료" value={site.socialIns.accidentFee?.toLocaleString() ?? "-"} />
          <Row label="납부액" value={site.socialIns.accidentPaid?.toLocaleString() ?? "-"} />
          <Row label="보험율" value={site.socialIns.accidentRate ?? "-"} />

          {/* 퇴직공제 */}
          <Text style={styles.socialTitle}>퇴직공제</Text>
          <Row label="적용 여부" value={site.socialIns.severanceTarget ? "적용" : "미적용"} />
          <Row label="유형" value={site.socialIns.severanceType ?? "-"} />
          <Row label="공제 번호" value={site.socialIns.severanceDeductionNum ?? "-"} />
          <Row label="가입일" value={site.socialIns.severanceJoinDate ?? "-"} />
          <Row label="일당 공제액" value={site.socialIns.dailyDeductionAmount?.toLocaleString() ?? "-"} />
          <Row label="총 적립액" value={site.socialIns.totalSeverancePaidAmount?.toLocaleString() ?? "-"} />
          <Row label="지급율" value={site.socialIns.severancePaymentRate ?? "-"} />
        </>
      )}
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
                        {m.name?.[0] ?? "-"}
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
                          {m.name ?? "-"}
                        </Text>

                        {isMe && (
                          <View style={styles.meBadge}>
                            <Text style={styles.meBadgeText}>나</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.managerRole}>{m.role ?? "-"}</Text>
                      <Text style={styles.managerContact}>{m.phone ?? "-"}</Text>
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

/* ====== 스타일 ====== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  root: {
    flex: 1,
  },
accordionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 4,
},

arrow: {
  fontSize: 16,
  color: "#6B7280",
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
  socialTitle: {
  marginTop: 12,
  marginBottom: 6,
  fontSize: 13,
  fontWeight: "600",
  color: "#1F2937",
},
  /* 카드 공통 */
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

  /* 계정 관리 버튼 */
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
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
  },
  outlineRedBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },

  /* 섹션 헤더 */
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
    width: 100,
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },

  /* 동료 관리자 */
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
  },
  managerContact: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
/* ====== 재사용 가능한 Row 컴포넌트 ====== */
function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 6 }}>
      <Text style={{ width: 130, color: "#6B7280", fontSize: 12 }}>{label}</Text>
      <Text style={{ flex: 1, color: "#111827", fontSize: 13 }}>{value}</Text>
    </View>
  );
}