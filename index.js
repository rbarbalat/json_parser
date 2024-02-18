const fs = require("fs");

function parse(filename)
{
    fs.readFile(filename, "utf8", (err, data) => {
        if (err) {
          console.log(filename + " could not be opened");
          return;
        }

        //the string must represent either an object or an array
        //must start/end with { and } or [ and ]

        const obj = {
            "{": "}",
            "[": "]"
        }

        //remove spaces and "\n" from before and after the obj/array starts
        data = data.trim();
        //console.log(data);

        const emptyFile = data.length === 0;
        const invalidOpen = obj[data[0]] === undefined;
        const invalidClose = data.length === 1 || obj[data[0]] !== data[data.length - 1];

        //console.log(emptyFile);
        //console.log(invalidOpen);
        //console.log(invalidClose);

        if(emptyFile || invalidOpen || invalidClose)
        {
            console.log("invalid");
            return;
        }

        let str = "";
        //loop excludes zeroeth and final indexes
        for(let i = 1; i<data.length-1; i++)
        {
            if(data[i] !== "\n" && data[i] !== " ") str += data[i];

            if(data[i] === "'" || data[i] === "`")
            {
                console.log("invalid");
                return;
            }
        }

        //data was "{}" or "[]"
        if(str.length === 0)
        {
            console.log("valid");
            return;
        }

        const arr = str.split(",");
        //console.log(arr);

        //since the zeroeth and last ele aren't included in the string
        //any comma directly to the left of the opening symbol or
        //directly to the right of the closing symbol
        //or several in a row will result in the emptry string being an element of arr

        //find returns undefined or the element you are searched for,
        //normally the ele is truthy but in this case it is the empty string which is falsy
        const extraComma = arr.find(ele => ele === "") === "";
        if(extraComma)
        {
            console.log("invalid");
            return;
        }

        for(let i = 0; i<arr.length; i++)
        {
            //check that each key begins with " and ends with "
            const key = arr[i].split(":")[0];
            if(key[0] !== '"' || key[key.length - 1] !== '"')
            {
                console.log("invalid");
                return;
            }
        }

        console.log("valid");

    });
}

//readFile is async
parse(process.argv[2]);
