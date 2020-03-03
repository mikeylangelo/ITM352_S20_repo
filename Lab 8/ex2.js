var age=20;
var count=0;

// Exercise 2a.
while(count<=age) {
    console.log(count++);
    if(count>age/2){
        console.log("I'm young!");
        break;
    }
}

// Exercise 2b.
while(count++<age) {
    if((count>age*.5) && (count<age*.75)){
        console.log("No age zone!");
        continue;
    }
    console.log(count)
}

// Exercise 2c.
while(count++<age) {
    console.log(count);
    if(count>age*.5) process.exit("Don't ask how old I am!");
}