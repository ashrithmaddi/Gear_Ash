import { createContext,useState } from "react";
export const userAdminContextObj=createContext();

function UserAdmin({children}) {
    let[currentUser,setCurrentUser]=useState({
        firstName:'',
        lastName:'',
        email:"",
        profileImageUrl:'',
        role:""
      })
        return (
        <div>
          <userAdminContextObj.Provider value={{currentUser,setCurrentUser}}>
            {children}
          </userAdminContextObj.Provider>
        </div>
      )
  
}

export default UserAdmin


