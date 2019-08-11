const mongoose = require('mongoose');
const Taxi = require('./Taxi');
const Schema = mongoose.Schema;




const CompanySchema = new Schema({
    name : { type: String, required:true},
    taxies :[{type: Schema.Types.ObjectId, ref:"taxi"}]
    // taxies :[TaxiSchmea]
});

// post save middleware tetsing 

CompanySchema.post('save', doc=>{
    // throw error if mame equals ' throw error name
    if(doc.name==='throw error name') throw new Error('New test error');

});

// pre save middleware

CompanySchema.pre('save', function(next){
    // sanitizing company name before saving
    this.name = this.name.replace(/[^a-zA-Z0-9]/g," ");
    next();
})

// pre remove middleware


CompanySchema.pre('remove', async function(next){
   
    // delete comapny taxies befire removeing
    await Taxi.deleteMany({
        _id : {
            $in: this.taxies
        }
    });
    next();

})


module.exports = mongoose.model('company', CompanySchema);
// companies will automatically create a schema 