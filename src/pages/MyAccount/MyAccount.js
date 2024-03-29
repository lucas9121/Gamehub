import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { editUser, deleteUser } from "../../utilities/users-service"
import styles from './MyAccount.module.css'
import Input from "../../components/Input/Input"

export default function MyAccount({user, refresh, setRefresh, setIsUpdated}) {
    const navigate = useNavigate()
    const [editBtn, setEditBtn] = useState(false)
    const name = useRef(null)
    const username = useRef(null)
    const email = useRef(null)

    const handleDelete = async (event) => {
        // making this an async await makes the code terminate after the fetch request
        try {
            await deleteUser(user._id)
        } catch(e) {
            console.log('error with delete ', e)
        } finally {
            navigate('/games')
            setIsUpdated(true)
            setRefresh(!refresh)
        }
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        const newUser = {
            ...user,
            name: name.current.value,
            username: username.current.value,
            email: email.current.value,
          };
        try{
            await editUser(newUser)
            setEditBtn(false)
            setIsUpdated(true)
            setRefresh(!refresh)
        }catch(e){
            console.log('error with submit ', e)
        }
    }


    return(
        <div className={styles.MyAccount}>
            <h2>My Account</h2> 
            {
                // if true, display the edit form
                editBtn ?
                <div onSubmit={handleSubmit}>
                    <form autoComplete="off" className={styles.form}>
                    <label>Name</label>
                    <Input type="text" name="name" inputRef={name} defaultValue={user.name}/>
                    {/* <input type="text" name="name" ref={name} defaultValue={user.name} /> */}
                    <label>Username</label>
                    <Input type="text" name="username" inputRef={username} defaultValue={user.username}/>
                    {/* <input type="text" name="username" ref={username} defaultValue={user.username} /> */}
                    <label>Email</label>
                    <Input type="email" name="email" inputRef={email} defaultValue={user.email}/>
                    {/* <input type="email" name="email" ref={email} defaultValue={user.email} /> */}
                    <label>Account Type</label>
                    <select name="account" defaultValue={user.account} disabled>
                        <option  value="gamer">Gamer</option>
                        <option value='developer'>Developer</option>
                        <option value='admin'>Admin</option>
                    </select>
                    <button type="submit" className="btn yes-btn">Edit Account</button>
                    {/* Set hook to false, which will hide the form without submitting it */}
                    <button className="btn no-btn" onClick={() => {setEditBtn(false)}} >Cancel</button>
                    </form>
                </div> :
                // display regular information
                <div className={styles.AccountInfo}>
                    <h4>Name</h4>
                    <p>{user.name}</p>
                    <h4>Username</h4>
                    <p>{user.username}</p>
                    <h4>Email</h4>
                    <p>{user.email} </p>
                    <h4>Account Type</h4>
                    <p style={{textTransform: 'capitalize'}}>{user.account}</p>
                    {/* sets hook to true, which will display the form */}
                    <div> 
                        <button className="btn main-btn" onClick={() => {setEditBtn(true)}}>Edit Account</button>
                        <button className="btn no-btn" onClick={handleDelete}>Delete Account</button>
                    </div>
                   
                </div>
            }
        </div>
    )
}