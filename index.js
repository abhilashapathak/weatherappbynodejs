var PORT = process.env.PORT || 8000;
const http = require("http");
const fs = require("fs");
//install requests dependencies from npmjs.com
var requests = require('requests');
//FILE ENCODING : FETCHING ALL THE DATA OF HOME.HTML FILE IN BACKEND
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
    return temperature;
  };

//CREATING OWN SERVER TO RUN WEBSITE
const server = http.createServer((req, res) => {
    //ROUTING OF PAGES : JUMPING TO DIFF PAGES
    if (req.url == "/") {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=c05882a50acfd0dfc96e4262fc2a3d1d"
    )
    //ON : CALLING DATA TO FETCH AND PRINT
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);//converts into orignal data
                const arrData = [objdata];//data in form of array of an object
                //console.log(arrData[0].main.temp);
                //representing data in form of map
                const realTimeData = arrData.map((val) =>
                 replaceVal(homeFile, val))
                .join("");//convert html file to string
              res.write(realTimeData);//write into file
              // console.log(realTimeData);
            })
    // END : CALLING WHEN NOTHING IS TO PRINT
    .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        //console.log("end");
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");