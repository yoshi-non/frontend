import { css } from '@emotion/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const styles = {
  container: css`
    background-color: transparent;
    border-radius: 10rem;
    border: 2px solid white;
    font-size: 2rem;
    text-align: center;
    color: white;
    display: flex;
    justify-content: center;
    align-items: space-between;
    gap: 10px;
    padding: 10px 20px;
  `,
};

const CheckCount = () => {
  return (
    <div>
      <p css={styles.container}>
        <i>
          <CheckCircleIcon />
        </i>
        <span>{`${'Submitした人数'}/${'参加人数'}`}</span>
        <span></span>
      </p>
    </div>
  );
};

export default CheckCount;
