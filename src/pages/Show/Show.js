import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styles from './Show.module.css'

export default function Show({user, refresh, setRefresh}) {
    const {id} = useParams()
    const navigate = useNavigate()
    const [game, setGame] = useState({})
    const [reviews, setReviews] = useState([])

    // reloads the page
    const [render, setRender] = useState(false)

    //Review hooks
    const [newReview, setNewReview] = useState({
        name: '',
        description: ''
    })
    const [reviewBtn, setReviewBtn] = useState(false)
    const description = useRef(null)
    const [editBtn, setEditBtn] = useState(false)

    // checks the index number of the review in the array
    const [index, setIndex] = useState(0)

    // useEffect watches it to see if should run the delete function
    const [dltBtn, setDltBtn] = useState(false)


    //opens admin div box
    const [noBtn, setNoBtn] = useState(false)
    const noReason = useRef(null)


    // When page mounts, fetch the individual game from database
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`/api/games/${id}`)
                const data = await response.json()
                setGame(data)
                setReviews(data.reviews)
            } catch(e) {
                console.log(e)
            }
        })() 
    }, [render, id])


    // changes the approved status of a game
    const handleApproved = async (event, response) => {
        event.preventDefault()
        try {
            if(response === 'yes'){
                // if admin clicked yes
                await fetch(`/api/games/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        approved: response,
                        reason: ''
                    })
                })
            } else {
                // if admin clicked no
                await fetch(`/api/games/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        approved: response,
                        reason: noReason.current.value
                    })
                })
            }
        } catch(e) {
            console.log(e)
        } finally {
            setNoBtn(false)
            setRefresh(!refresh)
            navigate('/')
        }
    }

    // adds user name and comment to the review hook
    const handleChange = () => {
        setNewReview({
            name: user.name,
            description: description.current.value
        })
    }

    // Makes a new review
    const handleSubmit = async (evt) => {
        evt.preventDefault()
        try{
            const response = await fetch(`/api/games/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    name: game.name,
                    price: game.price,
                    qty: game.qty,
                    img: game.img,
                    description: game.description,
                    reviews: [...reviews, newReview]
                })
            })
            setReviewBtn(false)
            setRender(!render)
            setNewReview({
                name: '',
                description: ''
            })
        }catch(e){
            console.log(e)
        }
    }

    // Edit existing review
    const handleEditClick =  (event) => {
        event.preventDefault()
        reviews.splice(index, 1, newReview)
        try {
            fetch(`/api/games/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    reviews: reviews
                })
            })
            setEditBtn(false)
            setRender(!render)
            setNewReview({
                name: '',
                description: ''
            })
        }catch(e){
            console.log(e)
        }
    }

    // Deletes existing review if hook is set to true
    useEffect(() => {
        if(dltBtn){
            reviews.splice(index, 1)
            try {
                fetch(`/api/games/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        reviews: reviews
                    })
                })
                setRender(!render)
                setDltBtn(false)
                console.log('comment deleted')
            }catch(e){
                console.log(e)
            }
        }
    }, [dltBtn])


    return(
        <main className={styles.show}>
            <h2>{game.name} </h2>
            {
                // Developer User and Admin user buttons and messages
                // edit game button for developer user if game wasn't rejected
                user && user.account === 'developer' && game.approved !== 'no' ? 
                <button className="btn yes-btn" onClick={() => navigate(`/${game._id}/edit`)} >Edit</button> :
                // Explanation for developer and edit button if game was rejected by admin
                user && user.account === 'developer' && game.approved === 'no' ?
                <div>
                    <p>{game.reason}</p>
                    <button className="btn yes-btn" onClick={() => navigate(`/${game._id}/edit`)} >Edit</button> 
                </div> :
                // review buttons for admin user
                user && user.account === 'admin' ? 
                <>
                <h5 style={{marginBottom: '10px'}}>Approved?</h5>
                <rndm style={{display: 'flex', marginBottom: '10px', gap: '5px'}}>
                    <button className="btn yes-btn" onClick={(evt) => {handleApproved(evt, 'yes')}}>Yes</button>
                    <button className="btn no-btn" onClick={(evt) => {setNoBtn(true)}}>No</button>
                </rndm> 
                </>:
                null
            }
            {
                // if admin didn't approbe the game show the text box to give reasons why
                noBtn ?
                <form onSubmit={(evt) => {handleApproved(evt, 'no')}}>
                    <label>Explain what needs to be changed</label>
                    <textarea cols="40" rows="3" ref={noReason} required></textarea>
                    <div>
                        <button type="submit" className="btn yes-btn">Submit</button>
                        <button className="btn no-btn" onClick={() => {setNoBtn(false)}}>Cancel</button>
                    </div>
                </form> : null
            }
            <img src={game.img} alt={game.name} max-width="700" max-height="700" />
            <div className={styles.purchase}>
                <div className={styles.title}>
                    <h4>Buy {game.name} </h4>
                </div>
                <p>Quantity: {game.qty} </p>
                <div>
                    <p>Price: {game.price}</p>
                    {
                        // disables add to cart button for developer account
                        user && user.account === 'developer' ?
                        <button className="btn sec-btn" disabled>Add to Cart</button> :
                        <button className="btn sec-btn">Add to Cart</button>
                    }
                </div>
            </div>
            <div className={styles.about}>
                <h3>About this Game:</h3>
                <hr />
                <div className={styles.description}>
                    <p>{game.description} </p>
                </div>
                <div className={styles.review}>
                    <h3>Customer Reviews</h3>
                    <hr />
                    {
                        // if user is null disable the button
                        !user ?
                        <div>
                            <button className="btn sec-btn" disabled> Write a review</button>
                            <small>sign in first</small>
                        </div> :
                        // if there is a user, and the account is admin or gamer and they pressed the write a review button
                        user.account !== 'developer' && reviewBtn ?
                            <form onSubmit={handleSubmit} method="POST">
                                <fieldset className={styles.new}>
                                    <label htmlFor="description">
                                        Write Review
                                    </label>
                                    <textarea name="description" ref={description} onChange={handleChange} maxLength={'300'} cols="40" rows="3"></textarea>
                                    <div>
                                        <input className='submit btn yes-btn' type="submit" value="Submit" />
                                        <button className="btn no-btn" onClick={() => {setReviewBtn(false)}}>Cancel</button> 
                                    </div>
                                </fieldset>
                            </form> :
                            // if there is a user and the user account is admin or gamer, but haven't pressed the button yet
                        user.account !== 'developer' && !reviewBtn ? 
                        <button className="btn sec-btn" 
                            onClick={(evt) => {
                                setReviewBtn(true)
                            }}>
                            Write a review
                        </button> :
                        // if user account is developer disable the button
                        <div>
                            <button className="btn sec-btn" disabled> Write a review</button>
                        </div> 
                    }
                    <div className={styles.comments}>
                        {
                            // checks to see if the array isn't empty first
                            reviews.length ?
                            reviews.map((review, idx) => {
                                return( 
                                    // opens the edit form instead of element the matches it in the array
                                    editBtn && index === idx ?
                                    <div key={idx}>
                                        <small>{review.name}</small>
                                        <form onSubmit={handleEditClick}>
                                            <fieldset className={styles.new}>
                                                <textarea name="description" ref={description} defaultValue={review.description} onChange={handleChange} maxLength={'300'} cols="40" rows="3"></textarea>
                                                <div>
                                                    <input className='submit btn yes-btn' type="submit" value="Submit" />
                                                    {/* just closes the edit form */}
                                                    <button className="btn no-btn" onClick={() => {setEditBtn(false)}}>Cancel</button> 
                                                </div>
                                            </fieldset>
                                        </form>
                                    </div> :
                                    // shows all of the reviews
                                    <div key={idx}>
                                        <small>{review.name}</small>
                                        <p>{review.description} </p>
                                        <div>
                                            {/* gives the index number of the element to the ternary above and then tells it to open the form */}
                                            { user && user.account === "gamer" && user.name === review.name ? <button className="btn main-btn" onClick={() => {setEditBtn(true); setIndex(idx)}} >Edit</button> : null } 
                                            { user && user.account === "gamer" && user.name === review.name ? <button className="btn no-btn" onClick={(evt) => {setDltBtn(true); setIndex(idx) }}> Delete </button> : null } 
                                        </div>

                                    </div> 
                                )
                            }) :
                            null
                            
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}