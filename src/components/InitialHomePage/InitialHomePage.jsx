import { Link } from "react-router-dom"
import styles from "./InitialHomePage.module.css"

export default function InitialHomePage({games}){
    return (
        <div className={styles.main}>
            {
                games.map((game) => {
                    return(
                        // if admin approved the game display it
                        game.approved === 'yes' ?
                        <div className={styles.sub} style={game.qty > 0 ? {border: 'solid green'} : {border: 'solid red'}}>
                            <Link style={{backgroundImage: `url(${game.img})`}} to={`/${game._id}`} alt={game.name} ></Link>
                            <div className={styles.banner}>
                                <h2>{game.name} </h2>
                                <div> 
                                    {game.price <= 0 ? <p>Free</p> : <p>${game.price}</p>}
                                    {game.qty > 0 ? <p style={{color: 'green', fontSize: 'small'}}>Available</p> : <p style={{color: 'red', fontSize: 'small'}}>Sold Out</p> }
                                </div>
                            </div>
                        </div> : null
                    )
                })
            }
        </div>
    )
}