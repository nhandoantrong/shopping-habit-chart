let data = require("./convertcsv.json");
const fs = require("fs");

const columns = data[0];
data = data.slice(1);
const propertiedData = data.map(item => {
    const propertiedItem = {}
    for (let key in columns) {
        propertiedItem[columns[key]] = item[key];
    }
    return propertiedItem;
})

const choices = [
    ["Male", "Female"],
    ["18-30", "31-50", "51-65", "Over 65"],
    ["Once per week",
        "Twice per week",
        "More than twice per week",
        "Once per month"],
    ["Once per week",
        "Twice per week",
        "More than twice per week",
        "Once per month",
        "Sometimes",
        "Never"],
    [
        "Online shopping",
        "High streets",
        "Shopping center",
        "Market and supermarket"],
    [
        "Favorite shopping reason",
        "Discount",
        "Convenient",
        "Fast",
        "Easy to compare",
        "Fitting ability"],
    [
        "Clothes and shoes",
        "Books/ Magazines/ Newspapers/ Videos/ DVDs",
        "Technologies (laptop, PC, smart phones, cameras,...)",
        "Toys/ Gifts/ Boardgames",
        "Electronic devices (televisions, air conditioners, fridge,...)",
        "Housewares",
        "Stationeries"
    ],
    [
        "Clothes and shoes",
        "Books/ Magazines/ Newspapers/ Videos/ DVDs",
        "Technologies (laptop, PC, smart phones, cameras,...)",
        "Toys/ Gifts/ Boardgames",
        "Electronic devices (televisions, air conditioners, fridge,...)",
        "Housewares",
        "Stationeries"
    ],
    [
        "< 50",
        "50 - 100",
        "> 100",
        "Prefer not to say"
    ],
    [
        "Close early",
        "Parking fees",
        "Staff/ Services",
        "Take time",
        "No reason"
    ],
    [
        "Online",
        "In store"
    ],
    [
        "More discount",
        "Free delivery",
        "Entertainment activities",
        "Only go shopping in store"
    ],
]



const choicesMapKey = () => {
    let index = 0;
    const map = {}
    for (let key in columns) {
        map[columns[key]] = choices[index];
        index++
    }
    return map;
}

const answer = choicesMapKey();



const calculateNumberOfDocumentWithGenderAndAge = (gender, age, key, value) =>{
    const dataGenderFilter = propertiedData.filter(item => item.Gender === gender);
    const dataAgeFilter = dataGenderFilter.filter(item => item['Age range'] === age);
    const filterResult = dataAgeFilter.filter(item => item[key].includes(value));
    return filterResult.length
}

const ratio = {
    genderRatio: {
        Male: propertiedData.filter(item => item.Gender === "Male").length,
        Female: propertiedData.filter(item => item.Gender === "Female").length
    }
}

const ratioPropertiesWithGender = () => {
    for (let key in answer) {
        ratio[`${key} ratio`] = {
            Male: {},
            Female: {}
        };
        const currentObj = ratio[`${key} ratio`]

        for (let age of answer['Age range']){
            currentObj.Male[age]={}
            currentObj.Female[age]={}
        }


        const answerArr = answer[key];
        for (let ans of answerArr){
            for (let age of answer['Age range']){
                currentObj.Male[age][ans] = calculateNumberOfDocumentWithGenderAndAge("Male",age,  key, ans);
                currentObj.Female[age][ans] = calculateNumberOfDocumentWithGenderAndAge("Female",age, key, ans)
            }
        }
    }
}
ratioPropertiesWithGender()

const json = JSON.stringify(ratio);
fs.writeFile('ratio.json', json, 'utf8', () => {

});