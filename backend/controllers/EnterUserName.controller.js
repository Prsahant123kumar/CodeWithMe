const {UserName} =require("../models/PlatFormUserName")

const EnterUserName= async (UserId,username)=>{
    try{
        const leetcode=username?.leetcode || null;
        const codeforces=username?.codeforces || null;
        const codechef=username?.codechef || null;
        const codingNinja=username?.codingNinja || null;
        const HackerEarth=username?.HackerEarth || null;
        if(!leetcode && !codeforces && !codechef && !codingNinja && !HackerEarth) {
            return {
                success:true
            }
        }
        const PlatForm= await UserName.findOne({authId:UserId});
        if(PlatForm) {
            const result=UpdateUserName(UserId,username);
            return result;
        }
        const user=await  UserName.create({
            leetcode,
            codeforces,
            codechef,
            codingNinja,
            HackerEarth,
            authId:UserId
        })
        console.log(user,"username")
        return {
            success:true,
        }
    }catch(error) {
        return {
            success:false,
            message: "Internal server error"
        }
    }
}



const UpdateUserName= async (UserId,username)=>{
    try{
        const {leetcode,codeforces,codechef,codingNinja,HackerEarth}=username;
        const UpdateData={leetcode,codeforces,codechef,codingNinja,HackerEarth};
        const PlatForm= await UserName.findOneAndUpdate({authId:UserId},UpdateData,{new :true});
        if(PlatForm) {
            console.log(UserId,PlatForm.leetcode)
        }
        return {
            success:true,
        };
    }catch(error) {
        return {
            success:false,
            message: "Internal server error"
        }
    }
}

module.exports={EnterUserName,UpdateUserName};