import { LoginProps } from '../types';
import MagicEmailOTP from './MagicEmailOTP';

const MagicLogin = ({ magicToken, setMagicToken }: LoginProps) => {
    return (
        <div className="login-page">
            <div className={`max-w-[100%] grid grid-cols-1 grid-flow-row auto-rows-fr gap-5 p-4 mt-8`}>
                <MagicEmailOTP magicToken={magicToken} setMagicToken={setMagicToken} />
            </div>
        </div>
    );
};

export default MagicLogin;
