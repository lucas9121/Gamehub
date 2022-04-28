import './App.css'
import {Routes, Route} from "react-router-dom"
import { useState, useEffect } from "react"
import Home from '../Home/Home'
import MyAccount from '../MyAccount/MyAccount'
import Cart from '../Cart/Cart'
import Show from '../Show/Show'
import Edit from '../Edit/Edit'
import New from '../New/New'
// import AuthPage from '../AuthPage/AuthPage'
import { getUser } from '../../utilities/users-service'
import NavBar from '../../components/NavBar/NavBar'

export default function App(){
    const [games, setGames] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [user, setUser] = useState(getUser())

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('http://localhost:3001/api/games')
                const data = await res.json()
                setGames(data)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [refresh])

    return(
        <main className='App'>
            <NavBar user={user} setUser={setUser} />
            {/* <AuthPage user={user} setUser={setUser} /> */}
            <Routes>
                <Route path='/' element={<Home games={games} user={user}/>} />
                <Route path='/new' element={<New refresh={refresh} setRefresh={setRefresh}/>} />
                <Route path='/account' element={<MyAccount user={user} />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/:id/edit' element={<Edit refresh={refresh} setRefresh={setRefresh} />} />
                <Route path='/:id' element={<Show user={user}/>} />
            </Routes>
        </main>
    )
}
