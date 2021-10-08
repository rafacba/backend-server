myArray = [1, 3, 4, 7, 0];


for (let i = 0; i < myArray.length; i++) {

    for (let pos in myArray) {

        if (pos != i) {

            //console.log(myArray[i] + "----" + myArray[pos]);

            if (myArray[i] + myArray[pos] == 10) {
                console.log(myArray[i] + " " + myArray[pos]);
            }
        }
    }
}


myArray1 = [42, 3, 5, 6, 8, 2, 54, 23, 2, 4, 6];

var mayor = myArray1[0];

for (let i in myArray1) {
    if (mayor < myArray1[i]) {
        mayor = myArray1[i];
    }
}

console.log(mayor);