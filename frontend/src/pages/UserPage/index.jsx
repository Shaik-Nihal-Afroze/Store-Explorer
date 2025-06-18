import React from 'react'
import {useAuthStore} from "../../store/useAuthStore.js"
import { useApplicationsStore } from '../../store/useApplicationsStore.js'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/index.jsx'
import "../StoreOwnerPage/storeOwner.css"
import { useState,useEffect } from 'react'
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { toast } from 'react-toastify'

import { axiosInstance } from '../../lib/axios.js'
const UserPage = () => {
  
   const [rating,setRating] =useState(0);
   const [stores,setStores] =useState([])
    const navigate = useNavigate()
    const {logout,authUser}  = useAuthStore()
  
    
    const onClickLogout = ()=>{
      logout()
      navigate("/login")
    }
    
    const {getStores,allStores} = useApplicationsStore()
    
    useEffect(()=>{
      const fetchStore = async()=>{
         const response = await getStores()
         setStores(allStores)
      }
      fetchStore()
      
    },[getStores])

    const refreshStores = async()=>{
      await getStores()
      setStores(allStores)
    }
    const SubmitReviewForm = ({ storeName ,onreviewSubmit}) => {
      const [rating, setRating] = useState(0);
      const {authUser} = useAuthStore()
      const {_id} = authUser

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        try {
          const updatedRating = await axiosInstance.put(`/users/${_id}/stores/store/${storeName}/rating`, {
            
            rating,
            
          });
          console.log(updatedRating)
          toast.success("Review submitted!");
          if(onreviewSubmit){
            onreviewSubmit()
          }
        } catch (error) {
          console.error("Error submitting review", error);
        }
      };

      return (
        <form onSubmit={handleSubmit} className='rating-form'>
          
          <label className='rating-label'>
            Rating
            <select value={rating}  onChange={e => setRating(Number(e.target.value))}>
              <option value={0} className='select-container'>Select</option>
              {[1, 2, 3, 4, 5].map(star => (
                <option key={star} value={star} className='select-container'>{star}</option>
              ))}
            </select>
          </label>
          <br />
          
          <br />
          <button type="submit" className='submit-rating'>Submit</button>
        </form>
      );
    };

  
    console.log(allStores)
  return (
    <div className='owner-bg-container'>
      <Header/>
       <ul className='unordered-list'>
                  {allStores.map((eachStore)=>{
                    const ratingsArray = eachStore.rating
                    const totalRatings = (ratingsArray.length) -1
                    const averageRating = totalRatings>0?(ratingsArray.reduce((a,b)=>a+b,0)/totalRatings).toFixed(1):0;
                    const ratingText = totalRatings<2?'rating':'ratings'
                    
                 return(
                  <li className="store-item">
                    <div className="store-card-container">
                        {/* <img src = {eachStore.storeimage} className="store-image" alt={eachStore.storeName}/> */}
                        <div className="store-details-container">
                            <div className="store-name-category">
                                <h1 className="store-name">{eachStore.storeName}</h1>
                                <p className="about-store">{eachStore.category}</p>
                            </div>
                            <div className="store-rating-main-container">
                              <div className="store-rating-container">
                                <p className="store-rating">{averageRating}</p>
                                <FaStar size={20}/>
                                
                              </div>
                                
                              <p className='totalRatings'>{totalRatings} {ratingText}</p>
                              <SubmitReviewForm storeName = {eachStore.storeName} onreviewSubmit = {refreshStores}/>
                            </div>
                             <p className="store-address"><IoLocationOutline size = {20} /> {eachStore.address}</p>
                                <p className="store-contact">{eachStore.contact}</p>
                        </div>
                    </div>
                </li>)
                x
                })}
              </ul>
               
      
    </div>
  )
}

export default UserPage
