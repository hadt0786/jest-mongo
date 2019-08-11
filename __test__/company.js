const mongoose = require('mongoose');
const Company = require('../models/Company');

let company ;

// helper function 

beforeAll(() => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/taxi-aggregator', { useNewUrlParser: true, useCreateIndex: true });
});

// excute at every starting of test case
beforeEach(async ()=>{

    company = new Company();
    company.name = "First Companny";
    company = await company.save();
});

// execute after every test cases

afterEach(async()=>{
    await Company.deleteMany({});
})

afterAll(done => {
    mongoose.disconnect(done);
})

// group of test

describe('create company', () => {

    // insert test 
    // test("first test", ()=>{
    //     expect("name").toBe("name");
    // })

    test("create company", async () => {
        // const company = new Company();
        // company.name = "First Company";
        // company = await company.save();

        // write assertion 
        const count = await Company.countDocuments();
        expect(count).toBe(1);
    })

    test('read company', async()=>{

        const readCompany = await Company.findById(company.id);
        expect(readCompany.name).toBe(company.name);

    });
    test('update company', async()=>{
        // update exiting company
        await Company.updateOne({_id:company.id},{name: "Name modified"});

        //read company
        const readCompany = await Company.findById(company.id);
        expect(readCompany.name).toBe("Name modified");
    });

    test('delete comapany', async()=>{
        const count  = Company.countDocuments();
        expect(count).toBe(1);
        await Company.deleteOne({_id:company.id});
        const newCount  = Company.countDocuments();
        expect(newCount).toBe(0);
    })

})