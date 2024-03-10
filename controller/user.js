const shortid = require('shortid');
const URL=require('../models/user')
const user=require('../models/usermodel')

async function handleGeneratedurl(req,res){
    const body=req.body
   
    if(!body.url) return res.status(400).json({error:"url is required"})
    
    const shortId=shortid();
    
    await URL.create({
        shortid:shortId,
        redirecturl:body.url,
        visitedHistory:[],
        createdBy:req.user._id,
    })
    const allurl=await URL.find({createdBy: req.user._id})
    return res.redirect("/")
// return res.json({id:shortId})
}
async function redirecttourl(req, res) {
    const shortid = req.params.shortid;
    // console.log("Received shortId:", shortid);
  
    try {
      const entry = await URL.findOneAndUpdate(
        { shortid },
        {
          $push: {
            visitedHistory: {
                timestamp: Date.now(),
            },
          }
        },
      );
  
      if (!entry) {
        // Handle the case when no matching entry is found
        console.log("No matching entry found for shortId:", shortid);
        res.status(404).send('URL not found'); // Return a 404 response or handle it according to your application's logic
        return;
      }
  
      res.redirect(entry.redirecturl);
    } catch (error) {
      // Handle any errors that occur during database query or update
      console.error('Error:', error);
      res.status(500).send('Internal server error'); // Return a 500 response or handle it according to your application's error handling strategy
    }
  }

  async function analytics(req,res){
    const shortid=req.params.shortid;
    const result=await URL.findOne({shortid})
    return res.json({
        numberofClicks:result.visitedHistory.length,
        analytics:result.visitedHistory
    })
  }
  
  async function deleteurl(req, res) {
    const shortid = req.params.shortid;

    try {
        // Use findOneAndRemove to find and remove the document
        const result = await URL.findOneAndRemove({ shortid });

        if (!result) {
            // If the entry is not found, send a 404 response
            res.status(404).send("URL not found");
            return;
        }

        // After deletion, fetch all URLs again
        const allurl=await URL.find({createdBy: req.user._id})

        // Render the updated list of URLs
        return res.render("home", {
            urls: allurl,
        });
    } catch (error) {
        // Handle any errors that occur during database operations
        console.error("Error deleting URL:", error);
        res.status(500).send("Internal Server Error");
    }
}



module.exports={handleGeneratedurl,redirecttourl,analytics,deleteurl}