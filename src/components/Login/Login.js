import React, { useState } from 'react';
import "./Login.css";
//google sign import
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, TwitterAuthProvider, updateProfile } from "firebase/auth";
import firebaseAuthentication from '../../Firebase/firebase.authentication'

firebaseAuthentication();
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const gitProvider = new GithubAuthProvider();
const fbProvider = new FacebookAuthProvider();
const twProvider = new TwitterAuthProvider();
const Login = () => {
    //error message
    const [msg, setMsg] = useState('');
    const [warning, setWarning] = useState('');
    //user type detect
    const [isLogIn, setIsLogIn] = useState(false);
    //input field value
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    //record logged user info
    const [userInfo, setUserInfo] = useState({});
    //handle Email and pass input
    const handleEmail = e => {
        setEmail(e.target.value)
    }
    const handlePassword = e => {
        if (e.target.value.length < 6) {
            setWarning("Password must be 6 charecter long")
        } else if (!/(?=.*[A-Z].*[A-Z])/.test(e.target.value)) {
            setWarning('Password at least two uppercase alpabet')
        } else {
            setWarning('')
            setPassword(e.target.value)
        }
    }
    //handle name Change
    const handleNameChange = e => {
        setName(e.target.value)
    }
    //handle create user with email and password
    const handleLogInWithEmailPassword = (e) => {
        e.preventDefault()
        !isLogIn ? loginEmailPassword() : createUserEmailPassword()
    }
    //create user with email and password
    const createUserEmailPassword = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {

                updateNameAndUrl(name)
                const { displayName, email, photoURL } = userCredential.user;
                const loggedInfo = { name: displayName, email: email, photo: photoURL }
                setUserInfo(loggedInfo)
                setMsg('User created and Successfully LoggedIn')
            }).catch(error => setMsg(error.message))
    }
    //handle login email and pass
    const loginEmailPassword = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const { displayName, email, photoURL } = userCredential.user;
                const loggedInfo = { name: displayName, email: email, photo: photoURL }
                setUserInfo(loggedInfo)
                setMsg('Successfully LoggedIn')
            }).catch(error => setMsg(error.message))
    }
    // handle oneclick login
    const handleLogin = (e) => {
        if (e === 'g') {
            signIn(googleProvider)
        } else if (e === 'git') {
            signIn(gitProvider)
        } else if (e === 'fb') {
            signIn(fbProvider)
        } else if (e === 'tw') {
            signIn(twProvider)
        }
    }
    //handle oneClick sign in
    const signIn = (provider) => {
        signInWithPopup(auth, provider)
            .then(result => {
                const { displayName, email, photoURL } = result.user;
                const loggedInfo = { name: displayName, email: email, photo: photoURL }
                setUserInfo(loggedInfo)
                setMsg('Successfully LoggedIn')
            }).catch(error => {
                setMsg(error.message);
            })
    }
    //upgrade name and photo url
    const updateNameAndUrl = (name) => {
        updateProfile(auth.currentUser, {
            displayName: name, photoURL: 'https://www.gstatic.com/devrel-devsite/prod/vc4b7e69446ada4fa1753c61a4ecfd1a68b4e6da32db3b09a8832658c9701d4ed/firebase/images/lockup.png'
        })
            .then(() => {

            }).catch(error => {
                setMsg(error.msg)
            })
    }
    //toggle logIn
    const toggleLogIn = e => {
        setIsLogIn(e === 'log' ? true : false)
    }
    return (
        <div className="bg-light w-50 mx-auto p-4">
            <h5 className={msg ? 'text-success' : 'text-danger'}>{msg ? `welcome to ${userInfo.name} ${msg}` : ''}</h5>
            <div className='d-flex align-items-center justify-content-center'>
                <form onSubmit={handleLogInWithEmailPassword} className='w-100'>
                    <h2 className='text-center'>{!isLogIn ? "Login From" : "Registration From"}</h2>
                    {
                        isLogIn && <div className="mb-3">
                            <label htmlFor="full-name" className="form-label">Full Name</label>
                            <input type="text" className="form-control" required placeholder="Full Name" onBlur={handleNameChange} />
                        </div>
                    }
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" onBlur={handleEmail} placeholder="example@xyz.com" required />
                        <div className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" onChange={handlePassword} placeholder="minimum 6 charecter long and two uppercase letter" required />
                        <div className="form-text text-danger">{warning}</div>
                    </div>
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className={!isLogIn ? 'btn btn-outline-warning' : 'd-none'}>Forgot Password</button>
                        <button type="submit" className="btn btn-primary">{isLogIn ? 'Register' : 'LogIn'}</button>
                    </div>
                    {/* register btn */}
                    <div className="btn ps-0 text-primary" onClick={() => toggleLogIn(isLogIn ? 'reg' : 'log')}>
                        {
                            isLogIn ? "Already register user Login here" : "New user? Register here"
                        }
                    </div>
                </form>
            </div>
            <h3 className="text-center">LogIn With Apps</h3>
            <div>
                <ul className="d-flex justify-content-center g-4 display-5 social-login-icon">
                    <li className="list-group-item" onClick={() => handleLogin('g')}><i className="fab fa-google"></i><small>oogle</small></li>
                    <li className="list-group-item" onClick={() => handleLogin('git')}><i className="fab fa-github"></i></li>
                    <li className="list-group-item" onClick={() => handleLogin('fb')}><i className="fab fa-facebook"></i></li>
                    <li className="list-group-item"><i className="fab fa-twitter" onClick={() => handleLogin('tw')}></i></li>
                </ul>
            </div>
        </div>
    );
};

export default Login;