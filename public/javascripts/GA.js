//Got this from codewars. CHROMOSOME here means bird. The codewars puzzle was a GA on a chromosome of strings. We're using bird objects instead.


var GeneticAlgorithm = function () {
  this.population = [];
  this.fitness = [];
};

function sum( array ){
  return array.reduce(function(result, number ){
   return result + number;
 }, 0);
}


GeneticAlgorithm.prototype.select = function(population, fitnesses) {
  var max = sum(fitnesses);
  var random = Math.random() * max;
  var total = 0;
  var index = 0;
  while( total < random ){
    total += fitnesses[index++];    
  }

  var oldBird = population[index-1];
  // var newBird = JSON.parse(JSON.stringify(oldBird));
  var newBird = jQuery.extend(true, {}, oldBird);
  return newBird;
};

GeneticAlgorithm.prototype.mutate = function(bird, p) {
  // return chromosome.split('').map(function( bit ){
  //   return (Math.random() <= p) ? ((bit - 1) * - 1) : bit;
  // }).join('');
  var layer1 = bird.brain.layer1;
  layer1.forEach(function (neuron){

    neuron.GAin.forEach(function (connection){
      if(Math.random() <= p){
        connection.weight *= -1;
      }
      neuron.connections.inputs[connection.ID] = connection;
    })

    neuron.GAout.forEach(function (connection){
      var weightChange = 0.001;
      if(Math.random() <= p){
        var upORdown = Math.floor(Math.random()*2);
        if(upORdown === 1){
          connection.weight += weightChange;
        }
        else{
          connection.weight -= weightChange;
        }
      }
      neuron.connections.projected[connection.ID] = connection;
    })
  })


  var layer2 = bird.brain.layer2;
  layer2.forEach(function (neuron){

    neuron.GAin.forEach(function (connection){
      var weightChange = 0.001;
      if(Math.random() <= p){
        var upORdown = Math.floor(Math.random()*2);
        if(upORdown === 1){
          connection.weight += weightChange;
        }
        else{
          connection.weight -= weightChange;
        }
      }
      neuron.connections.inputs[connection.ID] = connection;
    })

    neuron.GAout.forEach(function (connection){
      var weightChange = 0.001;
      if(Math.random() <= p){
        var upORdown = Math.floor(Math.random()*2);
        if(upORdown === 1){
          connection.weight += weightChange;
        }
        else{
          connection.weight -= weightChange;
        }
      }
      neuron.connections.projected[connection.ID] = connection;
    })
  })  


  return bird;
};

GeneticAlgorithm.prototype.crossover = function(bird1, bird2) {

    var B1_L1 = bird1.brain.layer1;
    var B1_L2 = bird1.brain.layer2;
    var B2_L1 = bird2.brain.layer1;
    var B2_L2 = bird2.brain.layer2;

    for(var i = 0; i < B1_L1.length; i++){ 
      if(Math.random() < 0.5){
        B1_L1[i] = B2_L1[i];
      }
    }

    for(var i = 0; i < B1_L2.length; i++){ 
      if(Math.random() < 0.5){
        B1_L2[i] = B2_L2[i];
      }
    }

 // var index = Math.ceil(Math.random()*(chromosome1.length-2));
 // return chromosome1.substr(0, index) +  chromosome2.substr(index);
 return bird1;
};



GeneticAlgorithm.prototype.run = function(p_c, p_m, iterations) {
  var population = this.population;
  var iterationCounter = 0;
  while( iterationCounter < iterations ){
    var nextPopulation = [];
    while( nextPopulation.length < population.length ){
      var chromosome1 = this.select(population, this.fitness);
      var chromosome2 = this.select(population, this.fitness);
      if( Math.random() < p_c ){
        var temp = this.crossover( chromosome1 ,  chromosome2 );
        chromosome1 = this.crossover( chromosome2 ,  chromosome1 );
        chromosome2 = temp;
      }
  
      chromosome1 = this.mutate(chromosome1, p_m);
      chromosome2 = this.mutate(chromosome2, p_m);
      
      nextPopulation.push( chromosome1 );
      nextPopulation.push( chromosome2 );
    }

    population = nextPopulation;
    iterationCounter++;
  } //<--- end of while loop

  this.population=population;



};
