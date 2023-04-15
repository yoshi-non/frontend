import HomeButton from '@/components/elements/HomeButton';
import { LobbyButton } from '@/components/lobby/LobbyButton';
import { PlayerCard } from '@/components/lobby/PlayerCard';
import { Styles } from '@/types/Styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { db, functions } from '@/lib/firebase';
import { Player } from '@/types/Player';
import LeaveButton from '@/components/multi/LeaveButton';
import useLeavePageConfirmation from '@/hooks/useLeavePageConfirmation';
import {
  HttpsCallable,
  httpsCallable,
} from '@firebase/functions';
import { Background } from '@/components/elements/background';

const Lobby = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  // useLeavePageConfirmation(roomId);

  useEffect(() => {
    if (roomId != '') {
      onSnapshot(doc(db, 'rooms', roomId), (doc) => {
        console.log(doc.data());
        setPlayers(doc.data()!.members);
      });
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

  const handleCopy = () => {
    const baseURL = 'http://localhost:3000';
    navigator.clipboard.writeText(
      `${baseURL}/multi/lobby/${roomId}`
    );
  };

  const handleReady = () => {
    setMemberReady(roomId);
    setIsReady(true);
  };

  const setMemberReady = async (roomId: string) => {
    const setMemberReadyCallback: HttpsCallable<
      { roomId: string },
      undefined
    > = httpsCallable(functions, 'setMemberReady');
    await setMemberReadyCallback({
      roomId: roomId,
    });
  };

  return (
    <div>
      <LeaveButton roomId={roomId} />
      <h1 style={styles.titleWrapper}>
        <span
          style={{
            color: 'rgb(199,81,250)',
            textShadow: `0px 0px 10px rgb(199,81,250)`,
          }}
        >
          Price
        </span>
        <span
          style={{
            color: '#fff',
            textShadow: `0px 0px 5px #fff`,
          }}
        >
          $
        </span>
        <span
          style={{
            color: 'rgb(0,255,250)',
            textShadow: `0px 0px 10px rgb(0,255,250)`,
          }}
        >
          Quest
        </span>
      </h1>
      <div style={styles.playerContainer}>
        {players.map((player, index) => (
          <PlayerCard
            key={index}
            name={player.playerName}
          />
        ))}
      </div>

      <div style={styles.buttonContainer}>
        <LobbyButton
          name="URLをコピー"
          onClick={handleCopy}
        />
        <LobbyButton
          disabled={isReady}
          name="準備完了"
          onClick={handleReady}
        />
        {'何人OK/参加人数'}
      </div>

      <Background selected={'rgb(0, 225, 255)'} />
    </div>
  );
};
const styles: Styles = {
  titleWrapper: {
    fontSize: 80,
    textAlign: 'center',
    padding: '50px',
  },

  playerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
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
