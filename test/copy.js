let o1 = new Object()
o1.name = '爸爸';

let o2 = o1;

o1.age = 13

delete o1.age

console.log(o1)
console.log(o2)


