var post        = require("./models/post");
var mongoose    = require("mongoose");
var Comment     = require("./models/comment");

var data = [
    {title: "Lorem ipsum", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {title: "Otters", body: "Otters are carnivorous mammals in the subfamily Lutrinae. The 13 extant otter species are all semiaquatic, aquatic or marine, with diets based on fish and invertebrates. Lutrinae is a branch of the weasel family Mustelidae, which also includes badgers, honey badgers, martens, minks, polecats, and wolverines."},
    {title: "Mountain Chicken", body: "Leptodactylus fallax, commonly known as the mountain chicken or giant ditch frog, is a species of frog that is native to the Caribbean islands of Dominica and Montserrat."},
    {title: "Honey Bee", body: "A honey bee (or honeybee) is any bee member of the genus Apis, primarily distinguished by the production and storage of honey and the construction of perennial, colonial nests from wax. Currently, only seven species of honey bee are recognized, with a total of 44 subspecies,[1] though historically six to eleven species are recognized."},
    {title: "Dwight Schrute", image: "http://az616578.vo.msecnd.net/files/2016/02/22/635917551508854305-1682132000_hs.jpg", body: "Dwight Kurt Schrute III /ˈdwaɪtˈkərtˈʃrut/ is a fictional character on the American TV comedy series The Office, portrayed by Rainn Wilson, and based on Gareth Keenan from the original UK version of The Office. His character is one of the highest-ranking salesmen as well as assistant to the regional manager[1] at the paper distribution company Dunder Mifflin, although the series expands on his character as bed-and-breakfast proprietor at Schrute Farms, a beet plantation, and as the owner of the business park enclosing Dunder Mifflin"}
]


function seedDB() {
    //Remove all campgrounds
    post.remove({}, function(err) {
        if(err) {
            console.log(err)
        }
        //add a few campgrounds
        data.forEach(function(seed) {
            post.create(seed, function(err, post) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("created new post");
                    Comment.create(
                        {
                            text: "This is a comment",
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                post.comments.push(comment);
                                post.save();
                                console.log("created new comment");
                            }
                        }
                    );
                }
            })
        });
    });
}

module.exports = seedDB;