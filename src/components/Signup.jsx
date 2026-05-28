import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

function Signup() {
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[error, setError] = useState('')
    const[loading, setLoading] = useState('');

    const {session, signUp} = UserAuth();
    const navigate = useNavigate();
    console.log(session);


    const handleSignUp = async (e) => { 
        e.preventDefault();
        setLoading(true);
        try { 
            const result = await signUp(email, password)

            if(result.success) { 
                navigate("/dashboard");
            }
        } catch(error) { 
            setError("an error occurred");
        } finally { 
            setLoading(false);
        }
    }
    return (
        <div>
            <form onSubmit={handleSignUp} className = "max-w-md pt-24">
                <h2 className = "font-bold pb-2">Dont know what to mod? We can help!</h2>
                <p>Already have an account? <Link to ="/signin">Sign in! </Link></p>
            </form>
            <div className="flex flex-col py-4">
                <input onChange={(e) => setEmail(e.target.value)} className="p-3 mt-6" type='email' placeholder="abc@xyz.com" id="email" />
                <input onChange={(e) => setPassword(e.target.value)} className="p-3 mt-6" type='password' placeholder="Password" id="password" />
                <button type="submit" disabled={loading} className="mt-6 w-full" id="submit">Sign Up</button>
                {error && <p className="text-red-600 text-center pt-4">{error}</p>}
            </div>
        </div>
    )
}

export default Signup
