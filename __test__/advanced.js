const mongoose = require('mongoose');
const Company = require('../models/Company');
const Taxi = require('../models/Taxi');


// helper function 

beforeAll(() => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/taxi-aggregator', { useNewUrlParser: true, useCreateIndex: true });
});

// excute at every starting of test case
beforeEach(async ()=>{

   
});

// execute after every test cases

afterEach(async()=>{
    await Company.deleteMany({});
    await Taxi.deleteMany({});
})

afterAll(done => {
    mongoose.disconnect(done);
})

// group of test

describe('Advanced mongodb features', () => {

    // insert test 
    // test("first test", ()=>{
    //     expect("name").toBe("name");
    // })

    test("skip and limit", async () => {
        
       for(let i = 1; i<=55;i++){
           let company = new Company();
           company.name = `Company ${i+1}`;
           await company.save();
       }
       
       const pagination = 10;
       let page = 1;

       const firstGroup = await Company.find()
       .skip((page-1)*pagination)
       .limit(pagination);

       expect(firstGroup.length).toBe(10);


       page = 6;

       const secondGroup = await Company.find()
       .skip((page-1)*pagination)
       .limit(pagination);

       expect(secondGroup.length).toBe(6);
       expect(secondGroup[0].name).toBe("Company 50");





    });

    
// geospatoial 

test('geonear', async()=>{

    // sanfransico code  -- long, lat

    const SFCordinates = [-122.4223791, 37.7679638];
    const NYCordinate = [-73.9759597, 40.78306449];
    const ClientNearbyNYCordinates = [-73.9795183, 40.784056];

    let taxi = new Taxi();
    taxi.brand = "Toyota";
    taxi.model = "Yaaris";
    taxi.year = {
        name: "Driver 1", experience : 15
    };
    taxi.geometry = {
        coordinates: SFCordinates
    }

    taxi = await taxi.save();
    let taxi2 = new Taxi();
    taxi2.brand = "Toyota";
    taxi2.model = "Yaaris";
    taxi2.year = {
        name: "Driver 2", experience : 7
    };
    taxi2.geometry = {
        coordinates: NYCordinates
    }

    taxi2 = await taxi2.save();

    // pipeline - is a series of step you want to query in databse


    const taxisNearbyOneka = await Taxi.aggregate([
        {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates:ClientNearbyNYCordinates
                },
                spherical : true,
                maxDistance:1*1000,
                distanceField:"dist.calculated"
            }
        }
    ]);

    // console.log(taxisNearbyOneka)
    expect(taxisNearbyOneka[0].onwer.name).toBe("Driver 2");


    const taxisNearbyOuaterKm = await Taxi.aggregate([
        {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates:ClientNearbyNYCordinates
                },
                spherical : true,
                maxDistance:0.25*1000,
                distanceField:"dist.calculated"
            }
        }
    ]);

    // console.log(taxisNearbyOneka)
    expect(taxisNearbyOuaterKm.length).toBe(0);

    const taxisNearbyThousandsKm = await Taxi.aggregate([
        {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates:ClientNearbyNYCordinates
                },
                spherical : true,
                maxDistance:5000*1000,
                distanceField:"dist.calculated"
            }
        }
    ]);

    // console.log(taxisNearbyOneka)
    expect(taxisNearbyThousandsKm.length).toBe(0);


});
    

})