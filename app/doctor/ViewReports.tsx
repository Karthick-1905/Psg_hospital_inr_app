import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '../../app/config/env';
import * as SecureStore from 'expo-secure-store';
import { useDoctor } from '@/hooks/api/doctor/useDoctor';
// Types based on API response
interface INRReport {
  inr_value: number;
  location_of_test: string;
  date: string;
  file_name?: string;
  file_path?: string;
  type?: string;
}

interface ReportData {
  patient_name: string;
  inr_report: INRReport;
}

export default function ViewReports() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [filterType, setFilterType] = useState('today');
  
  const { getReports, isLoading: loading, error } = useDoctor();

  useEffect(() => {
    fetchReports();
  }, [filterType]);

  const fetchReports = async () => {
    try {
      setRefreshing(true);
      const response = await getReports(filterType);
      
      if (response && response.reports && response.reports.length > 0) {
        setReports(response.reports);
      } else {
        // Add dummy reports when no data is available
        setReports([
          {
        patient_name: "John Smith",
        inr_report: {
          inr_value: 2.5,
          location_of_test: "Home",
          date: new Date().toISOString(),
          file_name: "inr_report_john.pdf",
          type: "INR Test"
        }
          },
          {
        patient_name: "Sarah Johnson",
        inr_report: {
          inr_value: 4.2,
          location_of_test: "Clinic",
          date: new Date().toISOString(),
          type: "INR Test"
        }
          },
          {
        patient_name: "Michael Brown",
        inr_report: {
          inr_value: 1.8,
          location_of_test: "Hospital",
          date: new Date(Date.now() - 86400000).toISOString(),
          file_name: "inr_report_michael.pdf",
          type: "INR Test"
        }
          },
          {
        patient_name: "Emily Davis",
        inr_report: {
          inr_value: 3.6,
          location_of_test: "Lab",
          date: new Date().toISOString(),
          type: "INR Test"
        }
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      
      // Handle authentication errors if needed
      if (err instanceof Error && err.message.includes('session expired')) {
        setTimeout(() => {
          router.replace('/(auth)/signIn');
        }, 2000);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const getStatusColor = (value: number) => {
    if (value < 2.0) return '#2196F3'; // Low - Blue
    if (value >= 2.0 && value <= 3.0) return '#4CAF50'; // Normal - Green
    if (value > 3.0 && value < 4.0) return '#FF9800'; // High - Orange
    return '#E41E4F'; // Critical - Red (using the app's primary color for critical)
  };

  const getStatus = (value: number) => {
    if (value < 2.0) return 'Low';
    if (value >= 2.0 && value <= 3.0) return 'Normal';
    if (value > 3.0 && value < 4.0) return 'High';
    return 'Critical';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderReportItem = ({ item }: { item: ReportData }) => {
    const status = getStatus(item.inr_report.inr_value);
    const statusColor = getStatusColor(item.inr_report.inr_value);
    
    return (
      <TouchableOpacity 
        style={styles.reportCard}
        onPress={() => console.log(`View details for report ${item.patient_name}`)}
      >
        <View style={styles.reportHeader}>
          <View>
            <Text style={styles.patientName}>{item.patient_name}</Text>
            <Text style={styles.patientId}>Location: {item.inr_report.location_of_test}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
        
        <View style={styles.reportContent}>
          <View style={styles.reportDetail}>
            <Text style={styles.detailLabel}>Test Type:</Text>
            <Text style={styles.detailValue}>{item.inr_report.type || 'INR Test'}</Text>
          </View>
          
          <View style={styles.reportDetail}>
            <Text style={styles.detailLabel}>INR Value:</Text>
            <Text style={styles.detailValue}>{item.inr_report.inr_value.toFixed(1)}</Text>
          </View>
          
          <View style={styles.reportDetail}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(item.inr_report.date)}</Text>
          </View>
          
          {item.inr_report.file_name && (
            <View style={styles.reportDetail}>
              <Text style={styles.detailLabel}>Document:</Text>
              <Text style={styles.detailValue}>{item.inr_report.file_name}</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Full Report</Text>
          <Ionicons name="chevron-forward-outline" size={16} color="#E41E4F" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={48} color="#999" />
      <Text style={styles.emptyText}>No reports found</Text>
      <Text style={styles.emptySubtext}>
        {filterType === 'today' 
          ? 'No reports submitted today' 
          : 'No reports available'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <CustomHeader 
        title="Patient Reports" 
        leftButton={
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        }
      /> */}
      
      <View style={styles.filterSection}>
        <TouchableOpacity 
          style={[styles.filterTab, filterType === 'today' && styles.activeTab]}
          onPress={() => setFilterType('today')}
        >
          <Text style={[styles.filterTabText, filterType === 'today' && styles.activeTabText]}>
            Today's Reports
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, filterType === 'all' && styles.activeTab]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterTabText, filterType === 'all' && styles.activeTabText]}>
            All Reports
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E41E4F" />
          <Text style={styles.loaderText}>Loading reports...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#E41E4F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchReports}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item, index) => `${item.patient_name}-${index}`}
          renderItem={renderReportItem}
          contentContainerStyle={[
            styles.listContainer,
            reports.length === 0 && styles.emptyListContainer
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E41E4F"]}
            />
          }
          ListEmptyComponent={renderEmptyList}
        />
      )}           
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // Add padding for notch on iOS
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
  },
  backButton: {
    padding: 8,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E41E4F',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#E41E4F',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  patientId: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  reportContent: {
    marginBottom: 12,
  },
  reportDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Platform.OS === 'ios' ? 12 : 16, // Different border radius per platform
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    // Add touch feedback appropriate for each platform
    ...Platform.select({
      android: {
        paddingVertical: 2, // Android needs more touch area
      },
      ios: {
        paddingVertical: 4,
      },
    }),
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#E41E4F',
    marginRight: 4,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E41E4F',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
});