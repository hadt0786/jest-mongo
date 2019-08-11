const mongoose = require('mongoose');
const Company = require('../models/Company');
const Taxi = require('../models/Taxi');


// helper function 

beforeAll(() => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/taxi-aggregator', { useNewUrlParser: true, useCreateIndex: true });
});

// excute at every starting of test case
beforeEach(async () => {


});

// execute after every test cases

afterEach(async () => {
    await Company.deleteMany({});
    await Taxi.deleteMany({});
})

afterAll(done => {
    mongoose.disconnect(done);
})

// group of test

describe('MongoDB operator Test', () => {

    // insert test 
    // test("first test", ()=>{
    //     expect("name").toBe("name");
    // })

    test.only("$gt and $lt operators", async () => {

        // create a 5 different taxies
        for (let i = 1; i <= 5; i++) {
            let taxi = new Taxi();
            taxi.brand = "Toyota";
            taxi.model = "Yaris";
            taxi.year = 2015;
            taxi.owner = {
                name: `Driver ${i} `,
                experience: 5 * i
            }
            await taxi.save();

        }

        const count = await Taxi.countDocuments();
        expect(count).toBe(5);


        const readTaxis = await Taxi.find({
            "owner.experience": { $gt: 6, $lt: 21 }
        });

        expect(readTaxis.length).toBe(2);

    });

    test("$in", async () => {
        for (let i = 1; i <= 5; i++) {
            let taxi = new Taxi();
            taxi.brand = "Toyota";
            taxi.model = "Yaris";
            taxi.year = 2015;
            taxi.owner = {
                name: `Driver ${i} `,
                experience: 5 * i
            }
            await taxi.save();

        }

        const taxies = await Taxi().find({
            "owner.experience": { $in: [5, 15, 25, 30] }
        });
        // console.log(taxies, " taxies $in text ");
        expect(taxies.length).toBe(2);

    });

    // logical operator
    test('$and and $or', async () => {
        let taxi = new Taxi();
        taxi.brand = "Toyota";
        taxi.model = "Yaris";
        taxi.year = 2015;
        taxi.owner = {
            name: `Driver 1`,
            experience: 5
        }
        await taxi.save();

        const readTaxiAnd = await Taxi.find({
            $and: [{
                brand: "Toyota"
            },
            {
                "owner.experience": 6
            }]
        });
        expect(readTaxiAnd.length).toBe(0);

        const readTaxiOr = await Taxi.find({
            $or:[
                {
                    brand:"Toyota"
                },
                {
                    "owner.experience":6
                }
            ]

        });
        expect(readTaxiOr.length).toBe(1);
    });

    // update operator  - $inc - to increase a certain field
    test('update operator $inc', async()=>{
        let taxi = new Taxi();
        taxi.brand = "Toyota";
        taxi.model = "Yaris";
        taxi.year = 2015;
        taxi.owner = {
            name: `Driver 1`,
            experience: 5
        }
        await taxi.save();

        // await Taxi.updateOne({_id:taxi.id}, { year: 2017 })

        await Taxi.updateOne({_id:taxi.id}, {$inc : { year: 2017 }});

        const updatedTaxi = await Taxi.findById(taxi.id);
        expect(updatedTaxi.year).toBe(2017);

    });



})