import { useRef} from "react"
import { useNavigate } from "react-router-dom"
import * as gamesAPI from '../../utilities/games-api'
import styles from './New.module.css'

export default function New({refresh, setRefresh, user}){
    const name = useRef(null)
    const price = useRef(null)
    const img = useRef(null)
    const qty = useRef(null)
    const description = useRef(null)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const payload = {}
        payload.name =  name.current.value;
        payload.price =  price.current.value;
        payload.qty =  qty.current.value;
        payload.img =  img.current.value;
        payload.description = description.current.value;
        payload.dev = user._id
        payload.approved = 'review';
        try {
            console.log('try block')
            const data = await gamesAPI.createGame(payload)
            navigate(`/games/${data.createdGame._id}`)
        } catch(e) {
            console.log(e)
        } finally {
            setRefresh(!refresh)
        }
    }
    
    return (
        <main className={styles.New}>
            <h2>New Game</h2>
            <form onSubmit={handleSubmit}>
                    <div className={styles.FirstRow}>
                        <div>
                            <label htmlFor='name' >Name</label>
                            <input name="name" type="text" ref={name} id='name' required/>
                        </div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input name="price" type="number" ref={price} id='price' required/>
                        </div>
                        <div>
                            <label htmlFor="qty">Quantity</label>
                            <input name="qty" type="number" ref={qty} defaultValue='100' id='qty' required/>
                        </div>
                        <div>
                            <label htmlFor="img">Image</label>
                            <input name="img" type="url" ref={img} id='url' required/>
                        </div>
                    </div>
                    <div className={styles.SecondRow}>
                        <label htmlFor="description">  Description</label>
                        <textarea name="description" id="description description-box" ref={description} cols="40" maxLength={'2500'} rows="30" required></textarea>
                    </div>
                    <input className='btn yes-btn' type="submit" value="Create Game" />
                    <button className="btn no-btn" onClick={() => navigate('/games')}>Cancel</button>
                </form>
        </main>
    )
}