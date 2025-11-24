import type { User } from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface SocialStats {
  friendsCount: number;
  pendingRequestsCount: number;
  sentRequestsCount: number;
  competitionsWon: number;
  competitionsParticipated: number;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  maxParticipants: number;
  currentParticipants: number;
  status: 'waiting' | 'starting' | 'active' | 'finished';
  createdBy: string;
  createdAt: string;
  startsAt?: string;
  duration?: number;
  participants: string[];
  winner?: string;
  results?: CompetitionResult[];
}

export interface CompetitionResult {
  userId: string;
  userName: string;
  wpm: number;
  accuracy: number;
  time: number;
  rank: number;
  completedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  wpm: number;
  accuracy: number;
  totalTests: number;
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  bestAccuracy: number;
  streak: number;
  rank: number;
  country?: string;
  lastActive: string;
}

// Friend Management Functions
export async function sendFriendRequest(fromUserId: string, toUserId: string, message?: string): Promise<boolean> {
  try {
    if (!db) return false;
    
    const requestId = `request_${fromUserId}_${toUserId}_${Date.now()}`;
    const requestRef = doc(db, 'friendRequests', requestId);
    await setDoc(requestRef, {
      fromUserId,
      toUserId,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error sending friend request:', error);
    return false;
  }
}

export async function acceptFriendRequest(requestId: string): Promise<boolean> {
  try {
    if (!db) return false;
    
    const requestRef = doc(db, 'friendRequests', requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      return false;
    }

    const requestData = requestDoc.data() as FriendRequest;
    
    // Update request status
    await setDoc(requestRef, {
      ...requestData,
      status: 'accepted',
    });

    // Create friendship (both directions)
    const friend1Id = `friend_${requestData.fromUserId}_${requestData.toUserId}`;
    const friend1Ref = doc(db, 'friends', friend1Id);
    await setDoc(friend1Ref, {
      userId: requestData.fromUserId,
      friendId: requestData.toUserId,
      status: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const friend2Id = `friend_${requestData.toUserId}_${requestData.fromUserId}`;
    const friend2Ref = doc(db, 'friends', friend2Id);
    await setDoc(friend2Ref, {
      userId: requestData.toUserId,
      friendId: requestData.fromUserId,
      status: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return false;
  }
}

export async function rejectFriendRequest(requestId: string): Promise<boolean> {
  try {
    if (!db) return false;
    
    const requestRef = doc(db, 'friendRequests', requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      return false;
    }

    const requestData = requestDoc.data() as FriendRequest;
    
    await setDoc(requestRef, {
      ...requestData,
      status: 'rejected',
    });

    return true;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return false;
  }
}

export async function removeFriend(userId: string, friendId: string): Promise<boolean> {
  try {
    if (!db) return false;
    
    // In a real implementation, you would query and delete the friendship documents
    // For now, just return success as a placeholder
    return true;
  } catch (error) {
    console.error('Error removing friend:', error);
    return false;
  }
}

export async function getUserFriends(userId: string): Promise<Friend[]> {
  try {
    // Simplified implementation - in a real app, you'd query a collection
    // For now, return empty array as placeholder
    if (!db) return [];
    return [];
  } catch (error) {
    console.error('Error getting user friends:', error);
    return [];
  }
}

export async function getFriendRequests(userId: string): Promise<FriendRequest[]> {
  try {
    // Simplified implementation - in a real app, you'd query a collection
    // For now, return empty array as placeholder
    if (!db) return [];
    return [];
  } catch (error) {
    console.error('Error getting friend requests:', error);
    return [];
  }
}

export async function searchUsers(query: string, currentUserId: string): Promise<any[]> {
  try {
    // Simplified implementation - in a real app, you'd use a search service
    // For now, return empty array as placeholder
    if (!db) return [];
    return [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

// Competition Functions
export async function createCompetition(competitionData: Omit<Competition, 'id' | 'createdAt' | 'participants'>): Promise<string | null> {
  try {
    if (!db) return null;
    
    const competitionId = `competition_${Date.now()}`;
    const competitionRef = doc(db, 'competitions', competitionId);
    await setDoc(competitionRef, {
      ...competitionData,
      createdAt: new Date().toISOString(),
      participants: [],
    });

    return competitionId;
  } catch (error) {
    console.error('Error creating competition:', error);
    return null;
  }
}

export async function joinCompetition(competitionId: string, userId: string): Promise<boolean> {
  try {
    if (!db) return false;
    
    const competitionRef = doc(db, 'competitions', competitionId);
    const competitionDoc = await getDoc(competitionRef);
    
    if (!competitionDoc.exists()) {
      return false;
    }

    const competitionData = competitionDoc.data();
    const currentParticipants = competitionData?.participants || [];
    
    await setDoc(competitionRef, {
      ...competitionData,
      participants: [...currentParticipants, userId],
    });

    return true;
  } catch (error) {
    console.error('Error joining competition:', error);
    return false;
  }
}

export async function leaveCompetition(competitionId: string, userId: string): Promise<boolean> {
  try {
    if (!db) return false;
    
    const competitionRef = doc(db, 'competitions', competitionId);
    const competitionDoc = await getDoc(competitionRef);
    
    if (!competitionDoc.exists()) {
      return false;
    }

    const competitionData = competitionDoc.data();
    const currentParticipants = competitionData?.participants || [];
    
    await setDoc(competitionRef, {
      ...competitionData,
      participants: currentParticipants.filter((id: string) => id !== userId),
    });

    return true;
  } catch (error) {
    console.error('Error leaving competition:', error);
    return false;
  }
}

export async function getCompetitions(status?: Competition['status']): Promise<Competition[]> {
  try {
    // Simplified implementation - in a real app, you'd query a collection
    // For now, return empty array as placeholder
    if (!db) return [];
    return [];
  } catch (error) {
    console.error('Error getting competitions:', error);
    return [];
  }
}

export async function submitCompetitionResult(
  competitionId: string,
  result: Omit<CompetitionResult, 'completedAt'>
): Promise<boolean> {
  try {
    if (!db) return false;
    
    const competitionRef = doc(db, 'competitions', competitionId);
    const competitionDoc = await getDoc(competitionRef);
    
    if (!competitionDoc.exists()) {
      return false;
    }

    const competitionData = competitionDoc.data() as Competition;
    const existingResults = competitionData.results || [];
    
    // Check if user already submitted
    const existingResult = existingResults.find(r => r.userId === result.userId);
    if (existingResult) {
      return false; // Already submitted
    }

    const newResult: CompetitionResult = {
      ...result,
      completedAt: new Date().toISOString(),
    };

    await setDoc(competitionRef, {
      ...competitionData,
      results: [...existingResults, newResult],
    });

    return true;
  } catch (error) {
    console.error('Error submitting competition result:', error);
    return false;
  }
}

// Leaderboard Functions
export async function getLeaderboard(
  type: 'global' | 'country' | 'friends' = 'global',
  userId?: string,
  country?: string,
  timeFilter: 'today' | 'week' | 'month' | 'allTime' = 'allTime',
  limitCount: number = 100
): Promise<LeaderboardEntry[]> {
  try {
    // Simplified implementation - in a real app, you'd query a collection
    // For now, return empty array as placeholder
    if (!db) return [];
    return [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

export async function getUserSocialStats(userId: string): Promise<SocialStats> {
  try {
    // Simplified implementation - in a real app, you'd query collections
    // For now, return default stats as placeholder
    if (!db) {
      return {
        friendsCount: 0,
        pendingRequestsCount: 0,
        sentRequestsCount: 0,
        competitionsWon: 0,
        competitionsParticipated: 0,
      };
    }
    
    return {
      friendsCount: 0,
      pendingRequestsCount: 0,
      sentRequestsCount: 0,
      competitionsWon: 0,
      competitionsParticipated: 0,
    };
  } catch (error) {
    console.error('Error getting user social stats:', error);
    return {
      friendsCount: 0,
      pendingRequestsCount: 0,
      sentRequestsCount: 0,
      competitionsWon: 0,
      competitionsParticipated: 0,
    };
  }
}

// Notification Functions
export async function sendNotification(
  userId: string,
  type: 'friend_request' | 'competition_invite' | 'competition_result' | 'friend_accepted',
  data: any
): Promise<boolean> {
  try {
    if (!db) return false;
    
    const notificationId = `notification_${userId}_${Date.now()}`;
    const notificationRef = doc(db, 'notifications', notificationId);
    await setDoc(notificationRef, {
      userId,
      type,
      data,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

export async function getNotifications(userId: string): Promise<any[]> {
  try {
    // Simplified implementation - in a real app, you'd query a collection
    // For now, return empty array as placeholder
    if (!db) return [];
    return [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    if (!db) return false;
    
    const notificationRef = doc(db, 'notifications', notificationId);
    const notificationDoc = await getDoc(notificationRef);
    
    if (!notificationDoc.exists()) {
      return false;
    }

    const notificationData = notificationDoc.data();
    
    await setDoc(notificationRef, {
      ...notificationData,
      read: true,
    });

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}