import GameTimeCard from '@/components/game/GameTimeCard';
import ItemNameCard from '@/components/game/ItemNameCard';
import KeyPadCard from '@/components/game/KeyPadCard';
import AnsQuizButton from '@/components/game/AnsQuizButton';
import {
  ansQuizState,
  crrQuizNumState,
  itemData,
  keyPadNumState,
} from '@/store/atoms';
import { Styles } from '@/types/Styles';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Background } from '@/components/elements/Background';
import { Title } from '@/components/index/Title';
import HomeButton from '@/components/elements/HomeButton';
import { motion } from "framer-motion"

const Quiz = () => {
  const [item, setItem] = useRecoilState(itemData);

  const [crrQuizNum, setCrrQuizNum] =
    useRecoilState(crrQuizNumState);

  const [ansQuizUrl, setAnsQuizUrl] =
    useRecoilState(ansQuizState);

  const [keyPadNum, setKeyPadNum] =
    useRecoilState(keyPadNumState);

  // Todo:問題が始まったらAPI取得して新しい商品をセットする + タイマーをセットする
  useEffect(() => {
    setKeyPadNum(0);
    setAnsQuizUrl('/solo/ans');
  }, []);

  return (
    <div style={styles.container}

    >
      <HomeButton />
      {/* <h1 style={styles.titleWrapper}>Price Quest</h1> */}
      <span style={styles.titleWrapper}>
        <Title canBounding={false} />
      </span>
      <motion.div style={styles.wrapper}
        initial={{
          scale: 0
        }}
        animate={{
          scale: 1
        }}
        exit={{
          opacity: 0
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          duration: 0.3,
        }}
      >
        {/* 左側 */}
        <div style={styles.leftWrapper}>
          <ItemNameCard />
          <div style={styles.itemImageWrapper}>
            {item[crrQuizNum] && (
              <Image
                src={item[crrQuizNum].images[0].imageUrl!}
                alt={item[crrQuizNum].quiz}
                width={400}
                height={400}
                style={{
                  boxShadow: "0 0 15px rgb(199,81,250)"
                }}
              />
            )}
          </div>
        </div>

        {/* 右側 */}
        <div style={styles.rightWrapper}>
          <GameTimeCard />
          <KeyPadCard />
          <AnsQuizButton />
        </div>
      </motion.div>
      <Background selected='rgb(199, 81, 250)' />
    </div>
  );
};

export default Quiz;

const styles: Styles = {
  container: {
    margin: '50px 0',
    overflowX: 'hidden'
  },
  titleWrapper: {
    textAlign: 'center',
  },
  wrapper: {
    width: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '50px',
  },
  leftWrapper: {
    flex: 3,
    textAlign: 'center',
  },
  itemImageWrapper: {
    // border: '2px solid black',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '50px',
  },
};
