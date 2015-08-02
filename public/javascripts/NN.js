var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

Array.prototype.populate = function (num) {
	for(var i = 0; i < num; i++){
		this.push(new Neuron());
	}
}


Array.prototype.linkToLayer = function (arr) {
	if(!Array.isArray(arr)) return;
	this.forEach(function(inNeuron){
		arr.forEach(function(outNeuron){
			inNeuron.project(outNeuron);
		})
	})
}




function neuronIOarrayMoveUp(neuron){
			var inputs = neuron.connections.inputs
			var inputsArray = [];
			for (var key in inputs) {
				if (inputs.hasOwnProperty(key)) {
					var obj = inputs[key];
					inputsArray.push(obj);
				}
			}
			neuron.GAin = inputsArray;


			var outputs = neuron.connections.projected
			var outputsArray = [];
			for (var key in outputs) {
				if (outputs.hasOwnProperty(key)) {
					var obj = outputs[key];
					outputsArray.push(obj);
				}
			}
			neuron.GAout = outputsArray;
}

Array.prototype.activate = function(){
	var output = [];

	//Mid Layers
	if(arguments.length === 0){
		this.forEach(function(neuron){
			neuronIOarrayMoveUp(neuron);
			output.push(neuron.activate());
		})
		return output;
	}
	if (arguments.length !== this.length){
		console.error("ERROR: # of input !=== number of neurons in the layer")
		return;
	} 

	//Input Layer
	for (var i = 0; i < arguments.length; i++){
		output.push(this[i].activate(arguments[i]));
	}
	return output;
}

Array.prototype.propagate = function(){
	if(arguments.length === 0){
		this.forEach(function(neuron){
			neuron.propagate()
		})
		return;
	}

	//Output Layer
	for (var i = 0, j = 0; i < arguments.length; i+=2, j++){
		this[j].propagate(arguments[i], arguments[i+1]);
	}
}


function Brain(){
	this.input = [];
	this.layer1 = [];
	this.layer2 = [];
	this.output = [];

	this.input.populate(4);
	this.input[0].name = "enemy";
	this.input[1].name = "bullet";
	this.input[2].name = "shot";
	this.input[3].name = "FOV";


	this.layer1.populate(5);
	this.layer1[0].name = "L1 N1"
	this.layer1[1].name = "L1 N2"
	this.layer1[2].name = "L1 N3"
	this.layer1[3].name = "L1 N4"
	this.layer1[4].name = "L1 N5"


	this.layer2.populate(5);
	this.layer2[0].name = "L2 N1"
	this.layer2[1].name = "L2 N2"
	this.layer2[2].name = "L2 N3"
	this.layer2[3].name = "L2 N4"
	this.layer2[4].name = "L2 N5"


	this.output.populate(5);
	this.output[0].name = "up";
	this.output[1].name = "left";
	this.output[2].name = "right";
	this.output[3].name = "shoot";
	this.output[4].name = "changeFOV";

	this.input.linkToLayer(this.layer1);
	this.layer1.linkToLayer(this.layer2);
	this.layer2.linkToLayer(this.output);
	this.output[4].project(this.layer2[4]);
}



	// this.input[0].name = "enemy";
	// this.input[1].name = "bullet";
	// this.input[2].name = "shot";
	// this.input[3].name = "FOV";

	// this.output[0].name = "up";
	// this.output[1].name = "left";
	// this.output[2].name = "right";
	// this.output[3].name = "shoot";
	// this.output[4].name = "changeFOV";

Brain.prototype.propagate = function(shot, fov){

	var randFoV = Math.random()*2;
	var randShot = Math.random();

	this.input.activate(1, 0, 1, 0.05); //narrow FOV + see enemy  = shoot
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 0,
												0.3, 0,
												0.3, 0,
												0.3, 1,
												0.3, 0);

	this.layer2.propagate(0.3, 0,
												0.3, 0,
												0.3, 0,
												0.3, 1,
												0.3, 0);
	this.layer1.propagate();

	this.input.activate(1, 0, 0, 0.05); //narrow FOV + see enemy + just shot 
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 1,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 0);

	this.layer2.propagate(0.3, 1,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 0);
	this.layer1.propagate();

	this.input.activate(0, 0, 1, 0.05); //narrow FOV + no enemy + can shoot = sentry mode
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 0,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 0);

	this.layer2.propagate(0.3, 0,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 0);
	this.layer1.propagate();

	this.input.activate(0, 0, 0, 0.05); //narrow FOV + no enemy + cant shoot = rotate & move
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 1,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 0);

	this.layer2.propagate(0.3, 1,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 0);
	this.layer1.propagate();

	this.input.activate(1, 0, 1, 0.30); //Giant FOV + see enemy = narrow FoV or shoot
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 0,
												0.3, 0,
												0.3, 0,
												0.3, 1,
												0.3, 1);

	this.layer2.propagate(0.3, 0,
												0.3, 0,
												0.3, 0,
												0.3, 1,
												0.3, 1);
	this.layer1.propagate();

	this.input.activate(1, 0, 0, 0.30); //Giant FOV + see enemy + cant shoot = reduce FoV or rotate
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 0,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 1);
	this.layer2.propagate(0.3, 0,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 1);
	this.layer1.propagate();

	this.input.activate(0, 1, 0, 0.30); //See bullet, cannot shoot. Move around then
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 1,
												0.3, 0,
												0.3, 0,
												0.3, 0,
												0.3, 0);
	this.layer2.propagate(0.3, 1,
												0.3, 0,
												0.3, 0,
												0.3, 0,
												0.3, 0);
	this.layer1.propagate();

		this.input.activate(0, 1, 0, 0.05); //See bullet, cannot shoot. Move around then
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 1,
												0.3, 0,
												0.3, 0,
												0.3, 0,
												0.3, 0);
	this.layer2.propagate(0.3, 1,
												0.3, 0,
												0.3, 0,
												0.3, 0,
												0.3, 0);
	this.layer1.propagate();

	this.input.activate(1, 1, 1, 0.05); //See everything but can shoot with narrow FoV? FIRE AT WILL
	this.layer1.activate();
	this.layer2.activate();
	this.output.activate();
	this.output.propagate(0.3, 1,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 0);

	this.layer2.propagate(0.3, 1,
												0.3, 1,
												0.3, 1,
												0.3, 0,
												0.3, 0);
	this.layer1.propagate();

}



Brain.prototype.activate = function(en, bu, sh, fo){
	var inpu = this.input.activate(en, bu, sh, fo);
	var lay1 = this.layer1.activate();
	var lay2 = this.layer2.activate();
	var outp = this.output.activate();
	return outp;
}


var Bird = function(name, loc){
	this.loc = loc || [0,0]; //[x,y]
	this.name = name;
	this.brain = new Brain();
	this.facing = Math.random()*2;
	this.FoV = Math.random()*0.3+0.05;
	this.hasShot = 1; //Has shot is really "Is ready to shoot" when it is 1. Kind of like a clip, if you will.
	this.HP = 3;
	this.fitness = 0.00001;
	this.supervised = this.brain.propagate;

	for(var i = 0; i < 50; i++){
		this.brain.propagate(this.hasShot, this.fov);
	}
}

Bird.prototype.think = function(en, bu){
	if(this.hasShot > 1) this.hasShot = 1;
	if(this.hasShot < 0) this.hasShot = 0;

	//This is rate of fire. Each cycle, hasShot decreases a bit.
	this.hasShot += 0.05;
	if(this.FoV > 0.35){
		this.FoV = 0.35;
	}
	if(this.FoV < 0) this.FoV = 0.001;
	this.FoV += 0.005;

	var neuralOutput = this.brain.activate(en, bu, this.hasShot, this.fov);
	return neuralOutput;
}

Bird.prototype.gotHit = function(){
	this.HP -= 1;
}