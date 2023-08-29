import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from '../../store/groups'
import { useHistory } from "react-router-dom"
import './index.css'

export default function GroupForm() {
    const history = useHistory()
    const user = useSelector(state => state.session.user)

    if (!user) {
        history.push('/')
    }

    const [name, setName] = useState("")
    const [location, setLocation] = useState("")
    const [about, setAbout] = useState("")
    const [onlineOrInperson, setOnlineOrInperson] = useState("")
    const [publicOrPrivate, setPublicOrPrivate] = useState("")
    const [imgUrl, setImgUrl] = useState("")
    const [errors, setErrors] = useState({})

    const groupState = useSelector((state) => state.group.newGroup)
    const newGroup = {...groupState}

    const dispatch = useDispatch()

    useEffect(() => {
        console.log({
            name, location, about, onlineOrInperson, publicOrPrivate
        })
    }, [name, location, about, onlineOrInperson, publicOrPrivate])





    const handleSumbit = (e) => {

        e.preventDefault()

        if (publicOrPrivate === 'Private') {
            setPublicOrPrivate(true)
        }
        else {
            setPublicOrPrivate(false)
        }

        console.log(publicOrPrivate)
        const [city, state] = location.split(', ')
        publicOrPrivate === 'Private' ? setPublicOrPrivate(true) : setPublicOrPrivate(false)

        const group = { name, city, state, about, type: onlineOrInperson, private: publicOrPrivate, }

        console.log("FINAL GROUP PARSE", group)

        dispatch(groupActions.requestNewGroup(group)).then(async(res) => {
            const data = await res
            console.log(data)
            if (!data.id) return
            const image = {
            url: imgUrl,
            preview: true
        }


            const id = data.id
            dispatch(groupActions.postImage(id, image))
            history.push(`/groups/${data.id}`)
        }).catch(async (res) => {

            const data = await res.json()
            if (data && data.errors) {
                console.log("DATA", data)
                return setErrors(data.errors);
            }

            console.log('NEW GROUP',newGroup)

        })



    }

    return (
        < div className='group-form-container'>

            <form
                id="group-form"
                onSubmit={handleSumbit}>
                <p>
                BECOME AN ORGNIZER
            </p>
            <h2 className='group-h2'>
                We'll walk you through a few steps to build your local community
            </h2>
                <div className='group-div'>
                    <h2>
                        First, set your group's location.
                    </h2>
                    <p>
                        Meetup groups meet locally, in person and online. We'll connect you with people
                        in your area, and more can join you online
                    </p>
                    <input
                    id='group-location'
                    className='group-input'
                        required
                        defaultValue="City, STATE"
                        onChange={(e) => {

                            setLocation(e.target.value)

                        }}
                        onClick={(e) => {
                            e.target.value = location
                        }}
                    >
                    </input>
                    {
                        (errors.city || errors.state) && <p className="errors">{errors.city} {errors.state}</p>

                    }
                </div>
                <div className='group-div'>
                    <h2>
                    What will your group's name be?
                </h2>
                <p>
                    Choose a name that will give people a clear idea of what the group is about.
                    Feel free to get creative! You can edit this later if you change your mind.
                </p>
                {errors.name && <p className="errors">{errors.name}</p>}
                <input
                id='group-name'
                className='group-input'
                    defaultValue="What is your group name?"
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    onClick={(e) => e.target.value = name}
                >
                </input>

                {
                    errors.name && <p className="errors">{errors.name}</p>
                }
                </div>
                <div className='group-div'>
                    <h2>
                    Now describe what your group will be about
                </h2>
                <p>
                    People will see this when we promote your group, but you'll be able to add to it later, too.
                </p>
                <ol>
                    <li>
                        What's the purpose of the group?
                    </li>
                    <li>
                        Who should join?
                    </li>
                    <li>
                        What will you do at your events?
                    </li>
                </ol>
                <textarea
                id='group-about'
                defaultValue='Please write at least 50 characters'
                className='group-input'
                    onChange={(e) => {
                        setAbout(e.target.value)
                    }}
                    onClick={(e) => {
                        e.target.value = about
                    }}
                >
                </textarea>
                {
                    errors.about && <p className="errors">{errors.about}</p>
                }
                </div>
                <div className='group-div'>
                    <h2>Final steps...</h2>
                <p>
                    Is this an in person or online group?
                </p>
                <select
                id='group-form-select'
                    className="group-form-select group-input"
                    defaultValue="(choose one)"
                    onChange={(e) => {
                        setOnlineOrInperson(e.target.value)
                    }}
                >
                    <option value="(choose one)" disabled selected>	&#40;choose one	&#41;</option>
                    <option>In person</option>
                    <option>Online</option>
                </select>
                {
                    errors.type && <p className="errors">Group Type is required</p>
                }
                <p>
                    Is this group private or public?
                </p>
                <select
                id='group-form-select'
                className="group-form-select group-input"
                    defaultValue='(choose one)'
                    onChange={(e) => {
                        if (e.target.value ==='Private') setPublicOrPrivate(true)
                        else setPublicOrPrivate(false)

                    }}
                >
                    <option value="(choose one)" disabled selected>	&#40;choose one	&#41;</option>
                    <option>Public</option>
                    <option>Private</option>
                </select>
                {
                    errors.private && <p className="errors">Visibility Type is required</p>
                }
                <p>
                    Please add an image url for your group below:
                </p>
                <input
                className='group-input'
                    onChange={(e) => {
                        const extensions = ['png', 'jpg', 'jpeg']
                        let urlExtension = e.target.value.split('.')
                        urlExtension = urlExtension[urlExtension.length - 1]
                        console.log(urlExtension)

                        if (!extensions.includes(urlExtension)) {
                            console.log(!extensions.includes(urlExtension))
                            return setErrors({ imgUrl: "Image URL must end in .png, .jpg, or .jpeg" })
                        }
                        else {
                            setErrors({})
                        }
                        setImgUrl(e.target.value)
                    }}
                >
                </input>
                {
                    errors.imgUrl && <p className='errors'>{errors.imgUrl}</p>
                }
                </div>



                <button
                    className={!name || !location || !about || !onlineOrInperson || (publicOrPrivate !== false && publicOrPrivate !== true) || !imgUrl ? 'disabled-group-submit-button' : 'group-submit-button' }
                    type='submit'
                    disabled={!name || !location || !about || !onlineOrInperson || (publicOrPrivate !== false && publicOrPrivate !== true) || !imgUrl }
                >Create group</button>
            </form>
        </div>
    )
}
