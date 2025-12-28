import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCC8d5_lBK1Ye-OfiPcxFgNZ_Mi_ppR40U",
  authDomain: "artificial-games.firebaseapp.com",
  projectId: "artificial-games",
  storageBucket: "artificial-games.firebasestorage.app",
  messagingSenderId: "308527647648",
  appId: "1:308527647648:web:b856372a4a96f7665ab2c5",
  measurementId: "G-TGR00HE936"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const signInAnon = () => signInAnonymously(auth);

// Generate game code
const generateGameCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// Create game room
export const createGameRoom = async (gameType, hostName) => {
  const code = generateGameCode();
  const roomRef = doc(db, 'gameRooms', code);
  await setDoc(roomRef, {
    code,
    gameType,
    hostId: auth.currentUser?.uid,
    hostName,
    phase: 'lobby',
    players: [{
      id: auth.currentUser?.uid,
      name: hostName,
      isHost: true,
      score: 0,
      joinedAt: Date.now()
    }],
    currentRound: 0,
    submissions: [],
    votes: {},
    reactions: {},
    displayMode: null,
    displayData: null,
    isPaused: false,
    timerExtension: 0,
    featuredSubmission: null,
    createdAt: serverTimestamp(),
    settings: {
      roundTime: 300,
      maxPlayers: 20
    }
  });
  return code;
};

// Join game room
export const joinGameRoom = async (code, playerName) => {
  const roomRef = doc(db, 'gameRooms', code.toUpperCase());
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) {
    throw new Error('Game not found');
  }
  
  const player = {
    id: auth.currentUser?.uid,
    name: playerName,
    isHost: false,
    score: 0,
    joinedAt: Date.now()
  };
  
  await updateDoc(roomRef, {
    players: arrayUnion(player)
  });
  
  return roomSnap.data();
};

// Subscribe to room updates
export const subscribeToRoom = (code, callback) => {
  const roomRef = doc(db, 'gameRooms', code.toUpperCase());
  return onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
};

// Update game phase
export const updateGamePhase = async (code, phase, additionalData = {}) => {
  const roomRef = doc(db, 'gameRooms', code);
  await updateDoc(roomRef, { phase, ...additionalData });
};

// Submit to game
export const submitToGame = async (code, submission) => {
  const roomRef = doc(db, 'gameRooms', code);
  await updateDoc(roomRef, {
    submissions: arrayUnion({
      ...submission,
      oderId: auth.currentUser?.uid,
      timestamp: Date.now()
    })
  });
};

// Update submission (for edits)
export const updateSubmission = async (code, oderId, updates) => {
  const roomRef = doc(db, 'gameRooms', code);
  const roomSnap = await getDoc(roomRef);
  const room = roomSnap.data();
  
  const updatedSubmissions = room.submissions.map(s => 
    s.oderId === oderId ? { ...s, ...updates } : s
  );
  
  await updateDoc(roomRef, { submissions: updatedSubmissions });
};

// Submit vote
export const submitVote = async (code, oderId, vote) => {
  const oderId2 = auth.currentUser?.uid;
  const roomRef = doc(db, 'gameRooms', code);
  await updateDoc(roomRef, {
    [`votes.${oderId2}`]: vote
  });
};

// Add reaction
export const addReaction = async (code, submissionId, reactionType) => {
  const roomRef = doc(db, 'gameRooms', code);
  const roomSnap = await getDoc(roomRef);
  const room = roomSnap.data();
  
  const currentReactions = room.reactions || {};
  const submissionReactions = currentReactions[submissionId] || {};
  
  await updateDoc(roomRef, {
    [`reactions.${submissionId}.${reactionType}`]: (submissionReactions[reactionType] || 0) + 1
  });
};

// Update player score
export const updatePlayerScore = async (code, oderId, points) => {
  const roomRef = doc(db, 'gameRooms', code);
  const roomSnap = await getDoc(roomRef);
  const room = roomSnap.data();
  
  const updatedPlayers = room.players.map(p => 
    p.id === oderId ? { ...p, score: (p.score || 0) + points } : p
  );
  
  await updateDoc(roomRef, { players: updatedPlayers });
};

// Upload image
export const uploadImage = async (file, gameCode, oderId) => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `games/${gameCode}/${oderId}_${timestamp}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

// Facilitator controls
export const setDisplayMode = async (code, mode, data = null) => {
  const roomRef = doc(db, 'gameRooms', code);
  await updateDoc(roomRef, { displayMode: mode, displayData: data });
};

export const togglePause = async (code, isPaused) => {
  const roomRef = doc(db, 'gameRooms', code);
  await updateDoc(roomRef, { isPaused });
};

export const extendTimer = async (code, seconds) => {
  const roomRef = doc(db, 'gameRooms', code);
  const roomSnap = await getDoc(roomRef);
  const room = roomSnap.data();
  await updateDoc(roomRef, { timerExtension: (room.timerExtension || 0) + seconds });
};

export const removePlayer = async (code, oderId) => {
  const roomRef = doc(db, 'gameRooms', code);
  const roomSnap = await getDoc(roomRef);
  const room = roomSnap.data();
  const playerToRemove = room.players.find(p => p.id === oderId);
  if (playerToRemove) {
    await updateDoc(roomRef, {
      players: arrayRemove(playerToRemove)
    });
  }
};

export const featureSubmission = async (code, submissionId) => {
  const roomRef = doc(db, 'gameRooms', code);
  await updateDoc(roomRef, { featuredSubmission: submissionId });
};

export { onAuthStateChanged, arrayRemove, arrayUnion };
