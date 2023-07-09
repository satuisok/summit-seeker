const mongoose = require("mongoose");
const Rock = require("../models/rocks");
const Review = require("../models/reviews");
const Route = require("../models/routes");
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
    await Review.deleteMany({});
    await Route.deleteMany({});
    for (let i = 0; i < names.length; i++) {
        const randomLocation = Math.floor(Math.random() * locations.length);
        const newRock = new Rock({
            name: names[i],
            location: {
                area: locations[randomLocation].location,
                state: locations[randomLocation].state,
                country: locations[randomLocation].country
            },
            image: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=684&q=80",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus iure sit iusto nisi recusandae saepe obcaecati laudantium reprehenderit assumenda similique, exercitationem, iste, ipsa corporis porro aliquid optio maxime unde debitis. Nihil repellat modi unde molestiae assumenda alias quia deserunt fuga quo, laborum qui corrupti sunt voluptate repudiandae labore deleniti harum facere voluptatum iusto vitae odio dolores? In neque esse quam!",
            author: "646dd32232a233dac9a5b8b0"
        })
        await newRock.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})

