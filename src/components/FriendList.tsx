import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import type { User } from 'firebase/auth';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  wpm: number;
  accuracy: number;
  lastSeen: string;
  isOnline: boolean;
  isFriend: boolean;
  isPending: boolean;
  isRequested: boolean;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  message: string;
  createdAt: string;
}

interface Props {
  user?: import('firebase/auth').User | null;
}

const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'SpeedTypist99',
    avatar: '🏃‍♂️',
    status: 'online',
    wpm: 85,
    accuracy: 98,
    lastSeen: new Date().toISOString(),
    isOnline: true,
    isFriend: true,
    isPending: false,
    isRequested: false,
  },
  {
    id: '2',
    name: 'CodeMaster',
    avatar: '💻',
    status: 'busy',
    wpm: 92,
    accuracy: 96,
    lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isOnline: true,
    isFriend: true,
    isPending: false,
    isRequested: false,
  },
  {
    id: '3',
    name: 'KeyboardNinja',
    avatar: '🥷',
    status: 'offline',
    wpm: 78,
    accuracy: 99,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isOnline: false,
    isFriend: true,
    isPending: false,
    isRequested: false,
  },
  {
    id: '4',
    name: 'TypeKing',
    avatar: '👑',
    status: 'away',
    wpm: 88,
    accuracy: 97,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isOnline: true,
    isFriend: true,
    isPending: false,
    isRequested: false,
  },
];

const mockFriendRequests: FriendRequest[] = [
  {
    id: 'req1',
    fromUserId: 'user5',
    fromUserName: 'FastFingers',
    fromUserAvatar: '🤘',
    message: 'Let\'s be friends and compete together!',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'req2',
    fromUserId: 'user6',
    fromUserName: 'PixelTyper',
    fromUserAvatar: '🎮',
    message: 'Hey! I saw your scores, want to be friends?',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

const mockSearchResults: Friend[] = [
  {
    id: 'search1',
    name: 'RapidFire',
    avatar: '🔥',
    status: 'online',
    wpm: 114,
    accuracy: 96.5,
    lastSeen: new Date().toISOString(),
    isOnline: true,
    isFriend: false,
    isPending: false,
    isRequested: false,
  },
  {
    id: 'search2',
    name: 'BlazeTypist',
    avatar: '💫',
    status: 'offline',
    wpm: 112,
    accuracy: 97.8,
    lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isOnline: false,
    isFriend: false,
    isPending: false,
    isRequested: false,
  },
];

export default function FriendList({ user }: Props) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch friends data
    const fetchFriendsData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from Firebase/API
      setFriends(mockFriends);
      setFriendRequests(mockFriendRequests);
      setLoading(false);
    };
    
    fetchFriendsData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Simulate search API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter mock results based on query
    const filtered = mockSearchResults.filter(friend =>
      friend.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
  };

  const handleSendFriendRequest = async (friendId: string) => {
    // In a real app, this would send a request to the backend
    setFriends(prev => prev.map(friend =>
      friend.id === friendId
        ? { ...friend, isRequested: true }
        : friend
    ));
    
    setSearchResults(prev => prev.map(friend =>
      friend.id === friendId
        ? { ...friend, isRequested: true }
        : friend
    ));
  };

  const handleAcceptFriendRequest = async (requestId: string) => {
    // In a real app, this would accept the request on the backend
    const request = friendRequests.find(req => req.id === requestId);
    if (!request) return;
    
    // Add to friends list
    const newFriend: Friend = {
      id: request.fromUserId,
      name: request.fromUserName,
      avatar: request.fromUserAvatar,
      status: 'offline',
      wpm: 0,
      accuracy: 0,
      lastSeen: new Date().toISOString(),
      isOnline: false,
      isFriend: true,
      isPending: false,
      isRequested: false,
    };
    
    setFriends(prev => [...prev, newFriend]);
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleRejectFriendRequest = async (requestId: string) => {
    // In a real app, this would reject the request on the backend
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return t('online');
      case 'busy': return t('busy');
      case 'away': return t('away');
      case 'offline': return t('offline');
      default: return t('offline');
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`;
    return `${diffDays} ${t('daysAgo')}`;
  };

  if (!user) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('loginRequired')}</h2>
          <p className="text-gray-600">{t('loginToAccessFriends')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('friends')}</h1>
        <p className="text-gray-600">{t('friendsDescription')}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('friends')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'friends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('myFriends')} ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('friendRequests')} ({friendRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('findFriends')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">{t('loadingFriends')}</p>
            </div>
          ) : (
            <>
              {/* Friends Tab */}
              {activeTab === 'friends' && (
                <div className="space-y-4">
                  {friends.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">👥</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noFriendsYet')}</h3>
                      <p className="text-gray-600 mb-4">{t('startAddingFriends')}</p>
                      <button
                        onClick={() => setActiveTab('search')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {t('findFriends')}
                      </button>
                    </div>
                  ) : (
                    friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="text-3xl">{friend.avatar}</div>
                            <div
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                                friend.status
                              )}`}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{friend.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{getStatusText(friend.status)}</span>
                              {friend.isOnline && <span>•</span>}
                              {!friend.isOnline && <span>• {formatLastSeen(friend.lastSeen)}</span>}
                              {friend.wpm > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{friend.wpm} {t('wpmUnit')}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Friend Requests Tab */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  {friendRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📬</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noFriendRequests')}</h3>
                      <p className="text-gray-600">{t('noPendingRequests')}</p>
                    </div>
                  ) : (
                    friendRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{request.fromUserAvatar}</div>
                          <div>
                            <h3 className="font-medium text-gray-900">{request.fromUserName}</h3>
                            <p className="text-sm text-gray-600">{request.message}</p>
                            <p className="text-xs text-gray-500">{formatLastSeen(request.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptFriendRequest(request.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            {t('accept')}
                          </button>
                          <button
                            onClick={() => handleRejectFriendRequest(request.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            {t('reject')}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Search Tab */}
              {activeTab === 'search' && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder={t('searchFriends')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                      className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {searchQuery.length < 2 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">{t('enterAtLeast2Chars')}</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">{t('noUsersFound')}</p>
                    </div>
                  ) : (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="text-3xl">{user.avatar}</div>
                            <div
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                                user.status
                              )}`}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{getStatusText(user.status)}</span>
                              <span>•</span>
                              <span>{user.wpm} {t('wpmUnit')}</span>
                              <span>•</span>
                              <span>{user.accuracy}% {t('accuracy')}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {user.isRequested ? (
                            <button
                              disabled
                              className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                            >
                              {t('requestSent')}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSendFriendRequest(user.id)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              {t('addFriend')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}