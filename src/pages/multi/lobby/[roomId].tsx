import HomeButton from '@/components/elements/HomeButton';
import Title from '@/components/elements/Title';
import { Background } from '@/components/elements/background';
import { LobbyButton } from '@/components/lobby/LobbyButton';
import { PlayerCard } from '@/components/lobby/PlayerCard';
import { useFirebaseUserId } from '@/hooks/useFirebaseUserId';
import {
  db,
  firebaseSignIn,
  functions,
} from '@/lib/firebase';
import { playersState, roomIdState } from '@/store/atoms';
import { Player } from '@/types/Player';
import { Styles } from '@/types/Styles';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  HttpsCallable,
  httpsCallable,
} from 'firebase/functions';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

const Lobby = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useRecoilState(roomIdState);
  const [players, setPlayers] =
    useRecoilState(playersState);
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
        <Title />
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
            style={styles.textInput}
            ref={playerNameRef}
            placeholder="名前を入力"
            onFocus={(e) => e.target.select()}
            maxLength={15}
          />
          <LobbyButton
            name="入室する"
            onClick={handleJoinRoom}
          />
        </div>

        <Background selected={'rgb(0, 225, 255)'} />
      </div>
    </div>
  );
};
const styles: Styles = {
  title: {
    textAlign: 'center',
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
  textInput: {
    backgroundColor: 'rgb(0 0 0 /0)',
    border: '2px solid #fff',
    boxShadow: '0 0 5px #fff',
    fontSize: 30,
    alignSelf: 'center',
    width: 500,
    textAlign: 'center',
    borderRadius: 100,
    padding: '10px 20px',
    marginTop: 30,
  },
};

export default Lobby;
function createRoomCallback(arg0: { playerName: string }) {
  throw new Error('Function not implemented.');
}
