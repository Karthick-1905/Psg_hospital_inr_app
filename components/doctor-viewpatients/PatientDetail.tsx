
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Switch,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Patient } from '@/constants/data/mockPatients';
import { LineChart } from 'react-native-chart-kit';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState('inr');
  const [editMode, setEditMode] = useState(false);
  type Day =
  | 'MON'
  | 'TUE'
  | 'WED'
  | 'THU'
  | 'FRI'
  | 'SAT'
  | 'SUN';
  const [dosage, setDosage] = useState({
    MON: "4",
    TUE: "4",
    WED: "4",
    THU: "4",
    FRI: "4",
    SAT: "4",
    SUN: "4",
  });

  // Mock INR data for the chart
  const inrData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR'],
    datasets: [
      {
        data: [0, 0, 0, 0],
      }
    ]
  };

  const toggleDay = (day: string, enabled: boolean) => {
    // In a real app, this would update the dosage schedule
    console.log(`${day} is now ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleEditDosage = () => {
    if (editMode) {
      // In a real app, this would save the dosage changes
      console.log("Saving dosage:", dosage);
    }
    setEditMode(!editMode);
  };

  const handleDosageChange = (day: Day, value: string) => {
    setDosage(prev => ({
      ...prev,
      [day]: value
    }));
  };

  const renderTabContent = () => {
    if (activeTab === 'inr') {
      return (
        <ScrollView style={styles.tabContentContainer}>
          <ScrollView style={styles.tabScrollContent} contentContainerStyle={styles.scrollContentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INR Values</Text>
              <LineChart
                data={inrData}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(136, 132, 216, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#8884d8',
                  },
                }}
                bezier
                style={styles.chart}
              />
              
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View INR Reports</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MISSED DOSES:</Text>
              <ScrollView style={styles.missedDosesContainer} nestedScrollEnabled={true}>
                {patient.missedDoses.map((date, index) => (
                  <View key={index} style={styles.missedDoseItem}>
                    <Text>{date}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prescription</Text>
              {!editMode ? (
                <View style={styles.prescriptionTable}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, styles.dayCell]}>Day</Text>
                    <Text style={[styles.tableHeaderCell, styles.doseCell]}>Dosage</Text>
                  </View>
                  <ScrollView nestedScrollEnabled={true}>
                    {Object.entries(patient.prescription).map(([day, dose]) => (
                      <View key={day} style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.dayCell]}>{day}</Text>
                        <Text style={[styles.tableCell, styles.doseCell]}>{dose}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <ScrollView style={styles.editDosageContainer} nestedScrollEnabled={true}>
                  {(Object.keys(dosage) as Day[]).map(day => (
                    <View key={day} style={styles.dosageRow}>
                      <Switch 
                        value={true} 
                        onValueChange={(checked) => toggleDay(day, checked)}
                      />
                      <Text style={styles.dayText}>{day}</Text>
                      <TextInput 
                        style={styles.dosageInput}
                        value={dosage[day]} 
                        onChangeText={(text) => handleDosageChange(day, text)} 
                        keyboardType="numeric"
                      />
                      <Text>mg</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
              
              <TouchableOpacity 
                style={styles.button}
                onPress={handleEditDosage}
              >
                <Text style={styles.buttonText}>
                  {editMode ? "Save Dosage" : "Edit Dosage"}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Add extra padding at the bottom to ensure scrollability */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.tabContentContainer}>
          <ScrollView style={styles.tabScrollContent} contentContainerStyle={styles.scrollContentContainer}>
            <View style={styles.noteSection}>
              <Text style={styles.noteLabel}>SIDE EFFECTS:</Text>
              <Text style={styles.noteText}>{patient.sideEffects || "None"}</Text>
              
              <Text style={styles.noteLabel}>LIFESTYLE CHANGES:</Text>
              <Text style={styles.noteText}>{patient.lifestyleChanges || "None"}</Text>
              
              <Text style={styles.noteLabel}>OTHER MEDICATION:</Text>
              <Text style={styles.noteText}>{patient.otherMedication || "None"}</Text>
              
              <Text style={styles.noteLabel}>PROLONGED ILLNESS:</Text>
              <Text style={styles.noteText}>{patient.prolongedIllness || "None"}</Text>
            </View>
            
            <View style={styles.contactsSection}>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Contact:</Text>
                <Text style={styles.contactValue}>{patient.contact}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Kin Name:</Text>
                <Text style={styles.contactValue}>{patient.kinName}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Kin Contact:</Text>
                <Text style={styles.contactValue}>{patient.kinContact}</Text>
              </View>
            </View>
            
            {/* Add extra padding at the bottom to ensure scrollability */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.patientHeader}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientInfo}>(Age: {patient.age}, Gender: {patient.gender})</Text>
          </View>
        </View>

        <View style={styles.targetINRContainer}>
          <View>
            <Text style={styles.targetINRLabel}>Target INR:</Text>
            <Text style={styles.targetINRValue}>
              {patient.targetINR.min} - {patient.targetINR.max}
            </Text>
          </View>
          
          <View>
            <Text style={styles.latestINRLabel}>Latest INR: {patient.latestINR}</Text>
            <Text style={styles.latestINRDate}>
              AS OF {new Date(patient.latestINRDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content Section */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoGrid}>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Doctor</Text>
              <Text style={styles.infoValue}>{patient.doctorName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Caregiver</Text>
              <Text style={styles.infoValue}>{patient.caretakerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Therapy</Text>
              <Text style={styles.infoValue}>{patient.therapy}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Therapy Start Date</Text>
              <Text style={styles.infoValue}>{patient.therapyStartDate}</Text>
            </View>
          </View>
          
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medical History</Text>
              <Text style={styles.infoValue}>{patient.medicalHistory}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}></Text>
              <Text style={styles.infoValue}>{patient.medicalHistoryYears} years</Text>
            </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'inr' && styles.activeTab]}
            onPress={() => setActiveTab('inr')}
          >
            <Text style={[styles.tabText, activeTab === 'inr' && styles.activeTabText]}>
              INR & Dosage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
              Notes & Contacts
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  fixedHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    color: '#2196F3',
  },
  patientHeader: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  patientInfo: {
    fontSize: 14,
    color: 'gray',
  },
  targetINRContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  targetINRLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  targetINRValue: {
    fontSize: 20,
  },
  latestINRLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  latestINRDate: {
    fontSize: 12,
    color: 'gray',
  },
scrollContainer: {
  flex: 1,
},
scrollContent: {
  padding: 16,
},
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 16,
  },
  infoTable: {
    flex: 1,
    minWidth: 250,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoLabel: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f5f5f5',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    color: 'gray',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
  },
  tabContentContainer: {
    flex: 1,
  },
  tabScrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  missedDosesContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    padding: 8,
  },
  missedDoseItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  prescriptionTable: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    maxHeight: 200,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeaderCell: {
    padding: 8,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    padding: 8,
  },
  dayCell: {
    flex: 1,
  },
  doseCell: {
    flex: 1,
  },
  editDosageContainer: {
    marginVertical: 8,
    maxHeight: 200,
  },
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dayText: {
    width: 50,
    marginHorizontal: 8,
  },
  dosageInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: 60,
    marginRight: 8,
    textAlign: 'center',
  },
  noteSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  noteLabel: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  noteText: {
    marginBottom: 8,
  },
  contactsSection: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  contactRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactLabel: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f5f5f5',
    fontWeight: '500',
  },
  contactValue: {
    flex: 1,
    padding: 8,
  },
  bottomPadding: {
    height: 10, // Increased bottom padding for better scrolling
  },
});

export default PatientDetail;
