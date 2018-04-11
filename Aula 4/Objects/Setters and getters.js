let person = {
  _name: 'Lu Xun',
  _age: 137,
  
  set age(newAge){
    if (typeof newAge === 'number'){
      this._age = newAge;
    } else {
      return 'Invalid input';
    }
  },
  
  get age() {
  console.log(`Person ${this._name} is ${this._age} years old`)
}

};

person.age = 39;
console.log(person.age);