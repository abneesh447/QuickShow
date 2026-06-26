import { clerkClient } from "@clerk/express";

export const protectAdmin = async(req,res,next) => {
try {
    const {userId} = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : {};
    if (!userId) throw new Error("No userId found in req.auth");
    
    const user = await clerkClient.users.getUser(userId);
    console.log("Admin check for user:", userId, "Metadata:", user.privateMetadata);

    if(user.privateMetadata.role !== "admin"){
        return res.json({success:false,message:"Not Authorized: Role is " + user.privateMetadata.role})
    }

    next();
} catch (error) {
    console.error("protectAdmin error:", error);
    return res.json({success:false,message:"Not Authorized error: " + error.message})
}
}