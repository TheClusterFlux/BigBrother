export interface VoiceActivity {
  totalTime: string;
  lastConnectedAt: string;
}

export interface ChannelData {
  channelId: string;
  channelName: string;
  durationInChannel: string;
  lastConnectionTime: string;
  voiceActivity: VoiceActivity;
}

export interface FavoriteChannel {
  channelId: string;
  channelName: string;
  timeSpent: string;
}

export interface UserInteraction {
  userId: string;
  username: string;
  interactionTime: number;
  lastSeenTogether: string;
  favoriteChannel: FavoriteChannel;
  lowestChannelTime: FavoriteChannel;
  ranking: string;
  voiceChatTime: string;
  lastVoiceChat: string;
  sharedChannels: string[];
  sharedChannelNames: string[];
  firstInteraction: string;
  interactionFrequency: string;
}

export interface ServerMember {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  banner?: string;
  bannerColor?: string;
  status: string;
  roles: string[];
  joinedAt: string;
  isBot: boolean;
  lastOnlineDuration: string;
  channelData: ChannelData[];
  userData: UserInteraction[];
}

export interface PopularChannel {
  channelId: string;
  channelName: string;
  totalMessages: number;
}

export interface DiscordServer {
  id: string;
  name: string;
  icon: string;
  banner?: string;
  ownerID: string;
  createdAt: string;
  memberCount: number;
  mostPopularChannel: PopularChannel;
  members: ServerMember[];
}

// Mock server data with 1 server, 5 channels, and 5 users with interconnected user data
export const mockServerData: DiscordServer = {
  "id": "956873465219874816",
  "name": "The Gaming Room",
  "icon": "https://cdn.discordapp.com/icons/956873465219874816/server-icon.png",
  "banner": "https://cdn.discordapp.com/banners/956873465219874816/server-banner.png",
  "ownerID": "348571273246531585",
  "createdAt": "2023-01-01T12:00:00Z",
  "memberCount": 150,
  "mostPopularChannel": {
    "channelId": "101",
    "channelName": "general",
    "totalMessages": 5000
  },
  "members": [
    {
      "id": "348571273246531585",
      "username": "GameMaster",
      "discriminator": "1234",
      "avatar": "assets/fakeProfileImages/Profile1.jpg",
      "banner": "https://cdn.discordapp.com/banners/348571273246531585/banner.png",
      "bannerColor": "#7289DA",
      "status": "online",
      "roles": ["Admin", "Creator"],
      "joinedAt": "2023-01-01T12:00:00Z",
      "isBot": false,
      "lastOnlineDuration": "4h 20m",
      "channelData": [
        {
          "channelId": "101",
          "channelName": "general",
          "durationInChannel": "2h 15m",
          "lastConnectionTime": "2025-05-06T18:00:00Z",
          "voiceActivity": {
            "totalTime": "450h",
            "lastConnectedAt": "2025-05-06T20:15:00Z"
          }
        },
        {
          "channelId": "102",
          "channelName": "strategy",
          "durationInChannel": "1h 45m",
          "lastConnectionTime": "2025-05-05T14:30:00Z",
          "voiceActivity": {
            "totalTime": "320h",
            "lastConnectedAt": "2025-05-05T16:15:00Z"
          }
        },
        {
          "channelId": "103",
          "channelName": "memes",
          "durationInChannel": "45m",
          "lastConnectionTime": "2025-05-04T19:20:00Z",
          "voiceActivity": {
            "totalTime": "120h",
            "lastConnectedAt": "2025-05-04T20:05:00Z"
          }
        }
      ],
      "userData": [
        {
          "userId": "456238756917325824",
          "username": "StrategyQueen",
          "interactionTime": 850000,
          "lastSeenTogether": "2025-05-06T19:30:00Z",
          "favoriteChannel": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "3h 45m"
          },
          "lowestChannelTime": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "20m"
          },
          "ranking": "1st",
          "voiceChatTime": "2h 30m",
          "lastVoiceChat": "2025-05-06T18:45:00Z",
          "sharedChannels": ["101", "102", "104"],
          "sharedChannelNames": ["general", "strategy", "events"],
          "firstInteraction": "2023-01-10T14:20:00Z",
          "interactionFrequency": "Daily"
        },
        {
          "userId": "567834921562347519",
          "username": "FPSKing",
          "interactionTime": 640000,
          "lastSeenTogether": "2025-05-05T21:15:00Z",
          "favoriteChannel": {
            "channelId": "104",
            "channelName": "events",
            "timeSpent": "4h 10m"
          },
          "lowestChannelTime": {
            "channelId": "103",
            "channelName": "memes",
            "timeSpent": "35m"
          },
          "ranking": "2nd",
          "voiceChatTime": "5h 45m",
          "lastVoiceChat": "2025-05-05T22:00:00Z",
          "sharedChannels": ["101", "104", "105"],
          "sharedChannelNames": ["general", "events", "music"],
          "firstInteraction": "2023-02-15T16:45:00Z",
          "interactionFrequency": "Weekly"
        },
        {
          "userId": "673456298145632789",
          "username": "LoreKeeper",
          "interactionTime": 520000,
          "lastSeenTogether": "2025-05-04T17:30:00Z",
          "favoriteChannel": {
            "channelId": "101",
            "channelName": "general",
            "timeSpent": "6h 20m"
          },
          "lowestChannelTime": {
            "channelId": "104",
            "channelName": "events",
            "timeSpent": "55m"
          },
          "ranking": "3rd",
          "voiceChatTime": "3h 15m",
          "lastVoiceChat": "2025-05-04T19:45:00Z",
          "sharedChannels": ["101", "102", "103"],
          "sharedChannelNames": ["general", "strategy", "memes"],
          "firstInteraction": "2023-03-22T10:30:00Z",
          "interactionFrequency": "Daily"
        },
        {
          "userId": "784523916734521896",
          "username": "MusicMaster",
          "interactionTime": 380000,
          "lastSeenTogether": "2025-05-03T13:20:00Z",
          "favoriteChannel": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "8h 30m"
          },
          "lowestChannelTime": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "15m"
          },
          "ranking": "4th",
          "voiceChatTime": "4h 50m",
          "lastVoiceChat": "2025-05-03T15:10:00Z",
          "sharedChannels": ["101", "103", "105"],
          "sharedChannelNames": ["general", "memes", "music"],
          "firstInteraction": "2023-04-05T18:15:00Z",
          "interactionFrequency": "Weekly"
        }
      ]
    },
    {
      "id": "456238756917325824",
      "username": "StrategyQueen",
      "discriminator": "5678",
      "avatar": "assets/fakeProfileImages/Profile2.jpg",
      "bannerColor": "#43B581",
      "status": "online",
      "roles": ["Moderator", "Strategy Expert"],
      "joinedAt": "2023-01-10T14:20:00Z",
      "isBot": false,
      "lastOnlineDuration": "3h 45m",
      "channelData": [
        {
          "channelId": "101",
          "channelName": "general",
          "durationInChannel": "1h 10m",
          "lastConnectionTime": "2025-05-06T17:30:00Z",
          "voiceActivity": {
            "totalTime": "380h",
            "lastConnectedAt": "2025-05-06T18:40:00Z"
          }
        },
        {
          "channelId": "102",
          "channelName": "strategy",
          "durationInChannel": "3h 30m",
          "lastConnectionTime": "2025-05-06T14:00:00Z",
          "voiceActivity": {
            "totalTime": "620h",
            "lastConnectedAt": "2025-05-06T17:30:00Z"
          }
        },
        {
          "channelId": "104",
          "channelName": "events",
          "durationInChannel": "1h 20m",
          "lastConnectionTime": "2025-05-05T15:10:00Z",
          "voiceActivity": {
            "totalTime": "210h",
            "lastConnectedAt": "2025-05-05T16:30:00Z"
          }
        }
      ],
      "userData": [
        {
          "userId": "348571273246531585",
          "username": "GameMaster",
          "interactionTime": 850000,
          "lastSeenTogether": "2025-05-06T19:30:00Z",
          "favoriteChannel": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "3h 45m"
          },
          "lowestChannelTime": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "15m"
          },
          "ranking": "1st",
          "voiceChatTime": "2h 30m",
          "lastVoiceChat": "2025-05-06T18:45:00Z",
          "sharedChannels": ["101", "102", "104"],
          "sharedChannelNames": ["general", "strategy", "events"],
          "firstInteraction": "2023-01-10T14:20:00Z",
          "interactionFrequency": "Daily"
        },
        {
          "userId": "673456298145632789",
          "username": "LoreKeeper",
          "interactionTime": 720000,
          "lastSeenTogether": "2025-05-06T16:45:00Z",
          "favoriteChannel": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "4h 15m"
          },
          "lowestChannelTime": {
            "channelId": "103",
            "channelName": "memes",
            "timeSpent": "25m"
          },
          "ranking": "2nd",
          "voiceChatTime": "3h 10m",
          "lastVoiceChat": "2025-05-06T17:20:00Z",
          "sharedChannels": ["101", "102"],
          "sharedChannelNames": ["general", "strategy"],
          "firstInteraction": "2023-02-05T09:15:00Z",
          "interactionFrequency": "Daily"
        },
        {
          "userId": "567834921562347519",
          "username": "FPSKing",
          "interactionTime": 450000,
          "lastSeenTogether": "2025-05-05T20:00:00Z",
          "favoriteChannel": {
            "channelId": "104",
            "channelName": "events",
            "timeSpent": "3h 50m"
          },
          "lowestChannelTime": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "30m"
          },
          "ranking": "3rd",
          "voiceChatTime": "2h 45m",
          "lastVoiceChat": "2025-05-05T19:30:00Z",
          "sharedChannels": ["101", "104"],
          "sharedChannelNames": ["general", "events"],
          "firstInteraction": "2023-02-20T13:45:00Z",
          "interactionFrequency": "Weekly"
        },
        {
          "userId": "784523916734521896",
          "username": "MusicMaster",
          "interactionTime": 320000,
          "lastSeenTogether": "2025-05-04T14:15:00Z",
          "favoriteChannel": {
            "channelId": "101",
            "channelName": "general",
            "timeSpent": "2h 40m"
          },
          "lowestChannelTime": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "40m"
          },
          "ranking": "4th",
          "voiceChatTime": "1h 35m",
          "lastVoiceChat": "2025-05-04T15:50:00Z",
          "sharedChannels": ["101"],
          "sharedChannelNames": ["general"],
          "firstInteraction": "2023-03-15T11:20:00Z",
          "interactionFrequency": "Monthly"
        }
      ]
    },
    {
      "id": "567834921562347519",
      "username": "FPSKing",
      "discriminator": "9012",
      "avatar": "assets/fakeProfileImages/Profile3.jpg",
      "banner": "https://cdn.discordapp.com/banners/567834921562347519/banner.png",
      "bannerColor": "#FAA61A",
      "status": "idle",
      "roles": ["Events Coordinator", "FPS Champion"],
      "joinedAt": "2023-02-15T16:45:00Z",
      "isBot": false,
      "lastOnlineDuration": "5h 30m",
      "channelData": [
        {
          "channelId": "101",
          "channelName": "general",
          "durationInChannel": "1h 50m",
          "lastConnectionTime": "2025-05-06T16:20:00Z",
          "voiceActivity": {
            "totalTime": "290h",
            "lastConnectedAt": "2025-05-06T18:10:00Z"
          }
        },
        {
          "channelId": "104",
          "channelName": "events",
          "durationInChannel": "4h 10m",
          "lastConnectionTime": "2025-05-05T15:30:00Z",
          "voiceActivity": {
            "totalTime": "540h",
            "lastConnectedAt": "2025-05-05T19:40:00Z"
          }
        },
        {
          "channelId": "105",
          "channelName": "music",
          "durationInChannel": "1h 15m",
          "lastConnectionTime": "2025-05-04T20:45:00Z",
          "voiceActivity": {
            "totalTime": "180h",
            "lastConnectedAt": "2025-05-04T22:00:00Z"
          }
        }
      ],
      "userData": [
        {
          "userId": "348571273246531585",
          "username": "GameMaster",
          "interactionTime": 640000,
          "lastSeenTogether": "2025-05-05T21:15:00Z",
          "favoriteChannel": {
            "channelId": "104",
            "channelName": "events",
            "timeSpent": "4h 10m"
          },
          "lowestChannelTime": {
            "channelId": "103",
            "channelName": "memes",
            "timeSpent": "35m"
          },
          "ranking": "1st",
          "voiceChatTime": "5h 45m",
          "lastVoiceChat": "2025-05-05T22:00:00Z",
          "sharedChannels": ["101", "104", "105"],
          "sharedChannelNames": ["general", "events", "music"],
          "firstInteraction": "2023-02-15T16:45:00Z",
          "interactionFrequency": "Weekly"
        },
        {
          "userId": "456238756917325824",
          "username": "StrategyQueen",
          "interactionTime": 450000,
          "lastSeenTogether": "2025-05-05T20:00:00Z",
          "favoriteChannel": {
            "channelId": "104",
            "channelName": "events",
            "timeSpent": "3h 50m"
          },
          "lowestChannelTime": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "30m"
          },
          "ranking": "3rd",
          "voiceChatTime": "2h 45m",
          "lastVoiceChat": "2025-05-05T19:30:00Z",
          "sharedChannels": ["101", "104"],
          "sharedChannelNames": ["general", "events"],
          "firstInteraction": "2023-02-20T13:45:00Z",
          "interactionFrequency": "Weekly"
        },
        {
          "userId": "784523916734521896",
          "username": "MusicMaster",
          "interactionTime": 580000,
          "lastSeenTogether": "2025-05-04T21:30:00Z",
          "favoriteChannel": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "5h 25m"
          },
          "lowestChannelTime": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "10m"
          },
          "ranking": "2nd",
          "voiceChatTime": "4h 20m",
          "lastVoiceChat": "2025-05-04T22:15:00Z",
          "sharedChannels": ["101", "105"],
          "sharedChannelNames": ["general", "music"],
          "firstInteraction": "2023-03-10T14:25:00Z",
          "interactionFrequency": "Weekly"
        },
        {
          "userId": "673456298145632789",
          "username": "LoreKeeper",
          "interactionTime": 290000,
          "lastSeenTogether": "2025-05-03T18:45:00Z",
          "favoriteChannel": {
            "channelId": "101",
            "channelName": "general",
            "timeSpent": "2h 10m"
          },
          "lowestChannelTime": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "20m"
          },
          "ranking": "4th",
          "voiceChatTime": "1h 40m",
          "lastVoiceChat": "2025-05-03T19:25:00Z",
          "sharedChannels": ["101"],
          "sharedChannelNames": ["general"],
          "firstInteraction": "2023-04-05T10:35:00Z",
          "interactionFrequency": "Monthly"
        }
      ]
    },
    {
      "id": "673456298145632789",
      "username": "LoreKeeper",
      "discriminator": "3456",
      "avatar": "assets/fakeProfileImages/Profile4.jpg",
      "bannerColor": "#F04747",
      "status": "online",
      "roles": ["Lore Master", "Storyteller"],
      "joinedAt": "2023-03-22T10:30:00Z",
      "isBot": false,
      "lastOnlineDuration": "2h 50m",
      "channelData": [
        {
          "channelId": "101",
          "channelName": "general",
          "durationInChannel": "6h 20m",
          "lastConnectionTime": "2025-05-06T12:00:00Z",
          "voiceActivity": {
            "totalTime": "410h",
            "lastConnectedAt": "2025-05-06T18:20:00Z"
          }
        },
        {
          "channelId": "102",
          "channelName": "strategy",
          "durationInChannel": "2h 15m",
          "lastConnectionTime": "2025-05-05T16:40:00Z",
          "voiceActivity": {
            "totalTime": "280h",
            "lastConnectedAt": "2025-05-05T18:55:00Z"
          }
        },
        {
          "channelId": "103",
          "channelName": "memes",
          "durationInChannel": "1h 30m",
          "lastConnectionTime": "2025-05-04T14:25:00Z",
          "voiceActivity": {
            "totalTime": "150h",
            "lastConnectedAt": "2025-05-04T15:55:00Z"
          }
        }
      ],
      "userData": [
        {
          "userId": "348571273246531585",
          "username": "GameMaster",
          "interactionTime": 520000,
          "lastSeenTogether": "2025-05-04T17:30:00Z",
          "favoriteChannel": {
            "channelId": "101",
            "channelName": "general",
            "timeSpent": "6h 20m"
          },
          "lowestChannelTime": {
            "channelId": "104",
            "channelName": "events",
            "timeSpent": "55m"
          },
          "ranking": "2nd",
          "voiceChatTime": "3h 15m",
          "lastVoiceChat": "2025-05-04T19:45:00Z",
          "sharedChannels": ["101", "102", "103"],
          "sharedChannelNames": ["general", "strategy", "memes"],
          "firstInteraction": "2023-03-22T10:30:00Z",
          "interactionFrequency": "Daily"
        },
        {
          "userId": "456238756917325824",
          "username": "StrategyQueen",
          "interactionTime": 720000,
          "lastSeenTogether": "2025-05-06T16:45:00Z",
          "favoriteChannel": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "4h 15m"
          },
          "lowestChannelTime": {
            "channelId": "103",
            "channelName": "memes",
            "timeSpent": "25m"
          },
          "ranking": "1st",
          "voiceChatTime": "3h 10m",
          "lastVoiceChat": "2025-05-06T17:20:00Z",
          "sharedChannels": ["101", "102", "103"],
          "sharedChannelNames": ["general", "strategy", "memes"],
          "firstInteraction": "2023-02-05T09:15:00Z",
          "interactionFrequency": "Daily"
        },
        {
          "userId": "567834921562347519",
          "username": "FPSKing",
          "interactionTime": 290000,
          "lastSeenTogether": "2025-05-03T18:45:00Z",
          "favoriteChannel": {
            "channelId": "101",
            "channelName": "general",
            "timeSpent": "2h 10m"
          },
          "lowestChannelTime": {
            "channelId": "104",
            "channelName": "events",
            "timeSpent": "20m"
          },
          "ranking": "3rd",
          "voiceChatTime": "1h 40m",
          "lastVoiceChat": "2025-05-03T19:25:00Z",
          "sharedChannels": ["101"],
          "sharedChannelNames": ["general"],
          "firstInteraction": "2023-04-05T10:35:00Z",
          "interactionFrequency": "Weekly"
        },
        {
          "userId": "784523916734521896",
          "username": "MusicMaster",
          "interactionTime": 180000,
          "lastSeenTogether": "2025-05-02T15:10:00Z",
          "favoriteChannel": {
            "channelId": "103",
            "channelName": "memes",
            "timeSpent": "1h 30m"
          },
          "lowestChannelTime": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "15m"
          },
          "ranking": "4th",
          "voiceChatTime": "45m",
          "lastVoiceChat": "2025-05-02T16:55:00Z",
          "sharedChannels": ["101", "103"],
          "sharedChannelNames": ["general", "memes"],
          "firstInteraction": "2023-05-10T17:30:00Z",
          "interactionFrequency": "Monthly"
        }
      ]
    },
    {
      "id": "784523916734521896",
      "username": "MusicMaster",
      "discriminator": "7890",
      "avatar": "assets/fakeProfileImages/Profile5.jpg",
      "banner": "https://cdn.discordapp.com/banners/784523916734521896/banner.png",
      "bannerColor": "#593695",
      "status": "dnd",
      "roles": ["DJ", "Music Enthusiast"],
      "joinedAt": "2023-04-05T18:15:00Z",
      "isBot": false,
      "lastOnlineDuration": "1h 45m",
      "channelData": [
        {
          "channelId": "101",
          "channelName": "general",
          "durationInChannel": "2h 20m",
          "lastConnectionTime": "2025-05-06T13:40:00Z",
          "voiceActivity": {
            "totalTime": "230h",
            "lastConnectedAt": "2025-05-06T16:00:00Z"
          }
        },
        {
          "channelId": "103",
          "channelName": "memes",
          "durationInChannel": "1h 10m",
          "lastConnectionTime": "2025-05-05T17:30:00Z",
          "voiceActivity": {
            "totalTime": "110h",
            "lastConnectedAt": "2025-05-05T18:40:00Z"
          }
        },
        {
          "channelId": "105",
          "channelName": "music",
          "durationInChannel": "8h 30m",
          "lastConnectionTime": "2025-05-04T10:00:00Z",
          "voiceActivity": {
            "totalTime": "780h",
            "lastConnectedAt": "2025-05-04T18:30:00Z"
          }
        }
      ],
      "userData": [
        {
          "userId": "348571273246531585",
          "username": "GameMaster",
          "interactionTime": 380000,
          "lastSeenTogether": "2025-05-03T13:20:00Z",
          "favoriteChannel": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "8h 30m"
          },
          "lowestChannelTime": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "15m"
          },
          "ranking": "3rd",
          "voiceChatTime": "4h 50m",
          "lastVoiceChat": "2025-05-03T15:10:00Z",
          "sharedChannels": ["101", "103", "105"],
          "sharedChannelNames": ["general", "memes", "music"],
          "firstInteraction": "2023-04-05T18:15:00Z",
          "interactionFrequency": "Weekly"
        },
        {
          "userId": "456238756917325824",
          "username": "StrategyQueen",
          "interactionTime": 320000,
          "lastSeenTogether": "2025-05-04T14:15:00Z",
          "favoriteChannel": {
            "channelId": "101",
            "channelName": "general",
            "timeSpent": "2h 40m"
          },
          "lowestChannelTime": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "40m"
          },
          "ranking": "4th",
          "voiceChatTime": "1h 35m",
          "lastVoiceChat": "2025-05-04T15:50:00Z",
          "sharedChannels": ["101"],
          "sharedChannelNames": ["general"],
          "firstInteraction": "2023-03-15T11:20:00Z",
          "interactionFrequency": "Monthly"
        },
        {
          "userId": "567834921562347519",
          "username": "FPSKing",
          "interactionTime": 580000,
          "lastSeenTogether": "2025-05-04T21:30:00Z",
          "favoriteChannel": {
            "channelId": "105",
            "channelName": "music",
            "timeSpent": "5h 25m"
          },
          "lowestChannelTime": {
            "channelId": "104",
            "channelName": "events",
            "timeSpent": "10m"
          },
          "ranking": "1st",
          "voiceChatTime": "4h 20m",
          "lastVoiceChat": "2025-05-04T22:15:00Z",
          "sharedChannels": ["101", "105"],
          "sharedChannelNames": ["general", "music"],
          "firstInteraction": "2023-03-10T14:25:00Z",
          "interactionFrequency": "Weekly"
        },
        {
          "userId": "673456298145632789",
          "username": "LoreKeeper",
          "interactionTime": 180000,
          "lastSeenTogether": "2025-05-02T15:10:00Z",
          "favoriteChannel": {
            "channelId": "103",
            "channelName": "memes",
            "timeSpent": "1h 30m"
          },
          "lowestChannelTime": {
            "channelId": "102",
            "channelName": "strategy",
            "timeSpent": "15m"
          },
          "ranking": "2nd",
          "voiceChatTime": "45m",
          "lastVoiceChat": "2025-05-02T16:55:00Z",
          "sharedChannels": ["101", "103"],
          "sharedChannelNames": ["general", "memes"],
          "firstInteraction": "2023-05-10T17:30:00Z",
          "interactionFrequency": "Monthly"
        }
      ]
    }
  ]
};