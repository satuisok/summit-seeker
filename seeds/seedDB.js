const mongoose = require("mongoose");
const Rock = require("../models/rocks");
const Review = require("../models/reviews");
const Route = require("../models/routes");
const rockAndMountainNames = require("./rockNames");
const climbingRouteNames = require("./routeNames");
const locations = require("./locationSeeds");
const grades = require("./grades");
const images = require("./images");




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


    for (let i = 0; i < rockAndMountainNames.length; i++) {
        const randomLocation = Math.floor(Math.random() * 1000);
        const randomImage1 = Math.floor(Math.random() * images.length);
        const randomImage2 = Math.floor(Math.random() * images.length);

        const newRock = new Rock({
            name: rockAndMountainNames[i],
            location: {
                area: locations[randomLocation].city,
                state: locations[randomLocation].state,
                country: locations[randomLocation].country
            },
            image: [
                {
                    url: images[randomImage1],
                    filename: 'Summit-Seeker/meydjcd8cviz7lps2f7p'
                },
                {
                    url: images[randomImage2],
                    filename: 'Summit-Seeker/meydjcd8cviz7lps2fh7'
                },
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus iure sit iusto nisi recusandae saepe obcaecati laudantium reprehenderit assumenda similique, exercitationem, iste, ipsa corporis porro aliquid optio maxime unde debitis. Nihil repellat modi unde molestiae assumenda alias quia deserunt fuga quo, laborum qui corrupti sunt voluptate repudiandae labore deleniti harum facere voluptatum iusto vitae odio dolores? In neque esse quam!",
            author: "646dd32232a233dac9a5b8b0",
            geometry: {
                type: "Point",
                coordinates: [
                    locations[randomLocation].longitude,
                    locations[randomLocation].latitude
                ]
            }
        });

        const numRoutes = 45;
        for (let j = 0; j < numRoutes; j++) {
            const randomRoute = Math.floor(Math.random() * climbingRouteNames.length);
            const randomGrade = Math.floor(Math.random() * grades.length);

            const newRoute = new Route({
                name: climbingRouteNames[randomRoute],
                grade: grades[randomGrade],
                types: 'sport',
                pitches: Math.floor(Math.random() * 10),
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                creator: "646dd32232a233dac9a5b8b0"
            });

            newRoute.rock = newRock;  // Associate the route with the rock 
            console.log("New Route Object:", newRoute); // Debugging
            await newRoute.save();
            newRock.routes.push(newRoute); // Associate the route with the rock

        }

        await newRock.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})

