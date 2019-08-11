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

describe('Taxi Test', () => {

    // insert test 
    // test("first test", ()=>{
    //     expect("name").toBe("name");
    // })

    test("reading subdocuments", async () => {
        
        let taxi = new Taxi();
        taxi.brand = 'Toyota';
        taxi.model = 'yaris';
        taxi.year = 2018;
        taxi.owner = {
            name:'Driver 1',
            experience: 15
        };

        taxi = await taxi.save();

        const readTaxi = await Taxi.findOne();
        expect(readTaxi.ownwer.name).toBe('Driver 1');
       
    });

    test('populate references', async()=>{

        let company = new Company();
        company.name = "First Company";
        comapany = await comapany.save();

        let taxi1 = new Taxi();
        taxi1.brand = 'Toyota';
        taxi1.model = 'yaris';
        taxi1.year = 2018;
        taxi1.owner = {
            name:'Driver 1',
            experience: 15
        };

        taxi2 = await taxi2.save();

        let taxi2 = new Taxi();
        taxi2.brand = 'benz';
        taxi2.model = 'C series';
        taxi2.year = 2012;
        taxi2.owner = {
            name:'Driver 2',
            experience: 7
        };

        taxi2 = await taxi2.save();
        company.taxies = [taxi1.id, taxi2.id];
        company = await company.save();
        // console.log(company);

        const read = 
        await Company.findById(company.id).populate('taxies');
        // console.log(readCompany);
        expect(readCompany.taxies[0].model).toBe('yaaris');
        expect(readCompany.taxies[1].model).toBe("Class E");

    });

    

})