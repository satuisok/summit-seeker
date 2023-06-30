const mongoose = require("mongoose");
const Rock = require("../models/rocks");
const { names, locations } = require('./seedData');



/********* connect to MongoDB ***********/

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/summit-seeker');
}

main()
    .then(() => console.log('Database connected!'))
    .catch(err => console.log(err));

/********* connect to MongoDB ***********/


const seedDB = async () => {
    await Rock.deleteMany({});
    for (let i = 0; i < names.length; i++) {
        const randomLocation = Math.floor(Math.random() * locations.length);
        const newRock = new Rock({
            name: names[i],
            location: {
                area: locations[randomLocation].location,
                state: locations[randomLocation].state,
                country: locations[randomLocation].country
            },
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus iure sit iusto nisi recusandae saepe obcaecati laudantium reprehenderit assumenda similique, exercitationem, iste, ipsa corporis porro aliquid optio maxime unde debitis. Nihil repellat modi unde molestiae assumenda alias quia deserunt fuga quo, laborum qui corrupti sunt voluptate repudiandae labore deleniti harum facere voluptatum iusto vitae odio dolores? In neque esse quam!",
        })
        await newRock.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})

