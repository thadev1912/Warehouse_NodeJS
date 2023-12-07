const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const algorithm = "aes-256-cbc";
//let encryptionEnabled =true; 
const encryptData = (token,encryptionEnabled,data) => {
    return new Promise((resolve, reject) => {
        const keyToken = token.split(" ")[1];
        jwt.verify(keyToken, process.env.JWT_SECRET, (err, resp) => {
            if (err) {
              console.log("Error verifying token:", err);
               const Error = {
                status:403,
                success: false,                
                message: 'Token has been expried or invalid',
            };
               reject(Error);                
            } else {
                getInfoUser = resp;        
                const SecurityKey= Buffer.from(getInfoUser._SecurityKey,'hex');      
                const initVector=  Buffer.from(getInfoUser._initVector,'hex');
                const cipher = crypto.createCipheriv(algorithm, SecurityKey, initVector); 
                let encryptedData = '';  
                if (encryptionEnabled)
                {
                    const getDataString = JSON.stringify(data);               
                    let _encryptedData = cipher.update(getDataString, "utf-8", "hex");
                    _encryptedData += cipher.final("hex");   
                    encryptedData=_encryptedData
                }    
                 
                else {
                    encryptedData = data; 
                }   
                resolve(encryptedData);
                return encryptedData;
            }
        });
    });
}
const decryptData = (token,encryptionEnabled,data) => {
    return new Promise((resolve, reject) => {
        const keyToken = token.split(" ")[1];
        jwt.verify(keyToken, process.env.JWT_SECRET, (err, resp) => {
            if (err) {                
                console.log("Error verifying token:", err);
                const Error = {
                status:403,
                success: false,                
                message: 'Token has been expried or invalid',
            };
               reject(Error);
            } else {
                getInfoUser = resp;        
                const SecurityKey= Buffer.from(getInfoUser._SecurityKey,'hex');      
                const initVector=  Buffer.from(getInfoUser._initVector,'hex');
                const decipher = crypto.createDecipheriv(algorithm, SecurityKey, initVector);
                let decryptedData = '';
                if (encryptionEnabled) {
                    let _decryptedData = decipher.update(data, "hex", "utf-8");
                     _decryptedData += decipher.final("utf-8");
                      decryptedData=JSON.parse(_decryptedData); 
                   // decryptedData = JSON.parse(_decryptedData + decipher.final("utf-8"));
                } else {
                    decryptedData = data; // If encryption is disabled, assume data is not encrypted
                }
                // let _decryptedData = decipher.update(data, "hex", "utf-8");
                // _decryptedData += decipher.final("utf-8"); 
                 //decryptedData=JSON.parse(_decryptedData);
                resolve(decryptedData);
                return decryptedData;
            }
        });
    });
}
module.exports = {
    encryptData,
    decryptData
};