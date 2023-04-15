import HomeButton from '@/components/elements/HomeButton';
import { LobbyButton } from '@/components/lobby/LobbyButton';
import { PlayerCard } from '@/components/lobby/PlayerCard';
import { useFirebaseUserId } from '@/hooks/useFirebaseUserId';
import {
  db,
  firebaseSignIn,
  functions,
} from '@/lib/firebase';
import { Player } from '@/types/Player';
import { Styles } from '@/types/Styles';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  HttpsCallable,
  httpsCallable,
} from 'firebase/functions';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const Lobby = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const userId = useFirebaseUserId();
  const playerNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(roomId);
    if (roomId != '') {
      const unsub = onSnapshot(
        doc(db, 'rooms', roomId),
        (doc) => {
          console.log(doc.data());
          setPlayers(doc.data()!.members);
        }
      );
    }
  }, [roomId]);

  useEffect(() => {
    const queryRoomId =
      router.query.roomId != null &&
      typeof router.query.roomId === 'string'
        ? router.query.roomId
        : '';
    setRoomId(queryRoomId);
  }, [router]);

  const handleJoinRoom = async () => {
    if (userId == undefined) await firebaseSignIn();
    const playerName =
      playerNameRef.current!.value == ''
        ? `プレイヤー${players.length + 1}`
        : playerNameRef.current!.value;
    await joinRoom(roomId, playerName);
    router.push(`/multi/${roomId}`);
  };

  // 入室
  const joinRoom = async (
    roomId: string,
    playerName: string
  ) => {
    const joinRoomCallback: HttpsCallable<
      { roomId: string; playerName: string },
      any
    > = httpsCallable(functions, 'joinRoom');
    await joinRoomCallback({
      roomId: roomId,
      playerName: playerName,
    });
  };

  return (
    <div>
      {/* ホームボタンコンポーネント */}
      <div>
        <HomeButton />
        <h1 style={styles.title}>PriceQuest</h1>
        <div style={styles.playerContainer}>
          {players.map((player, index) => (
            <PlayerCard
              key={index}
              name={player.playerName}
            />
          ))}
        </div>

        <div style={styles.buttonContainer}>
          <input
            type="text"
            ref={playerNameRef}
            placeholder="名前を入力"
            style={{ backgroundColor: '#000' }}
          />
          <LobbyButton
            name="入室する"
            onClick={handleJoinRoom}
          />
        </div>
      </div>
    </div>
  );
};
const styles: Styles = {
  title: {
    textAlign: 'center',
  },

  playerContainer: {
    position: 'absolute',
    top: 300,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    // width: 300,
    // margin: "0 auto"
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    textAlign: 'center',
  },
};

export default Lobby;
function createRoomCallback(arg0: { playerName: string }) {
  throw new Error('Function not implemented.');
}
