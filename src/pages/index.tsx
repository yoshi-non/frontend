import TestChild from '@/components/TestChild';
import { textState } from '@/store/atoms';
import styles from '@/styles/Home.module.css';
import { useRecoilState } from 'recoil';

export default function Home() {


  return (
    <div>
      <main>
        <h1>タイトル</h1>
        <button>スタート</button>
        <button>一人で遊ぶ</button>
        <button>二人で遊ぶ</button>

      </main>

    </div>
  );
}
