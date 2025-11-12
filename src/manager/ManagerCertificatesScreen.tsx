import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  useWindowDimensions, FlatList, ScrollView
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Alert } from 'react-native';
type Props = NativeStackScreenProps<RootStackParamList, 'ManagerCertificates'>;

type CertStatus = 'valid' | 'expiring' | 'expired';
type CertType   = 'safety' | 'technical' | 'license' | 'training';

interface Certificate {
  id: number;
  name: string;
  nameEn: string;
  issuingOrganization: string;
  issuingOrganizationEn: string;
  issueDate: string;      // YYYY-MM-DD
  expiryDate?: string;    // YYYY-MM-DD
  certificateNumber: string;
  status: CertStatus;
  type: CertType;
}

const MOCK: Certificate[] = [
  { id:1, name:'배관기능사', nameEn:'Craftsman Piping',
    issuingOrganization:'한국산업인력공단', issuingOrganizationEn:'Human Resources Development Service of Korea',
    issueDate:'2018-06-15', certificateNumber:'18-5-3456-7', status:'valid', type:'technical' },
  { id:2, name:'건설안전기사', nameEn:'Construction Safety Engineer',
    issuingOrganization:'한국산업인력공단', issuingOrganizationEn:'Human Resources Development Service of Korea',
    issueDate:'2020-11-20', certificateNumber:'20-7-8901-2', status:'valid', type:'safety' },
  { id:3, name:'고소작업차 운전', nameEn:'Aerial Work Platform Operation',
    issuingOrganization:'한국산업안전보건공단', issuingOrganizationEn:'KOSHA',
    issueDate:'2023-03-10', expiryDate:'2026-03-09', certificateNumber:'2023-KOSHA-1234', status:'valid', type:'license' },
  { id:4, name:'용접기능사', nameEn:'Craftsman Welding',
    issuingOrganization:'한국산업인력공단', issuingOrganizationEn:'HRDK',
    issueDate:'2019-08-22', certificateNumber:'19-6-4567-8', status:'valid', type:'technical' },
  { id:5, name:'안전보건교육 이수증', nameEn:'Safety and Health Training Certificate',
    issuingOrganization:'한국산업안전보건공단', issuingOrganizationEn:'KOSHA',
    issueDate:'2024-01-15', expiryDate:'2025-01-14', certificateNumber:'2024-EDU-5678', status:'expiring', type:'training' },
  { id:6, name:'지게차운전기능사', nameEn:'Forklift Operator',
    issuingOrganization:'한국산업인력공단', issuingOrganizationEn:'HRDK',
    issueDate:'2021-05-18', expiryDate:'2024-05-17', certificateNumber:'21-4-2345-6', status:'expired', type:'license' },
];

export default function ManagerCertificatesScreen({ route, navigation }: Props) {
  const { worker } = route.params;
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Certificate | null>(null);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK;
    return MOCK.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.issuingOrganization.toLowerCase().includes(q)
    );
  }, [query]);

  const validCnt    = MOCK.filter(c=>c.status==='valid').length;
  const expiringCnt = MOCK.filter(c=>c.status==='expiring').length;
  const expiredCnt  = MOCK.filter(c=>c.status==='expired').length;

  const format = (d?:string) => {
    if(!d) return '';
    const [y,m,dd] = d.split('-');
    return `${y}-${m}-${dd}`;
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
          <Text style={{color:'#374151'}}>〈</Text>
          <Text style={{color:'#374151', marginLeft:4}}>근로자 상세로 돌아가기</Text>
        </TouchableOpacity>

        <Text style={styles.title}>자격증 및 교육 이수증</Text>
        <Text style={styles.subtitle}>Certificates & Training Records</Text>

        <Text style={styles.workerInfo}>{worker.name} · {worker.role} · {worker.site}</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard,{backgroundColor:'#EFF6FF', borderColor:'#BFDBFE'}]}>
            <Text style={styles.summaryLabel}>총 자격증</Text>
            <Text style={[styles.summaryNumber,{color:'#1D4ED8'}]}>{MOCK.length}개</Text>
          </View>
          </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="자격증 이름, 발급기관 검색..."
          style={styles.search}
        />
      </View>

      {/* Content */}
      <View style={[styles.body, isWide && { flexDirection:'row' }]}>
        {/* List (FlatList: ScrollView 안에 넣지 않음) */}
        <View style={[styles.listWrap, isWide && { width:'50%'}]}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>자격증 목록</Text>
              <Text style={styles.cardNote}>{data.length}개 표시</Text>
            </View>

            <FlatList
              data={data}
              keyExtractor={(it)=>String(it.id)}
              ItemSeparatorComponent={()=> <View style={{height:1, backgroundColor:'#F3F4F6'}}/>}
              renderItem={({item})=>{
                const sel = selected?.id === item.id;
                return (
                  <TouchableOpacity
                    onPress={()=> setSelected(item)}
                    activeOpacity={0.85}
                    style={[styles.row, sel && { backgroundColor:'#EFF6FF' }]}
                  >
                    <View style={{flex:1}}>
                      <Text style={{color:'#111827'}}>{item.name}</Text>
                      <Text style={{color:'#6B7280', fontSize:12}}>{item.nameEn}</Text>
                    </View>
                    <View style={{flex:1}}>
                      <Text style={{color:'#374151'}}>{item.issuingOrganization}</Text>
                      <Text style={{color:'#9CA3AF', fontSize:12}}>{item.issuingOrganizationEn}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={()=> Alert.alert(`PDF 다운로드: ${item.name}\n증명서 번호: ${item.certificateNumber}`)}
                      style={styles.pdfBtn}
                    >
                      <Text style={{color:'#DC2626', fontWeight:'600'}}>PDF</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{paddingBottom:16}}
            />
          </View>
        </View>

        {/* Detail */}
        { (isWide ? selected : true) && (
          <View style={[styles.detailWrap, isWide && { width:'50%' }]}>
            <View style={styles.card}>
              {selected ? (
                <ScrollView contentContainerStyle={{padding:16}}>
                  <Text style={styles.detailTitle}>{selected.name}</Text>
                  <Text style={{color:'#6B7280', marginBottom:12}}>{selected.nameEn}</Text>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>발급기관</Text>
                    <Text style={styles.infoMain}>{selected.issuingOrganization}</Text>
                    <Text style={styles.infoSub}>{selected.issuingOrganizationEn}</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>증명서 번호</Text>
                    <Text style={styles.infoMain}>{selected.certificateNumber}</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>발급일</Text>
                    <Text style={styles.infoMain}>{format(selected.issueDate)}</Text>
                    {selected.expiryDate ? (
                      <>
                        <Text style={[styles.infoLabel,{marginTop:8}]}>만료일</Text>
                        <Text
                          style={[
                            styles.infoMain,
                            selected.status==='expired'
                              ? {color:'#DC2626'}
                              : selected.status==='expiring'
                              ? {color:'#CA8A04'}
                              : null
                          ]}
                        >
                          {format(selected.expiryDate)}
                        </Text>
                      </>
                    ) : (
                      <Text style={{color:'#059669', marginTop:6}}>영구 유효</Text>
                    )}
                  </View>

                  <View style={{flexDirection:'row', gap:8, marginTop:12}}>
                    <TouchableOpacity
                      style={[styles.primaryBtn,{flex:1}]}
                      onPress={()=> Alert.alert(`PDF 다운로드: ${selected.name}`)}
                    >
                      <Text style={styles.primaryBtnText}>PDF 다운로드</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.outlineBtn,{flex:1}]}>
                      <Text>미리보기</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              ) : (
                <View style={{padding:16}}>
                  <Text style={{color:'#9CA3AF'}}>왼쪽 목록에서 자격증을 선택하세요</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#F3F4F6' },

  header:{ backgroundColor:'#FFFFFF', borderBottomWidth:1, borderBottomColor:'#E5E7EB', padding:16 },
  backBtn:{ flexDirection:'row', alignItems:'center', marginBottom:8 },
  title:{ color:'#111827', fontSize:18, fontWeight:'700' },
  subtitle:{ color:'#6B7280', fontSize:12, marginTop:2 },
  workerInfo:{ color:'#374151', marginTop:8 },

  summaryRow:{ flexDirection:'row', gap:8, marginTop:12 },
  summaryCard:{ flex:1, borderWidth:1, borderRadius:10, padding:12 },
  summaryLabel:{ color:'#374151', fontSize:12 },
  summaryNumber:{ fontSize:20, fontWeight:'700', marginTop:2 },

  search:{
    marginTop:12, backgroundColor:'#F9FAFB', borderWidth:1, borderColor:'#E5E7EB',
    borderRadius:10, paddingHorizontal:12, height:40
  },

  body:{ flex:1, padding:16, gap:16 },
  listWrap:{ flex:1 },
  detailWrap:{ flex:1 },

  card:{ flex:1, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, overflow:'hidden' },
  cardHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:12, borderBottomWidth:1, borderBottomColor:'#F3F4F6' },
  cardTitle:{ color:'#111827', fontWeight:'600' },
  cardNote:{ color:'#6B7280', fontSize:12 },

  row:{ flexDirection:'row', alignItems:'center', paddingHorizontal:12, paddingVertical:14 },
  pdfBtn:{ paddingHorizontal:10, paddingVertical:6, borderWidth:1, borderColor:'#FECACA', backgroundColor:'#FEF2F2', borderRadius:8 },

  detailTitle:{ color:'#111827', fontSize:16, fontWeight:'700', marginBottom:4 },
  infoBox:{ backgroundColor:'#F9FAFB', borderWidth:1, borderColor:'#E5E7EB', borderRadius:10, padding:12, marginTop:10 },
  infoLabel:{ color:'#6B7280', fontSize:12, marginBottom:2 },
  infoMain:{ color:'#111827' },
  infoSub:{ color:'#9CA3AF', fontSize:12, marginTop:2 },

  primaryBtn:{ backgroundColor:'#2563EB', paddingVertical:12, borderRadius:10, alignItems:'center' },
  primaryBtnText:{ color:'#FFFFFF', fontWeight:'600' },
  outlineBtn:{ borderWidth:1, borderColor:'#D1D5DB', borderRadius:10, paddingVertical:12, alignItems:'center', backgroundColor:'#FFFFFF' },
});