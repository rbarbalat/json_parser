//since readFile is async need to use its promises functionality

const fs = require('fs').promises;
//import { promises as fs } from "fs";

//to keep the full functionality of fs, import it and fs.promises separately

async function parse(filename)
{
    function checkObject(str)
    {
        //build key
        //build value
        return true;
    }
    function checkArray(str)
    {
        //build element
        return true;
    }
    function helper(str)
    {
        //all new lines and single space chars have already been removed
        if(str === "{}" || str === "[]") return true;

        const openClose = str[0] + str[str.length - 1];

        if(openClose === "{}") checkObject();
        if(openClose === "[]") checkArray();
        //return false;

        //can't do this b/c of commas inside arrays and objects that are values
        //const arr = str.split(",");

        //find returns undefined or the element you are searched for,
        //normally the ele is truthy but in this case it is the empty string which is falsy
        // const extraComma = arr.find(ele => ele === "") === "";
        // if(extraComma) return false;

        const special = new Set(["true", "false", "null", "undefined"]);
        //adjust indexes to exclude the opener and closer
        //iterate through the string, build key (check if valid) then build value,
        let buildKey = true;
        let buildVal = false;
        let key = "";
        let val = "";
        let i = 1;
        while(i < str.length - 1)
        {
            //first and last chars of a key must be "
            if(buildKey && key.length === 0 && str[i] !== `"`) return false;
            if(buildKey && str[i] === ":" && str[i-1] !== `"`) return false;

            //key is complete and valid
            if(buildKey && str[i] === ":" && str[i-1] === `"`)
            {
                buildKey = false;
                buildVal = true;
            }
            //keep building the key
            if(buildKey)
            {
                key += str[i]
                continue;
                //check continue in while loop
            }

            if(buildVal) val += str[i];

        }
        // for(let i = 0; i<arr.length; i++)
        // {
        //     //check that each key begins with " and ends with "
        //     const pair = arr[i].split(":");
        //     console.log(pair);

        //     const key = pair[0];
        //     if(key[0] !== `"` || key[key.length - 1] !== `"`) return false;

        //     const val = pair[1];
        //     const isNumber = parseInt(val);
        //     const isSpecial = special.has(val);
        //     const isString = val[0] === `"` && val[val.length - 1] === `"`;

        //     //make a recursive function
        //     const isObject = helper(val);

        //     const notValidValue = !(isNumber || isSpecial || isString || isObject);
        //     if(notValidValue) return false;
        // }

        return true;
    }
    const res = await fs.readFile(filename, "utf8", (err, data) => {
        if (err)
        {
          console.log(filename + " could not be opened");
          return;
        }

        if(data.length === 0)
        {
            console.log("invalid")
            return;
        }

        //check for invalid single quotes and backticks, remove spaces and new lines
        let str = "";
        for(let i = 0; i<data.length; i++)
        {
            //it is ok to also exclude spaces from inside valid strings b/c they
            //stay valid strings i.e "hello world" => "helloworld"
            if(data[i] !== "\n" && data[i] !== " ") str += data[i];

            if(data[i] === "'" || data[i] === "`")
            {
                console.log("invalid");
                return;
            }
        }

        //console.log(str);
        //console.log(str.split(","));
        // if(helper(str)) console.log("valid");
        // else            console.log("invalid");
    })
    return res
}

parse(process.argv[2]);
