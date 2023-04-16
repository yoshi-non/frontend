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
import { MultiQuestion } from '@/types/MultiQuestion';

const Lobby = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [membersReady, setMembersReady] = useState<
    Record<string, boolean> | undefined
  >(undefined);
  const [gameStatus, setGameStatus] = useState<
    'INVITING_MEMBERS' | 'GAME_STARTED'
  >('INVITING_MEMBERS');
  const [questions, setQuestions] = useState<
    MultiQuestion[]
  >([]);
  // useLeavePageConfirmation(roomId);

  useEffect(() => {
    if (roomId != '') {
      onSnapshot(doc(db, 'rooms', roomId), (doc) => {
        console.log(doc.data());
        setPlayers(doc.data()!.members);
        console.log(doc.data()!.membersReadyState);
        if (doc.data()!.status == 'INVITING_MEMBERS')
          setMembersReady(doc.data()?.membersReadyState);
        setGameStatus(doc.data()!.status);
        setQuestions(doc.data()!.questions);
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
    const baseURL = window.location.origin;
    navigator.clipboard.writeText(
      `${baseURL}/multi/lobby/${roomId}`
    );
  };

  const handleReady = () => {
    setMemberReady(roomId, !isReady);
    setIsReady(true);
  };

  const setMemberReady = async (
    roomId: string,
    ready: boolean
  ) => {
    const setMemberReadyCallback: HttpsCallable<
      { roomId: string; ready: boolean },
      undefined
    > = httpsCallable(functions, 'setMemberReadyState');
    await setMemberReadyCallback({
      roomId: roomId,
      ready: ready,
    });
  };

  return (
    <div>
      {gameStatus == 'GAME_STARTED' ? (
        <div></div>
      ) : (
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
            {players.map((player, index) => {
              const userId = player.userId;
              return (
                <PlayerCard
                  key={index}
                  name={player.playerName}
                  checked={membersReady![userId]}
                />
              );
            })}
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
          </div>

          <Background selected={'rgb(0, 225, 255)'} />
        </div>
      )}
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
