import { useState } from 'react';
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { LoginProps } from '../types';
import { useMagic } from '../context/MagicProvider';
import { saveToken } from '../utils';
import showToast from '../utils/showToast';
import SpinnerWithStyles from './Spinner';

// import { useMagic } from '../MagicProvider';
// import showToast from '@/utils/showToast';
// import Spinner from '../../ui/Spinner';
// import { LoginProps } from '@/utils/types';
// import { saveToken } from '@/utils/common';
// import Card from '../../ui/Card';
// import CardHeader from '../../ui/CardHeader';
// import FormInput from '@/components/ui/FormInput';

const MagicEmailOTP = ({ magicToken, setMagicToken }: LoginProps) => {
    const { magic } = useMagic();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [isLoginInProgress, setLoginInProgress] = useState(false);

    const handleLogin = async () => {
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            setEmailError(true);
        } else {
            try {
                setLoginInProgress(true);
                setEmailError(false);
                const token = await magic?.auth.loginWithEmailOTP({ email });
                if (token) {
                    saveToken(token, setMagicToken, 'EMAIL');
                    setEmail('');
                }
            } catch (e) {
                console.log('login error: ' + JSON.stringify(e));
                if (e instanceof RPCError) {
                    switch (e.code) {
                        case RPCErrorCode.MagicLinkFailedVerification:
                        case RPCErrorCode.MagicLinkExpired:
                        case RPCErrorCode.MagicLinkRateLimited:
                        case RPCErrorCode.UserAlreadyLoggedIn:
                            showToast({ message: e.message, type: 'error' });
                            break;
                        default:
                            showToast({
                                message: 'Something went wrong. Please try again',
                                type: 'error',
                            });
                    }
                }
            } finally {
                setLoginInProgress(false);
            }
        }
    };

    return (
        <div>
            <h5>Email OTP Login (Magic)</h5>
            <div className="login-method-grid-item-container">
                <input
                    onChange={(e) => {
                        if (emailError) setEmailError(false);
                        setEmail(e.target.value);
                    }}
                    placeholder={'Email'}
                    value={email}
                />
                {emailError && <span className="error">Enter a valid email</span>}
                <button
                    disabled={isLoginInProgress || (magicToken.length > 0 ? false : email.length == 0)}
                    onClick={() => handleLogin()}
                >
                    {isLoginInProgress ? <SpinnerWithStyles /> : 'Log in / Sign up'}
                </button>
            </div>
        </div>
    );
};

export default MagicEmailOTP;
