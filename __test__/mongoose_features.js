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

describe('mongoose feature', () => {

    // insert test 
    // test("first test", ()=>{
    //     expect("name").toBe("name");
    // })

    test("default validation", async () => {

        try {
            let company = new Company();
            await company.save();
        }
        catch (err) {
            // console.log(err.message);
            expect(err.message).toBe(`company validation failed: name: Path 'name' is required`)
        }

    });

    // custom validation

    test("custom validation", async () => {
// go in taxi schema and see the changes
        try {
           let taxi = new Taxi();
           taxi.model = 'Yaaris';
           taxi.year = 2017;
           taxi.owner = {
               name:" driver 1",
               experience : 15
           };
           taxt = await taxi.save(); // error message

        }
        catch (err) {
            console.log(err.message);
            expect(err.message).toBe(`taxi validation failed: brand: Brand is required`)
        }

    });


    // advanced custome validation
    test("advanced custom validation", async () => {
        // go in taxi schema and see the changes
                try {
                   let taxi = new Taxi();
                   taxi.brand = 'Toyota';
                   taxi.model = 'Yaaris';
                   taxi.year = 111;
                   taxi.owner = {
                       name:" driver 1",
                       experience : 15
                   };
                   taxt = await taxi.save(); // error message
        
                }
                catch (err) {
                    console.log(err.message);
                    expect(err.message).toBe(`taxi validation failed: brand: Brand is required`)
                }
        
            });

test('post save middleware', async()=>{

// go to company schema 

    try {

        let company = new Company();
        company.name = "throw error name";
        await company.save();

    }
    catch (err) {
        expect(err.message).toBe("New Test Error");
    }

});

test("pre save middleware", async()=>{

    let company = new Company();
    company.name = " abc's test#s";
    await company.save();

    const readCompnay = await Company.findOne();
    expect(readCompany.name).toBe("abcs test");

});

// pre remove 
// go and edit company schema

test("pre remove middleware", async()=>{

    let company = new Company();
    company.name = "First Company ";
    company = await company.save();

    let taxi = new Taxi();
    taxi.brand = "Toyoto";
    taxi.model = "Yaaris";
    taxi.year = 2015;
    taxi.owner = {
        name: "Driver 1",
        experience : 15
    };
    taxi = await taxi.save();

    let taxi2 = new Taxi();
    taxi2.brand = "Toyoto";
    taxi2.model = "Yaaris";
    taxi2.year = 2015;
    taxi2.owner = {
        name: "Driver 1",
        experience : 15
    };

    company.taxies = [taxi.id, taxi2.id];
    comapny = await comapny.save();

    expect(taxiCount).toBe(2);

    await company.delete();   
    // await Company.deleteOne({_id: company.id});  

    const newTaxiCount = await Taxi.countDocuments();
    exepect(newTaxiCount).toBe(0);

});

    
}) 