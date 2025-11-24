import type { User } from 'firebase/auth';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface ExportData {
  version: string;
  exportDate: string;
  userId?: string;
  userProfile?: {
    displayName: string;
    email: string;
    createdAt: string;
  };
  progress: {
    lessons: Record<string, any>;
    stats: {
      totalTests: number;
      averageWpm: number;
      averageAccuracy: number;
      bestWpm: number;
      bestAccuracy: number;
      practiceStreak: number;
      totalPracticeTime: number;
    };
  };
  settings?: {
    theme: string;
    language: string;
    timerDuration: number;
    showKeyboard: boolean;
    showHands: boolean;
    enableSound: boolean;
    wpmGoal: number;
    accuracyGoal: number;
    minExamWpm: number;
  };
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
    category: string;
  }>;
  testHistory?: Array<{
    id: string;
    date: string;
    wpm: number;
    accuracy: number;
    time: number;
    errors: number;
    type: string;
  }>;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedItems?: {
    progress: number;
    settings: number;
    achievements: number;
    testHistory: number;
  };
  conflicts?: Array<{
    type: 'progress' | 'settings' | 'achievements' | 'testHistory';
    description: string;
    action: 'overwrite' | 'merge' | 'skip';
  }>;
}

export async function exportUserData(user: User | null): Promise<ExportData | null> {
  try {
    if (!user) {
      return null;
    }

    // Get user data from Firestore
    if (!db) return null;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();

    const exportData: ExportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      userId: user.uid,
      userProfile: {
        displayName: user.displayName || 'Anonymous',
        email: user.email || '',
        createdAt: new Date().toISOString(),
      },
      progress: {
        lessons: userData?.lessons || {},
        stats: userData?.stats || {
          totalTests: 0,
          averageWpm: 0,
          averageAccuracy: 0,
          bestWpm: 0,
          bestAccuracy: 0,
          practiceStreak: 0,
          totalPracticeTime: 0,
        },
      },
      settings: userData?.settings || {},
      achievements: userData?.achievements || [],
      testHistory: userData?.tests || [],
    };

    return exportData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    return null;
  }
}

export async function importUserData(
  user: User | null,
  importData: ExportData,
  options: {
    overwriteProgress?: boolean;
    overwriteSettings?: boolean;
    mergeAchievements?: boolean;
    importTestHistory?: boolean;
  } = {}
): Promise<ImportResult> {
  try {
    if (!user) {
      return {
        success: false,
        message: 'User must be logged in to import data',
      };
    }

    // Validate import data
    if (!importData.version || !importData.exportDate) {
      return {
        success: false,
        message: 'Invalid import data format',
      };
    }

    // Get current user data to check for conflicts
    if (!db) {
      return {
        success: false,
        message: 'Database not available',
      };
    }
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const currentData = userDoc.exists() ? userDoc.data() : {};

    const conflicts: ImportResult['conflicts'] = [];
    const importedItems = {
      progress: 0,
      settings: 0,
      achievements: 0,
      testHistory: 0,
    };

    // Check for progress conflicts
    if (importData.progress && Object.keys(importData.progress.lessons).length > 0) {
      const currentLessons = currentData?.lessons || {};
      const importLessons = importData.progress.lessons;
      
      if (Object.keys(currentLessons).length > 0 && !options.overwriteProgress) {
        conflicts.push({
          type: 'progress',
          description: 'Existing lesson progress found',
          action: 'merge',
        });
      }
      
      importedItems.progress = Object.keys(importLessons).length;
    }

    // Check for settings conflicts
    if (importData.settings) {
      const currentSettings = currentData?.settings || {};
      
      if (Object.keys(currentSettings).length > 0 && !options.overwriteSettings) {
        conflicts.push({
          type: 'settings',
          description: 'Existing settings found',
          action: 'merge',
        });
      }
      
      importedItems.settings = 1;
    }

    // Check for achievements conflicts
    if (importData.achievements && importData.achievements.length > 0) {
      const currentAchievements = currentData?.achievements || [];
      
      if (currentAchievements.length > 0 && !options.mergeAchievements) {
        conflicts.push({
          type: 'achievements',
          description: 'Existing achievements found',
          action: 'merge',
        });
      }
      
      importedItems.achievements = importData.achievements.length;
    }

    // Check for test history conflicts
    if (importData.testHistory && importData.testHistory.length > 0) {
      const currentTests = currentData?.tests || [];
      
      if (currentTests.length > 0 && !options.importTestHistory) {
        conflicts.push({
          type: 'testHistory',
          description: 'Existing test history found',
          action: 'merge',
        });
      }
      
      importedItems.testHistory = importData.testHistory.length;
    }

    return {
      success: true,
      message: 'Import validation successful',
      importedItems,
      conflicts,
    };
  } catch (error) {
    console.error('Error validating import data:', error);
    return {
      success: false,
      message: 'Error validating import data',
    };
  }
}

export function downloadExportData(data: ExportData, filename?: string): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `keyboard-master-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading export data:', error);
  }
}

export function generateProgressReport(data: ExportData): string {
  const report = [];
  
  report.push('# Keyboard Master Progress Report');
  report.push(`Generated: ${new Date(data.exportDate).toLocaleString()}`);
  report.push('');

  // User Profile Section
  if (data.userProfile) {
    report.push('## User Profile');
    report.push(`Name: ${data.userProfile.displayName}`);
    report.push(`Email: ${data.userProfile.email}`);
    report.push(`Member Since: ${new Date(data.userProfile.createdAt).toLocaleDateString()}`);
    report.push('');
  }

  // Statistics Section
  if (data.progress?.stats) {
    const stats = data.progress.stats;
    report.push('## Statistics');
    report.push(`Total Tests: ${stats.totalTests}`);
    report.push(`Average WPM: ${stats.averageWpm}`);
    report.push(`Average Accuracy: ${stats.averageAccuracy}%`);
    report.push(`Best WPM: ${stats.bestWpm}`);
    report.push(`Best Accuracy: ${stats.bestAccuracy}%`);
    report.push(`Practice Streak: ${stats.practiceStreak} days`);
    report.push(`Total Practice Time: ${Math.round(stats.totalPracticeTime / 60)} minutes`);
    report.push('');
  }

  // Progress Section
  if (data.progress?.lessons) {
    const lessons = Object.entries(data.progress.lessons);
    const completedLessons = lessons.filter(([_, lesson]) => lesson.completed).length;
    const totalLessons = lessons.length;
    
    report.push('## Lesson Progress');
    report.push(`Completed: ${completedLessons}/${totalLessons} lessons`);
    report.push(`Progress: ${Math.round((completedLessons / totalLessons) * 100)}%`);
    report.push('');
  }

  // Achievements Section
  if (data.achievements && data.achievements.length > 0) {
    report.push('## Achievements');
    data.achievements.forEach(achievement => {
      report.push(`### ${achievement.name}`);
      report.push(`${achievement.description}`);
      report.push(`Earned: ${new Date(achievement.earnedAt).toLocaleDateString()}`);
      report.push('');
    });
  }

  // Recent Tests Section
  if (data.testHistory && data.testHistory.length > 0) {
    report.push('## Recent Test Results');
    data.testHistory.slice(0, 10).forEach((test, index) => {
      report.push(`${index + 1}. ${test.type} - ${test.wpm} WPM, ${test.accuracy}% accuracy`);
      report.push(`   Date: ${new Date(test.date).toLocaleDateString()}`);
    });
  }

  return report.join('\n');
}

export function generateCertificate(data: ExportData): string {
  if (!data.progress?.stats) {
    return 'No progress data available for certificate generation';
  }

  const stats = data.progress.stats;
  const userName = data.userProfile?.displayName || 'Keyboard Master';
  const currentDate = new Date().toLocaleDateString();

  const certificate = `
╔══════════════════════════════════════════════════════════════╗
║                        CERTIFICATE OF ACHIEVEMENT                        ║
║                                                                      ║
║  This is to certify that                                              ║
║                                                                      ║
║  ${userName.padEnd(65)} ║
║                                                                      ║
║  has successfully demonstrated exceptional typing skills with:               ║
║                                                                      ║
║  • Best Speed: ${stats.bestWpm} Words Per Minute                         ║
║  • Best Accuracy: ${stats.bestAccuracy}%                                   ║
║  • Total Tests Completed: ${stats.totalTests.toString().padEnd(35)}           ║
║  • Average Speed: ${stats.averageWpm} WPM                                 ║
║  • Average Accuracy: ${stats.averageAccuracy}%                                ║
║                                                                      ║
║  Awarded on: ${currentDate.padEnd(47)}                        ║
║                                                                      ║
║                           Keyboard Master                                ║
╚════════════════════════════════════════════════════════════════╝
  `.trim();

  return certificate;
}

export function validateImportFile(file: File): Promise<{ valid: boolean; data?: ExportData; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Basic validation
        if (!data.version || !data.exportDate) {
          resolve({
            valid: false,
            error: 'Invalid file format. Missing required fields.',
          });
          return;
        }
        
        // Check if it's a Keyboard Master export file
        if (!data.progress && !data.userProfile) {
          resolve({
            valid: false,
            error: 'This file is not a valid Keyboard Master export.',
          });
          return;
        }
        
        resolve({
          valid: true,
          data,
        });
      } catch (error) {
        resolve({
          valid: false,
          error: 'Failed to parse JSON file.',
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        valid: false,
        error: 'Failed to read file.',
      });
    };
    
    reader.readAsText(file);
  });
}

export function createBackupSummary(data: ExportData): {
  totalSize: string;
  itemCounts: {
    lessons: number;
    achievements: number;
    tests: number;
  };
  lastBackup: string;
} {
  const jsonString = JSON.stringify(data);
  const totalSize = `${(jsonString.length / 1024).toFixed(2)} KB`;
  
  const itemCounts = {
    lessons: Object.keys(data.progress?.lessons || {}).length,
    achievements: data.achievements?.length || 0,
    tests: data.testHistory?.length || 0,
  };
  
  const lastBackup = new Date(data.exportDate).toLocaleString();

  return {
    totalSize,
    itemCounts,
    lastBackup,
  };
}