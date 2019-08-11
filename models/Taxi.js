const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// point schema for geo spatial 

const PointSchema = new Schema({
    type: { type:String, default:"Point"},
    coordinates: 
    { type: [Number], index: "2dsphere"} // long, lat vice versa in goolge map
});

/**Owner schema */

const OwnerSchema = new Schema({
    name: {type:String, required: true},
    experience : {type:String, required: true}
})


const TaxiSchema = new Schema({
    brand : { type: String, required:[true, 'Brand is required']}, // custome validation 
    model:{type:String, required:true},
    year:{type:Number, requires:true, validate:{
        validtaor: function(v){
            // return true validation is true or false validation is false
            return /^[0-9]{4}$/.test(v)
        
        },
        message: props=> `${props.value} is not a valid year!`
    }}, // advanced custom validation
    owner:OwnerSchema, // one to one
    geometry: PointSchema
});


// subdocumetns : pros and cons

/**
 * Pros
 * Simpler query, Single query, Avoids joins
 * Cons
 * Cannot query subdocument independently
 * Cannot reuse
 */

 // referencing : pros and cons
 /**
  * Pros :
  * Can independently query
  * Reusable
  * Avoid huge document size
  * 
  * Cons 
  * Need Joins
  * Slower Query(Sometimes)
  * 
  */




module.exports = mongoose.model('taxi', TaxiSchema);
// companies will automatically create a schema 