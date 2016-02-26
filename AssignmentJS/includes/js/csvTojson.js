/**
 * Created by GH316885 on 2/22/2016.
 */
var fs = require("fs");
var lookupTable=["Oilseeds","Agriculture","Crops","Foodgrains","Kharif","Rabi","Commercial Crops","Rice","Yield","Andhra Pradesh","Karnataka","Kerala","Tamil Nadu"];
var superTextoilseeds="Agricultural Production Oilseeds",superTextfoodGrains="Agricultural Production Foodgrains";
function naToZero(value){
    return value=="NA"?0:value;
}
function jsonFileGenerator(jsonObject,filename)//Json Generator function
{
    var data = JSON.stringify(jsonObject);
    fs.writeFile('../../jsonFile/'+filename+'.json', data, function (err) {
        if (err) {
            console.log('There has been an error saving your json file:');
            console.log(err.message);
            return;
        }
        console.log(filename+'.json:'+'File generated successfully');
    });
}
function csvToJson(){
    // Asynchronous read
    fs.readFile('../../Data/Production_Agriculture.csv', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var flag=0;
        var header=[];
        var oilSeedsJsonObject=[],foodGrainsJsonObject=[],commercialCropsJsonObj=[],riceSouthernProductionJsonObj=[];
        var oilSeedsObj={},foodGrainsObj={},commercialCropsObj={},riceSouthernProductionObj={};
        var lines=data.toString().split('\n');
        header=lines.splice(0,1);
        header=header.toString().split(',');
        header.splice(0,3);
        //Year Scanning
        for (indVal in header) {
            var year=header[indVal].trim().split('-');
            commercialCropsObj={x:"Yr"+"_"+year[1],y:0};
            commercialCropsJsonObj.push(commercialCropsObj);
            riceSouthernProductionObj={x:"Yr"+"_"+year[1],"Andhra Pradesh":0,"Karnataka":0,"Kerala":0,"Tamil Nadu":0};
            riceSouthernProductionJsonObj.push(riceSouthernProductionObj);
        }
        //Data Scanning
        for (line in lines) {
            if (lines[line].length!=0) {
                var value = lines[line].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);//For CSV quotation Handling
                //OilSeeds Filter
                if (value[0].indexOf(lookupTable[0]) >= 0) {
                    if (value[0].indexOf(lookupTable[1]) == -1 && value[0].indexOf(lookupTable[2]) == -1) {
                        if (value[0].split(' ').length > 4) {
                            oilSeedsObj = {x: value[0].replace(superTextoilseeds, ""), y: parseFloat(value[23])};
                            oilSeedsJsonObject.push(oilSeedsObj);
                        }
                    }
                }
                //FoodGrains Filter
                if (value[0].indexOf(lookupTable[3]) != -1) {
                    if (value[0].indexOf(lookupTable[4]) != -1 || value[0].indexOf(lookupTable[5]) != -1) {
                        if (value[0].indexOf(lookupTable[1]) == -1 && value[0].split(' ').length >= 5) {
                            if (value[0].lastIndexOf(lookupTable[3]) == value[0].indexOf(lookupTable[3])) {
                                foodGrainsObj = {
                                    x: value[0].replace(superTextfoodGrains, ""),
                                    y: parseFloat(value[23])
                                };
                                foodGrainsJsonObject.push(foodGrainsObj);
                            }
                        }
                    }

                }
                //CommercialCrops Filter
                if (value[0].indexOf(lookupTable[6]) != -1 && value[0].split(' ').length == 5) {
                    for (var i = 3; i < 25; i++) {
                        value[i] = naToZero(value[i].trim());
                        commercialCropsJsonObj[i - 3].y +=parseFloat(value[i]);
                        commercialCropsJsonObj[i-3].y=Math.ceil(commercialCropsJsonObj[i-3].y*1000)/1000;
                    }

                }
                //Southern India Rice Production Filter
                if (value[0].indexOf(lookupTable[7]) != -1 && value[0].indexOf(lookupTable[8]) != -1) {
                    if (value[0].indexOf(lookupTable[9]) != -1 || value[0].indexOf(lookupTable[10]) != -1 || value[0].indexOf(lookupTable[11]) != -1 || value[0].indexOf(lookupTable[12]) != -1) {
                        for (var i = 3; i < 25; i++) {
                            value[i] = naToZero(value[i].trim());
                            if (value[0].indexOf(lookupTable[9]) != -1) {
                                riceSouthernProductionJsonObj[i - 3]["Andhra Pradesh"] += parseFloat(value[i]);
                            }
                            if (value[0].indexOf(lookupTable[10]) != -1) {
                                riceSouthernProductionJsonObj[i - 3]["Karnataka"] += parseFloat(value[i]);
                            }
                            if (value[0].indexOf(lookupTable[11]) != -1) {
                                riceSouthernProductionJsonObj[i - 3]["Kerala"] += parseFloat(value[i]);
                            }
                            if (value[0].indexOf(lookupTable[12]) != -1) {
                                riceSouthernProductionJsonObj[i - 3]["Tamil Nadu"] += parseFloat(value[i]);
                            }
                        }

                    }

                }
        }
            else{
                break;
            }
        }
        //Sorting the oilSeeds Production in descending order
        oilSeedsJsonObject.sort(function (a, b) {
            return b.y - a.y;
        });
        //sorting the foodGrains Production in descending order
        foodGrainsJsonObject.sort(function (a, b) {
            return b.y - a.y
        });
        //calling the jsonfile Generator function for OilseedsJsonObject
        jsonFileGenerator(oilSeedsJsonObject, "oilSeeds");
        //calling the jsonfile Generator function for foodGrains
        jsonFileGenerator(foodGrainsJsonObject, "foodGrains");
        //calling the jsonfile Generator function for commercialCropsJsonObjects
        jsonFileGenerator(commercialCropsJsonObj, "commercialCrops");
        //calling the jsonfile Generator function for riceSouthernProductionJsonObjects
        jsonFileGenerator(riceSouthernProductionJsonObj, "riceSouthernProduction");
    });
}
//Calling the csvToJson function for generating the required json file.
csvToJson();
