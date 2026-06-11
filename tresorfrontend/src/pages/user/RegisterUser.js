import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {postUser} from "../../comunication/FetchUser";

/**
 * RegisterUser
 * @author Peter Rutschmann
 * @author Sabina Teleskumar
 */
function RegisterUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errorMessage: ""
    };
    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8)       score +=25;
        if (/[A-Z]/.test(password))     score +=25;
        if (/\d/.test(password))        score +=25; //Ziffer
        if (/[@$!%*?&]/.test(password)) score +=25; //Sonderzeichen
        return score;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        //validate
        if(credentials.password !== credentials.passwordConfirmation) {
            console.log("password != passwordConfirmation");
            setErrorMessage('Password and password-confirmation are not equal.');
            return;
        }

        try {
            await postUser(credentials);
            setLoginValues({userName: credentials.email, password: credentials.password});
            setCredentials(initialState);
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Register user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                <aside>
                    <div>
                        <label>Firstname:</label>
                        <input
                            type="text"
                            value={credentials.firstName}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, firstName: e.target.value}))}
                            required
                            placeholder="Please enter your firstname *"
                        />
                    </div>
                    <div>
                        <label>Lastname:</label>
                        <input
                            type="text"
                            value={credentials.lastName}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, lastName: e.target.value}))}
                            required
                            placeholder="Please enter your lastname *"
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="text"
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, email: e.target.value}))}
                            required
                            placeholder="Please enter your email"
                        />
                    </div>
                </aside>
                    <aside>
                        <div>
                            <label>Password:</label>
                            <input
                                type="text"
                                value={credentials.password}
                                onChange={(e) => {
                                    setCredentials(prevValues => ({...prevValues, password: e.target.value}));
                                    setPasswordStrength(calculatePasswordStrength(e.target.value));
                            }}
                                required
                                placeholder="Please enter your pwd *"
                            />
                            <div style={{
                                height: '8px',
                                width: `${passwordStrength}%`,
                                backgroundColor: passwordStrength <= 25 ? 'red' : passwordStrength <= 50 ? 'orange' : passwordStrength <= 75 ? 'yellow' : 'green',
                                transition: 'width 0.3s'
                            }}/>
                            <small>{passwordStrength}% - {passwordStrength <= 25 ? 'Sehr schwach' : passwordStrength <= 50 ? 'Schwach' : passwordStrength <= 75 ? 'Mittel' : 'Stark'}</small>
                        </div>
                        <div>
                            <label>Password confirmation:</label>
                            <input
                                type="text"
                                value={credentials.passwordConfirmation}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({...prevValues, passwordConfirmation: e.target.value}))}
                                required
                                placeholder="Please confirm your pwd *"
                            />
                        </div>
                    </aside>
                </section>
                <button type="submit">Register</button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;
